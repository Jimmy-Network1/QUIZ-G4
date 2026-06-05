import { Router } from "express";
import * as userController from "../controllers/userController";
import * as leaderboardController from "../controllers/leaderboardController";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.loginUser);
router.delete("/delete-user", userController.deleteUser);
router.get("/leaderboard", leaderboardController.getLeaderboard);

export default router;
