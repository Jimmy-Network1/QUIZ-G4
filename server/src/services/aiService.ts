import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config/config";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

export const generateQuestionsByAI = async (
  theme: string, 
  count: number = 10, 
  fileData?: { data: string; mimeType: string }
) => {
  if (!GEMINI_API_KEY) {
    // ... (mode démo inchangé pour le texte)
    console.warn("GEMINI_API_KEY is missing. Returning mock questions.");
    return Array(count).fill(null).map((_, i) => ({
      category: theme || "Analyse Multimodale",
      type: "multiple",
      difficulty: "medium",
      question: `Question ${i + 1} (Mode Démo) : Basé sur l'entrée ${fileData ? 'multimodale' : 'textuelle'} "${theme}", quelle est la notion clé ?`,
      correct_answer: "Réponse A",
      incorrect_answers: ["Réponse B", "Réponse C", "Réponse D"],
      all_answers: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"].sort(() => Math.random() - 0.5)
    }));
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt = `
    Agis en tant qu'expert pédagogique et maître de jeu créatif. Génère ${count} questions de quiz complexes, dynamiques et variées.
    L'output MUST be in FRENCH.
    
    CONSIGNE GÉNÉRALE :
    - Ne te limite pas au milieu scolaire. Adapte-toi au contexte fourni (audio, image ou texte).
    - Les questions doivent être stimulantes, basées sur l'analyse de détails, la déduction ou la culture générale liée au sujet.
    - Évite les questions trop simples.
    
    STRUCTURE DE SORTIE (JSON UNIQUEMENT) :
    [{
      "category": "string",
      "type": "multiple",
      "difficulty": "easy|medium|hard",
      "question": "string",
      "correct_answer": "string",
      "incorrect_answers": ["string", "string", "string"],
      "all_answers": ["string", "string", "string", "string"]
    }
    `;

    const contentParts: any[] = [];

    if (fileData) {
    prompt += ` 
    CONTEXTE MULTIMODAL :
    Analyse attentivement le fichier fourni. 
    - S'il s'agit d'une personne qui parle, base les questions sur son identité, ses propos, son ton ou les informations qu'elle partage.
    - S'il s'agit d'une image, base les questions sur les éléments visuels, le texte écrit, les symboles ou les concepts suggérés par l'image.
    - Sois précis et utilise des détails spécifiques au média.`;
    contentParts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType
      }
    });
  } else {
    prompt += ` Thème principal : "${theme}".`;
  }

  // Ajout de dynamisme basé sur les participants (si l'info est un jour passée au serveur)
  prompt += ` Note : Si tu perçois des noms de participants dans le contexte, n'hésite pas à les intégrer avec humour ou défi dans certaines questions.`;

  contentParts.push(prompt);

  try {
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating questions with AI:", error);
    throw new Error("Failed to generate AI questions");
  }
};
