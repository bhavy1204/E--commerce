import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

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
            sameSite: "None"
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
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Google token is required",
            });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture } = payload;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Google account has no email",
            });
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstName: given_name || '',
                lastName: family_name || '',
                email,
                password: null,
                authProvider: "google",
            });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: "7d" }
        );

        // Set cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
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
                    accessToken
                }
            });

    } catch (error) {
        console.error("Google login error:", error);
        return res.status(500).json({
            success: false,
            message: "Google authentication failed: " + error.message,
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
            sameSite: "none"
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

