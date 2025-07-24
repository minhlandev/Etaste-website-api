import express from "express";
import {
  addMessage,
  deleteMessage
} from "../controllers/message.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/:chatId", verifyToken, addMessage);
router.delete("/:id", verifyToken, deleteMessage);

export default router;
