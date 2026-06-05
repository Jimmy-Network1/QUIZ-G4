import { Request, Response } from "express";
import { generateQuestionsByAI } from "../services/aiService";

export const generateAIQuiz = async (req: Request, res: Response) => {
  const { theme, count } = req.body;
  
  if (!theme) {
    return res.status(400).json({ message: "Theme is required" });
  }

  try {
    const questions = await generateQuestionsByAI(theme, count || 10);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "AI generation failed", error: (error as Error).message });
  }
};
