import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPosts,
  deletePost,
  addUser,
  updatePostStatus,
  getUserStatistics,
  getPostStatistics,
  getMessageStatistics,
} from "../controllers/admin.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";

const router = express.Router();

// User management routes
router.get("/users", verifyToken, authorizeRoles("ADMIN"), getAllUsers);
router.put("/users/role", verifyToken, authorizeRoles("ADMIN"), updateUserRole);
router.delete("/users/:userId", verifyToken, authorizeRoles("ADMIN"), deleteUser);

router.post("/users", verifyToken, authorizeRoles("ADMIN"), addUser);

// Post management routes
router.get("/posts", verifyToken, authorizeRoles("ADMIN"), getAllPosts);
router.delete("/posts/:postId", verifyToken, authorizeRoles("ADMIN"), deletePost);
router.put("/posts/status", verifyToken, authorizeRoles("ADMIN"), updatePostStatus);

// Statistics routes
router.get("/statistics/users", getUserStatistics);
router.get("/statistics/posts", getPostStatistics);
router.get("/statistics/messages", getMessageStatistics);

export default router;