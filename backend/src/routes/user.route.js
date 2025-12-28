import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    googleLogin,
    forgotPassword,
    verifyOtp,
    resetPassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/auth/google", googleAuth);
router.post("/google-login", googleLogin);
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;

