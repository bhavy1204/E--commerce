import { Coupon } from "../models/coupon.model.js";

const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expirationDate } = req.body;

        if (!code || !discountType || !discountValue || !expirationDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon with this code already exists"
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            expirationDate
        });

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating coupon"
        });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Coupons fetched successfully",
            data: coupons
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching coupons"
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting coupon"
        });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        // Ensure user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Please login to apply coupon"
            });
        }

        const userId = req.user._id;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required"
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code"
            });
        }

        if (new Date() > new Date(coupon.expirationDate)) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired"
            });
        }

        const isUsed = coupon.usedBy.includes(userId);
        if (isUsed) {
            return res.status(400).json({
                success: false,
                message: "You have already used this coupon"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Coupon is valid",
            data: coupon
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error validating coupon"
        });
    }
};

export {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    validateCoupon
};
