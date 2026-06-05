import { Router } from "express";
import * as tournamentController from "../controllers/tournamentController";

const router = Router();

router.get("/active", tournamentController.getActiveTournaments);
router.post("/create", tournamentController.createTournament);
router.post("/join", tournamentController.joinTournament);
router.post("/start", tournamentController.startTournament);

export default router;
