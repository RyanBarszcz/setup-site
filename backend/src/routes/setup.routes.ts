import { Router } from "express";
import { createSetup, getMySetups, getSetups, getSetupForEdit, updateSetup, toggleVote, handleDownload, getSetupById, deleteSetup } from "../controllers/setup.controller";
import multer from "multer";
import { requireAuth } from "../middleware/requireAuth";
import { attachUser, attachUserOptional} from "../middleware/attachUser";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

router.get("/", attachUserOptional, getSetups);
router.get("/mine", requireAuth, attachUser, getMySetups);
router.post("/", requireAuth, attachUser, upload.single("setupFile"), createSetup);
router.get("/:setupId", attachUserOptional, getSetupById);
router.get("/:setupId/edit", requireAuth, attachUser, getSetupForEdit);
router.patch("/:setupId", requireAuth, attachUser, upload.single("setupFile"), updateSetup);
router.delete("/:setupId/delete", requireAuth, attachUser, deleteSetup);
router.post("/:setupId/vote", requireAuth, attachUser, toggleVote);
router.get("/:setupId/download", handleDownload);

export default router;