import { Router } from "express";
import { getMySetups, getSetups } from "../controllers/setup.controller";

const router = Router();

router.get("/", getSetups);
router.get("/mine", getMySetups);

export default router;