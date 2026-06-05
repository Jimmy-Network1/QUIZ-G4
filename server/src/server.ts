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

// Check for JWT_SECRET
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1); // Exit if JWT_SECRET is not set
}

connectDB();

const app = express();

app.use(logRequests);
app.use(express.json());
app.use(cors());

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
