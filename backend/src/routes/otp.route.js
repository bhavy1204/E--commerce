import express from "express"
import { verifyEmailOtp, sendEmailOtp } from "../controllers/otp.conntroller.js"

const router = express.Router();

router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);

export default router;
