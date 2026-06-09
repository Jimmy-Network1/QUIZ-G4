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
import { MISTRAL_API_KEY } from "./config/config";

// Check for JWT_SECRET
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Fonction de diagnostic pour Mistral AI
const checkMistralStatus = async () => {
  if (!MISTRAL_API_KEY) {
    console.warn("⚠️ DIAGNOSTIC IA: Aucune clé MISTRAL_API_KEY trouvée.");
    return;
  }
  
  try {
    console.log("🔍 DIAGNOSTIC IA: Vérification de la connexion à Mistral AI...");
    const response = await fetch("https://api.mistral.ai/v1/models", {
      headers: { "Authorization": `Bearer ${MISTRAL_API_KEY}` }
    });
    
    if (response.ok) {
        console.log("✅ Connexion à Mistral AI établie avec succès.");
    } else {
        console.error(`❌ Échec diagnostic Mistral: Status ${response.status}`);
    }
  } catch (err: any) {
    console.error("❌ ERREUR RÉSEAU MISTRAL:", err.message);
  }
};

connectDB();
checkMistralStatus();

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
