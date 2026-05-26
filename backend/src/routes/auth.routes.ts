import { Router } from "express";
import { syncAccount } from "../controllers/auth.controller";

const router = Router();

router.post("/sync", syncAccount);

export default router;