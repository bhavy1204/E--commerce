import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    downloadInvoice
} from "../controllers/order.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", verifyJWT, createOrder);
router.get("/my-orders", verifyJWT, getUserOrders);

router.get("/:orderId/invoice", verifyJWT,isAdmin,downloadInvoice)

router.get("/:id", verifyJWT, getOrderById);

// Admin routes
router.get("/", verifyJWT, isAdmin, getAllOrders);
router.put("/:id/status", verifyJWT, isAdmin, updateOrderStatus);
export default router;

