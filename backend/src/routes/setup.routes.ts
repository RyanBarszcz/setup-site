import { Router } from "express";
import { createSetup, getMySetups, getSetups } from "../controllers/setup.controller";
import multer from "multer";
import { requireAuth } from "../middleware/requireAuth";
import { attachUser} from "../middleware/attachUser";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

router.get("/", getSetups);
router.get("/mine", getMySetups);
router.post("/", requireAuth, attachUser, upload.single("setupFile"), createSetup);

export default router;