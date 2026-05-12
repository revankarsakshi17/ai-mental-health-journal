import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import {
  forgotPassword,
  verifyOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// 🔐 Auth (login/signup)
router.post("/signup", registerUser);
router.post("/login", loginUser);

// 🔁 Password reset
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;