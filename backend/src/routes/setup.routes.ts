import { Router } from "express";
import { getSetups } from "../controllers/setup.controller";

const router = Router();

router.get("/", getSetups);

export default router;