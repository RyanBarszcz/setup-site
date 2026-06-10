import { Router } from "express";
import { searchUsers, getUserProfile, updateProfileImage } from "../controllers/user.controller";
import { requireAuth } from "../middleware/requireAuth";
import { attachUser } from "../middleware/attachUser";
import multer from "multer";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

router.get("/search", searchUsers);
router.get("/profile/:username", getUserProfile);
router.patch(
    "/profile-image",
    requireAuth,
    attachUser,
    upload.single("profileImage"),
    updateProfileImage
);

export default router;