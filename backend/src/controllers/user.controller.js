import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

// Initialize Google client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// User Controllers
export const registerUser = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await User.create({
            email,
            firstName,
            lastName,
            password
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: createdUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error registering user"
        });
    }
};

export const loginUser = async (req, res) => {
    try {

        // console.log("LOG IN HIT")
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "User logged in successfully",
                data: {
                    user: loggedInUser,
                    accessToken
                }
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error logging in"
        });
    }
};

export const googleLogin = async (req, res) => {
    try {
        console.log("Google login request received");
        console.log("Request body:", req.body);

        const { token } = req.body;

        // Validate token exists and is a string
        if (!token || typeof token !== 'string') {
            console.log("Invalid token received:", token);
            return res.status(400).json({
                success: false,
                message: "Valid Google token is required",
            });
        }

        console.log("Token received, length:", token.length);

        // 1. Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        console.log("Google token verified successfully");

        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture, sub } = payload;

        console.log("Google user email:", email);

        // 2. Check if user exists
        let user = await User.findOne({ email });

        // 3. If not, create user
        if (!user) {
            console.log("Creating new user for email:", email);
            user = await User.create({
                firstName: given_name || 'User',
                lastName: family_name || '',
                email,
                googleId: sub, // Store Google ID
                password: null,
                authProvider: "google",
            });
            console.log("New user created:", user._id);
        } else {
            console.log("Existing user found:", user._id);
        }

        // 4. Create JWT Token
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("JWT token generated successfully");

        // Set cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        };

        return res
            .status(200)
            .cookie("accessToken", jwtToken, options)
            .json({
                success: true,
                message: "Google login successful",
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    },
                    accessToken: jwtToken
                }
            });

    } catch (err) {
        console.error("Google login full error:", err);
        console.error("Error stack:", err.stack);

        return res.status(500).json({
            success: false,
            message: "Google authentication failed: " + err.message,
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User logged out successfully"
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error logging out"
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching user"
        });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Your OTP for password reset is:</p>
                <h1 style="color: #6d28d9; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: "Password Reset OTP - Whimsy Weavers",
            html: emailHtml
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error sending OTP"
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify OTP again to be secure
        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        user.password = newPassword; // Pre-save hook will hash this
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login with new password."
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error resetting password" });
    }
};

