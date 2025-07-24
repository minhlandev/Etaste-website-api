import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import {
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

export default router;
