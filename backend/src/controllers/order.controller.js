import { generateInvoiceBuffer, sendInvoiceEmail, sendAdminOrderNotification } from "./payment.controller.js";
import path from "path";
import fs from "fs";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Coupon } from "../models/coupon.model.js";
import { User } from "../models/user.model.js";

export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentId, paymentMethod = 'cod', couponCode, shippingCost = 0 } = req.body;

        console.log("REQ BODY:", req.body);

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Add shipping cost to total amount BEFORE discount calculation
        totalAmount += shippingCost;

        let discountAmount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true
            });

            if (!coupon) {
                return res.status(400).json({
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

            const isUsed = coupon.usedBy.includes(req.user._id);
            if (isUsed) {
                return res.status(400).json({
                    success: false,
                    message: "You have already used this coupon"
                });
            }

            appliedCoupon = coupon;

            if (coupon.discountType === 'percentage') {
                discountAmount = (totalAmount * coupon.discountValue) / 100;
            } else {
                discountAmount = coupon.discountValue;
            }

            // Ensure discount doesn't exceed total
            if (discountAmount > totalAmount) {
                discountAmount = totalAmount;
            }

            totalAmount -= discountAmount;
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentId: paymentId || undefined,
            paymentStatus: paymentId ? 'paid' : 'pending',
            paymentMethod: paymentMethod || 'cod',
            coupon: appliedCoupon ? appliedCoupon._id : undefined,
            coupon: appliedCoupon ? appliedCoupon._id : undefined,
            discountAmount,
            shippingCost
        });

        if (appliedCoupon) {
            await Coupon.findByIdAndUpdate(appliedCoupon._id, {
                $push: { usedBy: req.user._id }
            });
        }

        // Update stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'title images price');

        // Create PDF buffer instead of file
        const pdfBuffer = await generateInvoiceBuffer({
            orderId: order._id.toString(),
            userName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            userAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}, ${shippingAddress.country}`,
            userEmail: populatedOrder.user.email,
            items: populatedOrder.items.map(item => ({
                description: item.product.title,
                quantity: item.quantity,
                price: item.price
            }))
        });

        // console.log("Populated order", populatedOrder);

        // Email it
        await sendInvoiceEmail(
            populatedOrder.user.email,
            pdfBuffer,
            order._id.toString()
        );

        // Send Admin Notification
        const admins = await User.find({ role: 'admin' });
        const adminEmails = admins.map(admin => admin.email);
        await sendAdminOrderNotification(adminEmails, populatedOrder, pdfBuffer);

        console.log("✅ COD Invoice Email sent:", order._id.toString());


        // console.log("✅ Email sent successfully for order:", order._id.toString());

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: populatedOrder
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating order"
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'title images price')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching orders"
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'title images price description');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching order"
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'title images price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating order status"
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'title images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                orders,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching orders"
        });
    }
};

