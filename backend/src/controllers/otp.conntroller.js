import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Remove any existing OTP for this email
        await Otp.deleteOne({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        await Otp.create({
            email,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });

        await resend.emails.send({
            from: "Whimsey Weavers <no-reply@whimseyweavers.co.in>",
            to: email,
            subject: "Verify your email",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is <b>${otp}</b></p>
                <p>This OTP is valid for 5 minutes.</p>
            `
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to email"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send OTP"
        });
    }
};

export const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const record = await Otp.findOne({ email });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired"
            });
        }

        if (record.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        const isValid = await bcrypt.compare(otp, record.otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Mark email verified if user exists
        await User.updateOne(
            { email },
            { $set: { isEmailVerified: true } }
        );

        await Otp.deleteOne({ email });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "OTP verification failed"
        });
    }
};
