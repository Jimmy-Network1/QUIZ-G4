import { Router } from "express";
import * as aiController from "../controllers/aiController";

const router = Router();

router.post("/generate", aiController.generateAIQuiz);

export default router;
