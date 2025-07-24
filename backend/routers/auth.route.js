import express from "express";
import { login, logout, register, googleLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-login", googleLogin);

export default router;
