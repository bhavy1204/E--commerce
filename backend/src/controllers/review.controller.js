import { Review } from '../models/review.model.js';
import { Order } from '../models/order.model.js';

/**
 * GET /api/reviews/:productId
 * Public – paginated reviews for a product
 */
export const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            Review.find({ product: productId })
                .populate('user', 'firstName')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments({ product: productId })
        ]);

        return res.status(200).json({
            success: true,
            data: reviews,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching reviews'
        });
    }
};

/**
 * POST /api/reviews/:productId
 * Private – only verified buyers can review
 */
export const addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Please login to add a review'
            });
        }

        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check verified purchase
        const hasPurchased = await Order.exists({
            user: userId,
            'items.product': productId,
            paymentStatus: 'paid'
        });

        if (!hasPurchased) {
            return res.status(403).json({
                success: false,
                message: 'You can only review products you have purchased'
            });
        }

        // Prevent duplicate review
        const alreadyReviewed = await Review.exists({
            product: productId,
            user: userId
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            comment
        });

        return res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding review'
        });
    }
};

/**
 * GET /api/reviews/:productId/eligibility
 * Private – tells frontend whether "Add Review" button should show
 */
export const checkReviewEligibility = async (req, res) => {
    try {
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        });

        const { productId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            console.log("NO USER TO REVIEW")
            return res.status(200).json({
                success: true,
                canReview: false,
                alreadyReviewed: false,
            });
        }

        console.log("USER 👉", req.user);

        const hasPurchased = await Order.exists({
            user: userId,
            'items.product': productId,
            status: { $in: ['in-transit', 'delivered'] },
        });

        const alreadyReviewed = await Review.exists({
            product: productId,
            user: userId,
        });

        return res.status(200).json({
            success: true,
            canReview: Boolean(hasPurchased) && !alreadyReviewed,
            alreadyReviewed: Boolean(alreadyReviewed),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking review eligibility',
        });
    }
};

/**
 * DELETE /api/reviews/:reviewId
 * Private – only review owner can delete
 */
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user?._id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await review.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting review'
        });
    }
};
