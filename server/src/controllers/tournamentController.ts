import { Request, Response } from "express";
import Tournament, { IRound, IMatch } from "../models/Tournament";
import mongoose from "mongoose";

export const createTournament = async (req: Request, res: Response) => {
  const { name, creatorId, mode, category } = req.body;
  try {
    const tournament = new Tournament({
      name,
      creator: creatorId,
      mode,
      category,
      participants: [creatorId],
    });
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error creating tournament", error });
  }
};

export const joinTournament = async (req: Request, res: Response) => {
  const { tournamentId, userId } = req.body;
  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });
    if (tournament.status !== "registration") return res.status(400).json({ message: "Registration closed" });
    
    if (!tournament.participants.includes(userId)) {
      tournament.participants.push(userId);
      await tournament.save();
    }
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error joining tournament", error });
  }
};

export const startTournament = async (req: Request, res: Response) => {
  const { tournamentId } = req.body;
  try {
    const tournament = await Tournament.findById(tournamentId).populate("participants");
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    // Generate first round matches
    const participants = [...tournament.participants];
    // Shuffle participants
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    const matches: IMatch[] = [];
    for (let i = 0; i < participants.length; i += 2) {
      matches.push({
        player1: participants[i] as any,
        player2: (participants[i + 1] || null) as any,
        winner: null,
        roomId: null,
        status: participants[i + 1] ? "pending" : "completed", // Automatic win if solo
      });
      if (!participants[i + 1]) {
          matches[matches.length-1].winner = participants[i] as any;
      }
    }

    const firstRound: IRound = {
      roundNumber: 1,
      matches: matches,
    };

    tournament.rounds = [firstRound];
    tournament.status = "in_progress";
    tournament.currentRound = 1;
    await tournament.save();

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error starting tournament", error });
  }
};

export const getActiveTournaments = async (req: Request, res: Response) => {
    try {
        const tournaments = await Tournament.find({ status: "registration" }).populate("creator", "userName");
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tournaments", error });
    }
};
