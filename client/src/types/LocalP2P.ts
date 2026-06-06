import {QuestionInterface} from './questions';

export type LocalGameMode = '1v1' | 'tournament';

export interface LocalPlayer {
  id: string;
  pseudo: string;
  score: number;
  socketId: string;
}

export type LocalMessage =
  | {type: 'JOIN'; playerId: string; pseudo: string}
  | {type: 'LOBBY_UPDATE'; players: LocalPlayer[]}
  | {
      type: 'START_GAME';
      questions: QuestionInterface[];
      gameMode: LocalGameMode;
    }
  | {
      type: 'SCORE_UPDATE';
      playerId: string;
      playerScore: number;
      nextQuestionIndex: number;
    }
  | {
      type: 'OPPONENT_SCORE';
      opponentScore: number;
      nextQuestionIndex: number;
    }
  | {type: 'GAME_OVER'; rankings: {pseudo: string; score: number}[]}
  | {type: 'ERROR'; message: string};

export type LocalMessageHandler = (message: LocalMessage) => void;
