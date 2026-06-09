import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";
import tournamentRoutes from "./routes/tournamentRoutes";
import aiRoutes from "./routes/aiRoutes";
import { initializeSocket } from "./socket/socket";
import { JWT_SECRET } from "./config/config";
import { logRequests } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import connectDB from "./config/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./config/config";

// Check for JWT_SECRET
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Fonction de diagnostic pour lister les modèles disponibles
const listGeminiModels = async () => {
  if (!GEMINI_API_KEY) {
    console.warn("⚠️ DIAGNOSTIC IA: Aucune clé GEMINI_API_KEY trouvée.");
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log("🔍 DIAGNOSTIC IA: Recherche des modèles disponibles sur votre compte...");
    
    // Note: Dans les versions récentes du SDK, on peut utiliser listModels()
    // Si listModels n'est pas directement sur genAI, on teste les modèles classiques
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    for (const m of models) {
      try {
        const testModel = genAI.getGenerativeModel({ model: m });
        console.log(`📡 Modèle testé : ${m} -> Configuré (en attente de test de contenu)`);
      } catch (e) {
        console.log(`❌ Modèle testé : ${m} -> Non supporté`);
      }
    }
  } catch (err: any) {
    console.error("❌ ERREUR LORS DU DIAGNOSTIC IA:", err.message);
  }
};

connectDB();
listGeminiModels();

const app = express();

app.use(logRequests);
app.use(express.json());
app.use(cors());

// Log de traçabilité immédiat pour le debug
app.use((req, _res, next) => {
  console.log(`📡 REQUÊTE REÇUE: ${req.method} ${req.url} à ${new Date().toISOString()}`);
  next();
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/ai", aiRoutes);

// Health check route
app.get("/", (_req, res) => res.status(200).send("OK"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initializeSocket(server);
