import { Socket } from "socket.io";
import User from "../../models/Users";

export const registerGameplayHandlers = (socket: Socket) => {
  socket.on("update_score_and_state", (data) => {
    socket.broadcast.emit("opponent_update_state", data);
  });

  socket.on("game_over", async (data: { userId: string, score: number }) => {
    try {
      await User.findByIdAndUpdate(data.userId, {
        $inc: { totalScore: data.score, gamesPlayed: 1 }
      });
      console.log(`Score updated for user ${data.userId}`);
    } catch (error) {
      console.error("Error updating final score:", error);
    }
  });
};
