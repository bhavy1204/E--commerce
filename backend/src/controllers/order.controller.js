import { generateInvoice, sendInvoiceEmail } from "./payment.controller.js";
import path from "path";
import fs from "fs";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentId, paymentMethod = 'cod' } = req.body;

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

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentId: paymentId || undefined,
            paymentStatus: paymentId ? 'paid' : 'pending',
            paymentMethod: paymentMethod || 'cod'
        });

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

        // ✅ FIXED: Correctly map items for invoice
        const invoicePath = await generateInvoice({
            orderId: order._id.toString(),
            userName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            userAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}, ${shippingAddress.country}`,
            userEmail: populatedOrder.user.email, // Use populated user email
            items: populatedOrder.items.map(item => ({
                description: item.product.title, // Use populated product title
                quantity: item.quantity,
                price: item.price // Use the price from order items (not product current price)
            }))
        });

        console.log("Populated order >> ",populatedOrder);

        // 📧 Email invoice to customer
        await sendInvoiceEmail(
            populatedOrder.user.email,
            invoicePath,
            order._id.toString()
        );
        console.log("✅ Email sent successfully for order:", order._id.toString());

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

export const downloadInvoice = async (req, res) => {
    try {
        console.log("Download hit");
        const orderId = req.params.orderId;

        // Use absolute path
        const invoicePath = path.join(process.cwd(), "invoices", `${orderId}.pdf`);
        console.log("Looking for invoice at:", invoicePath);

        if (!fs.existsSync(invoicePath)) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${orderId}.pdf"`);

        const stream = fs.createReadStream(invoicePath);
        stream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error downloading invoice" });
    }
};


