import { Socket } from "socket.io";
import Tournament from "../../models/Tournament";

export const registerTournamentHandlers = (socket: Socket) => {
  socket.on("tournament_join", async (data: { tournamentId: string, userId: string, userName: string }) => {
    socket.join(`tournament_${data.tournamentId}`);
    // Notify room of new participant
    socket.to(`tournament_${data.tournamentId}`).emit("participant_joined", { 
        userId: data.userId, 
        userName: data.userName 
    });
    
    // Get updated count
    const tournament = await Tournament.findById(data.tournamentId);
    if (tournament) {
        socket.nsp.to(`tournament_${data.tournamentId}`).emit("participant_count", tournament.participants.length);
    }
  });

  socket.on("tournament_start", (data: { tournamentId: string }) => {
    // Only creator should trigger this, but for now we trust the client or check creatorId
    socket.to(`tournament_${data.tournamentId}`).emit("tournament_started", { tournamentId: data.tournamentId });
  });

  socket.on("match_completed", async (data: { tournamentId: string, matchId: string, winnerId: string }) => {
    // Logic to update bracket and notify next players
    // This part is complex and usually requires a service to check if the round is finished
    console.log(`Match ${data.matchId} in tournament ${data.tournamentId} won by ${data.winnerId}`);
  });
};
