import { Router } from "express";
import {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    validateCoupon
} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply authentication to all routes

// Admin routes
// TODO: Add admin check middleware if available, for now assuming verifyJWT is enough or adding check inside controller/middleware
router.route("/").post(createCoupon).get(getAllCoupons);
router.route("/:id").delete(deleteCoupon);

// User routes
router.route("/validate").post(validateCoupon);

export default router;
