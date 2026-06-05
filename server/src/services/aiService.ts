import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config/config";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

export const generateQuestionsByAI = async (theme: string, count: number = 10) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate ${count} quiz questions about the theme: "${theme}".
    The output MUST be a valid JSON array of objects with the following structure:
    {
      "category": "string",
      "type": "multiple",
      "difficulty": "medium",
      "question": "string",
      "correct_answer": "string",
      "incorrect_answers": ["string", "string", "string"],
      "all_answers": ["string", "string", "string", "string"]
    }
    Ensure "all_answers" contains both the "correct_answer" and "incorrect_answers" in a shuffled order.
    The response must contain ONLY the JSON array, no other text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown formatting
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating questions with AI:", error);
    throw new Error("Failed to generate AI questions");
  }
};
