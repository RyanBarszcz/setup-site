import { Router } from "express";
import { getGameBySlug, getGames, getPopularGames } from "../controllers/game.controller";

const router = Router();

router.get("/popular", getPopularGames);
router.get("/slug/:slug", getGameBySlug);
router.get("/", getGames);

export default router;