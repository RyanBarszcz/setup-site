import { Router } from "express";
import { searchUsers, getUserProfile } from "../controllers/user.controller";

const router = Router();

router.get("/search", searchUsers);
router.get("/profile/:username", getUserProfile);

export default router;