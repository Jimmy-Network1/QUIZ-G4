import { Request, Response } from "express";
import User from "../models/Users";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const topPlayers = await User.find()
      .sort({ totalScore: -1 })
      .limit(10)
      .select("userName totalScore gamesPlayed");
    
    res.status(200).json(topPlayers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};

export const updatePlayerScore = async (req: Request, res: Response) => {
  const { userId, score } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { totalScore: score, gamesPlayed: 1 } 
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating score", error });
  }
};
