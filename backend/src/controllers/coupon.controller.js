import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, expirationDate } = req.body;

    if (!code || !discountType || !discountValue || !expirationDate) {
        throw new ApiError(400, "All fields are required");
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
        throw new ApiError(400, "Coupon with this code already exists");
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        expirationDate
    });

    return res.status(201).json(
        new ApiResponse(201, coupon, "Coupon created successfully")
    );
});

const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, coupons, "Coupons fetched successfully")
    );
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Coupon deleted successfully")
    );
});

const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
        throw new ApiError(400, "Coupon code is required");
    }

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
    });

    if (!coupon) {
        throw new ApiError(404, "Invalid coupon code");
    }

    if (new Date() > new Date(coupon.expirationDate)) {
        throw new ApiError(400, "Coupon has expired");
    }

    const isUsed = coupon.usedBy.includes(userId);
    if (isUsed) {
        throw new ApiError(400, "You have already used this coupon");
    }

    return res.status(200).json(
        new ApiResponse(200, coupon, "Coupon is valid")
    );
});

export {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    validateCoupon
};
