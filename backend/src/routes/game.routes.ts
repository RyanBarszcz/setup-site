import { Router } from "express";
import { getGames, getPopularGames } from "../controllers/game.controller";

const router = Router();

router.get("/", getGames);
router.get("/popular", getPopularGames);

export default router;