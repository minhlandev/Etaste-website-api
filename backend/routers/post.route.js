import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, authorizeRoles("AUTH", "ADMIN"), addPost); // Chỉ AUTH và ADMIN được đăng bài
router.put("/:id", verifyToken, authorizeRoles("AUTH"), updatePost); // Chỉ ADMIN được sửa bài
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deletePost); // Chỉ ADMIN được xóa bài

export default router;
