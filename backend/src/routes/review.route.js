import express from "express";
import { getReviews, addReview, deleteReview , checkReviewEligibility,  } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/:productId", getReviews);

// eligible users
router.get("/:productId/eligibility", verifyJWT, checkReviewEligibility)
router.post("/:productId", verifyJWT, addReview);
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;

