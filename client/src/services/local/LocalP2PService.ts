import TcpSocket from 'react-native-tcp-socket';
import {
  LOCAL_TCP_PORT,
  MAX_LOCAL_TOURNAMENT_PLAYERS,
} from '../../constants/local';
import {
  LocalGameMode,
  LocalMessage,
  LocalMessageHandler,
  LocalPlayer,
} from '../../types/LocalP2P';
import {QuestionInterface} from '../../types/questions';

type Socket = ReturnType<typeof TcpSocket.createConnection> extends infer T
  ? T
  : never;

class LocalP2PService {
  private server: ReturnType<typeof TcpSocket.createServer> | null = null;
  private clientSocket: Socket | null = null;
  private clientConnections = new Map<string, Socket>();
  private buffers = new Map<string, string>();
  private players: LocalPlayer[] = [];
  private messageHandler: LocalMessageHandler | null = null;
  private isHost = false;
  private localPlayerId = '';
  private localPseudo = '';
  private currentGameMode: LocalGameMode = '1v1';

  setMessageHandler(handler: LocalMessageHandler | null) {
    this.messageHandler = handler;
  }

  setLocalIdentity(playerId: string, pseudo: string) {
    this.localPlayerId = playerId;
    this.localPseudo = pseudo;
  }

  getPlayers(): LocalPlayer[] {
    return [...this.players];
  }

  isHosting(): boolean {
    return this.isHost;
  }

  startHost(gameMode: LocalGameMode, onReady?: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isHost = true;
        this.currentGameMode = gameMode;
        this.players = [
          {
            id: this.localPlayerId,
            pseudo: this.localPseudo,
            score: 0,
            socketId: 'host',
          },
        ];

        this.server = TcpSocket.createServer(socket => {
          const socketId = `${Date.now()}_${Math.random()}`;
          this.clientConnections.set(socketId, socket as Socket);
          this.setupSocket(socket as Socket, socketId);
        });

        this.server.listen({port: LOCAL_TCP_PORT, host: '0.0.0.0'}, () => {
          onReady?.();
          resolve();
        });

        this.server.on('error', (error: Error) => {
          this.emit({type: 'ERROR', message: error.message});
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  connectToHost(hostIp: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isHost = false;
        const socket = TcpSocket.createConnection(
          {port: LOCAL_TCP_PORT, host: hostIp},
          () => {
            this.clientSocket = socket as Socket;
            this.setupSocket(socket as Socket, 'client');
            this.send({
              type: 'JOIN',
              playerId: this.localPlayerId,
              pseudo: this.localPseudo,
            });
            resolve();
          },
        );

        socket.on('error', (error: Error) => {
          this.emit({type: 'ERROR', message: error.message});
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  startGame(questions: QuestionInterface[], gameMode: LocalGameMode) {
    this.currentGameMode = gameMode;
    this.broadcast({
      type: 'START_GAME',
      questions,
      gameMode,
    });
  }

  sendScoreUpdate(playerScore: number, nextQuestionIndex: number) {
    if (this.isHost) {
      const host = this.players.find(p => p.id === this.localPlayerId);
      if (host) {
        host.score = playerScore;
      }
      this.broadcastLobby();
      this.clientConnections.forEach((_, socketId) => {
        this.sendToSocket(socketId, {
          type: 'OPPONENT_SCORE',
          opponentScore: playerScore,
          nextQuestionIndex,
        });
      });
      return;
    }

    this.send({
      type: 'SCORE_UPDATE',
      playerId: this.localPlayerId,
      playerScore,
      nextQuestionIndex,
    });
  }

  endGame(rankings: {pseudo: string; score: number}[]) {
    this.broadcast({type: 'GAME_OVER', rankings});
  }

  disconnect() {
    this.clientConnections.forEach(socket => socket.destroy());
    this.clientConnections.clear();
    this.buffers.clear();
    this.clientSocket?.destroy();
    this.clientSocket = null;
    this.server?.close();
    this.server = null;
    this.players = [];
    this.isHost = false;
    this.messageHandler = null;
  }

  private setupSocket(socket: Socket, socketId: string) {
    this.buffers.set(socketId, '');

    socket.on('data', (data: string | Uint8Array) => {
      const chunk =
        typeof data === 'string'
          ? data
          : String.fromCharCode(...Array.from(data));
      const current = (this.buffers.get(socketId) ?? '') + chunk;
      this.buffers.set(socketId, current);
      this.processBuffer(socketId);
    });

    socket.on('close', () => {
      this.clientConnections.delete(socketId);
      this.buffers.delete(socketId);
      if (this.isHost) {
        this.players = this.players.filter(p => p.socketId !== socketId);
        this.broadcastLobby();
      }
    });

    socket.on('error', () => {
      this.clientConnections.delete(socketId);
      this.buffers.delete(socketId);
    });
  }

  private processBuffer(socketId: string) {
    let buffer = this.buffers.get(socketId) ?? '';
    let newlineIndex = buffer.indexOf('\n');

    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (line) {
        try {
          const message = JSON.parse(line) as LocalMessage;
          this.handleMessage(message, socketId);
        } catch {
          // ignore malformed lines
        }
      }
      newlineIndex = buffer.indexOf('\n');
    }

    this.buffers.set(socketId, buffer);
  }

  private handleMessage(message: LocalMessage, socketId: string) {
    if (this.isHost && message.type === 'JOIN') {
      const maxPlayers =
        this.currentGameMode === '1v1' ? 2 : MAX_LOCAL_TOURNAMENT_PLAYERS;
      if (this.players.length >= maxPlayers) {
        return;
      }

      this.players.push({
        id: message.playerId,
        pseudo: message.pseudo,
        score: 0,
        socketId,
      });
      this.broadcastLobby();
      return;
    }

    if (this.isHost && message.type === 'SCORE_UPDATE') {
      const player = this.players.find(p => p.id === message.playerId);
      if (player) {
        player.score = message.playerScore;
      }
      this.broadcastLobby();

      if (this.currentGameMode === '1v1') {
        this.emit({
          type: 'OPPONENT_SCORE',
          opponentScore: message.playerScore,
          nextQuestionIndex: message.nextQuestionIndex,
        });

        this.clientConnections.forEach((_, sid) => {
          if (sid !== socketId) {
            this.sendToSocket(sid, {
              type: 'OPPONENT_SCORE',
              opponentScore: message.playerScore,
              nextQuestionIndex: message.nextQuestionIndex,
            });
          }
        });
      }
      return;
    }

    this.emit(message);
  }

  private broadcastLobby() {
    this.broadcast({type: 'LOBBY_UPDATE', players: this.players});
  }

  private broadcast(message: LocalMessage) {
    const payload = `${JSON.stringify(message)}\n`;
    this.clientConnections.forEach(socket => {
      socket.write(payload);
    });
    this.emit(message);
  }

  private sendToSocket(socketId: string, message: LocalMessage) {
    const socket = this.clientConnections.get(socketId);
    if (socket) {
      socket.write(`${JSON.stringify(message)}\n`);
    }
  }

  private send(message: LocalMessage) {
    const payload = `${JSON.stringify(message)}\n`;
    if (this.isHost) {
      this.clientConnections.forEach(socket => socket.write(payload));
    } else {
      this.clientSocket?.write(payload);
    }
  }

  private emit(message: LocalMessage) {
    this.messageHandler?.(message);
  }
}

export default new LocalP2PService();
