import { Router } from "express";
import { getCars } from "../controllers/car.controller";

const router = Router();

router.get("/", getCars);

export default router;