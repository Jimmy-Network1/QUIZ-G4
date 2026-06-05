import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer, Namespace } from "socket.io";
import { registerConnectionHandlers } from "./handlers/connectionHandlers";
import { registerGameplayHandlers } from "./handlers/gameplayHandlers";
import { registerQuestionHandlers } from "./handlers/questionHandlers";
import { registerRoomHandlers } from "./handlers/roomHandlers";
import { registerUserHandlers } from "./handlers/userHandlers";
import { registerTournamentHandlers } from "./handlers/tournamentHandlers";

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  const socketNamespace: Namespace = io.of("/socket");

  socketNamespace.on("connection", (socket: Socket) => {
    console.log("A user connected to socket🔌:", socket.id);

    registerConnectionHandlers(socket);
    registerGameplayHandlers(socket);
    registerQuestionHandlers(socket);
    registerRoomHandlers(socket);
    registerUserHandlers(socket);
    registerTournamentHandlers(socket);
  });
};
