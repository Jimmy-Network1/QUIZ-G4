import { MISTRAL_API_KEY } from "../config/config";

export const generateQuestionsByAI = async (
  theme: string, 
  count: number = 10, 
  fileData?: { data: string; mimeType: string }
) => {
  // Mode Démo si pas de clé API
  if (!MISTRAL_API_KEY) {
    console.warn("MISTRAL_API_KEY is missing. Returning mock questions.");
    return generateMockQuestions(theme, count);
  }

  // Avertissement Multimodal (Mistral standard est texte uniquement)
  if (fileData) {
    console.warn("⚠️ Mistral AI (Text Mode) ne supporte pas nativement l'audio/image dans cette version. Analyse basée sur le thème uniquement.");
  }

  const prompt = `
    Agis en tant qu'expert pédagogique et maître de jeu créatif. Génère ${count} questions de quiz complexes, dynamiques et variées sur le thème : "${theme}".
    L'output MUST be in FRENCH.
    
    STRUCTURE DE SORTIE (JSON UNIQUEMENT, pas de texte avant ou après) :
    [{
      "category": "${theme}",
      "type": "multiple",
      "difficulty": "medium",
      "question": "la question ici",
      "correct_answer": "la bonne réponse",
      "incorrect_answers": ["fausse1", "fausse2", "fausse3"],
      "all_answers": ["réponse1", "réponse2", "réponse3", "réponse4"]
    }]
    
    IMPORTANT : Mélange bien le tableau "all_answers".
  `;

  console.log(`🧠 Requête Mistral AI reçue pour: "${theme}" (Clé: ${MISTRAL_API_KEY.substring(0, 4)}***)`);

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "open-mistral-7b", // Modèle rapide et efficace
        messages: [
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }, // Force le format JSON si supporté
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mistral Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const result: any = await response.json();
    const content = result.choices[0].message.content;
    
    // Nettoyage au cas où
    const cleanedText = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Mistral peut parfois renvoyer un objet global au lieu d'un tableau direct
    let parsed = JSON.parse(cleanedText);
    if (!Array.isArray(parsed) && (parsed as any).questions) {
        parsed = (parsed as any).questions;
    }
    
    return parsed;

  } catch (error: any) {
    console.error("❌ ÉCHEC MISTRAL AI:", error.message);
    return generateMockQuestions(theme, count);
  }
};

const generateMockQuestions = (theme: string, count: number) => {
    return Array(count).fill(null).map((_, i) => ({
        category: theme || "Secours Mistral",
        type: "multiple",
        difficulty: "medium",
        question: `Question ${i + 1} (Mode Secours) : Basé sur "${theme}", quelle est la notion clé ?`,
        correct_answer: "La persévérance",
        incorrect_answers: ["La chance", "L'argent", "Le hasard"],
        all_answers: ["La persévérance", "La chance", "L'argent", "Le hasard"].sort(() => Math.random() - 0.5)
    }));
};
