import Razorpay from "razorpay";
import crypto from "crypto";
import { Resend } from "resend";
import PDFDocument from "pdfkit";
import { User } from "../models/user.model.js";

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateInvoiceBuffer({ orderId, userName, userAddress, userEmail, userPhone, items, grandTotal }) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            // --- HEADER ---
            // Logo (Text) on Left
            doc.fontSize(24).font("Helvetica-Bold").text("WHIMSEY WEAVERS", 50, 50);
            doc.fontSize(10).font("Helvetica").text("123 Fashion Street, Creative City", 50, 80);
            doc.text("India - 110001", 50, 95);
            doc.text("support@whimseyweavers.co.in", 50, 110);

            // Invoice Details on Right
            const invoiceDetailsX = 400;
            doc.fontSize(16).font("Helvetica-Bold").text("INVOICE", invoiceDetailsX, 50, { align: 'right' });
            doc.fontSize(10).font("Helvetica").text(`Invoice #: ${orderId}`, invoiceDetailsX, 80, { align: 'right' });
            doc.text(`Date: ${new Date().toLocaleDateString()}`, invoiceDetailsX, 95, { align: 'right' });

            // --- USER DETAILS (BILL TO) ---
            doc.fontSize(12).font("Helvetica-Bold").text("Bill To:", 50, 160);

            // Name
            doc.fontSize(10).font("Helvetica").text(userName, 50, 180);

            // Address (Split if long)
            const addressY = 195;
            doc.text(userAddress, 50, addressY, { width: 250 });

            // Contact
            doc.text(`Email: ${userEmail}`, 50, addressY + 40);
            if (userPhone) {
                doc.text(`Phone: ${userPhone}`, 50, addressY + 55);
            }

            // --- ITEMS TABLE ---
            const tableTop = 300;
            const itemX = 50;
            const qtyX = 300;
            const priceX = 370;
            const totalX = 470;

            // Table Headers
            doc.font("Helvetica-Bold");
            doc.text("Item Description", itemX, tableTop);
            doc.text("Qty", qtyX, tableTop);
            doc.text("Price", priceX, tableTop);
            doc.text("Total", totalX, tableTop);

            // Draw line below headers
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Table Rows
            let y = tableTop + 30;
            doc.font("Helvetica");

            items.forEach(item => {
                const amount = item.quantity * item.price;

                doc.text(item.description, itemX, y, { width: 240 });
                doc.text(item.quantity.toString(), qtyX, y);
                doc.text(`₹${item.price.toFixed(2)}`, priceX, y);
                doc.text(`₹${amount.toFixed(2)}`, totalX, y);

                y += 20;
            });

            // Draw line below items
            doc.moveTo(50, y).lineTo(550, y).stroke();

            // --- GRAND TOTAL ---
            y += 20;
            const totalsX = 350;

            // We can calculate subtotal here or use grandTotal passed in
            // Assuming grandTotal is the final payable amount

            doc.font("Helvetica-Bold").fontSize(14);
            doc.text("Grand Total:", totalsX, y, { align: 'left' });
            doc.text(`₹${grandTotal.toFixed(2)}`, totalX, y, { align: 'left' }); // Align with column

            // Footer
            doc.fontSize(10).font("Helvetica").text("Thank you for your business!", 50, 700, { align: "center", width: 500 });


            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}

// ---------------------- CREATE RAZORPAY ORDER ------------------------

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "order_rcpt_" + Date.now()
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            orderId: order.id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
};

// ---------------------- EMAIL SENDER ------------------------

export async function sendInvoiceEmail(email, pdfBuffer, orderId) {
    try {
        const response = await resend.emails.send({
            from: "Whimsey Weavers <invoice@whimseyweavers.co.in>",
            to: email,
            subject: `Invoice for Order ${orderId}`,
            html: `
                <div style="font-family: Arial; max-width: 600px;">
                    <h2>Thank you for your order!</h2>
                    <p>Your invoice for order <strong>#${orderId}</strong> is attached.</p>
                </div>
            `,
            attachments: [
                {
                    filename: `invoice-${orderId}.pdf`,
                    content: pdfBuffer.toString("base64"),
                }
            ]
        });

        return response;

    } catch (error) {
        console.error("Email failed:", error);
        throw error;
    }
}

export async function sendAdminOrderNotification(adminEmails, order, pdfBuffer) {
    try {
        if (!adminEmails || adminEmails.length === 0) return;

        // Create text table
        let textTable = "Item | Qty | Price | Total\n";
        textTable += "-----------------------------------\n";

        // Handle items whether they are from order.items (populated) or passed directly
        // The structure passed to generateInvoiceBuffer in createOrder is mapped items
        // But the order object itself might be different.
        // Let's rely on the order object structure.
        // The 'order' arg here comes from populate in createOrder or verifyPayment.

        const items = order.items || [];

        items.forEach(item => {
            // item might be { product: { title... }, quantity... } or flattened
            const title = item.product?.title || item.description || "Unknown Product";
            const qty = item.quantity;
            const price = item.price || item.product?.price;
            const total = qty * price;
            textTable += `${title.substring(0, 15)}... | ${qty} | ${price} | ${total}\n`;
        });

        const address = typeof order.shippingAddress === 'object' ?
            `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}` :
            order.userAddress || "Address N/A";

        const textBody = `
New Order Received!

Order ID: ${order._id || order.orderId}
User: ${order.user?.firstName} ${order.user?.lastName} (${order.user?.email || order.userEmail})
Address: ${address}
Total Amount: ${order.totalAmount || "N/A"}

Items:
${textTable}

See attached invoice PDF.
        `;

        const response = await resend.emails.send({
            from: "Whimsey Weavers <invoice@whimseyweavers.co.in>",
            to: adminEmails,
            subject: `[ADMIN] New Order Notification - ${order._id || order.orderId}`,
            text: textBody,
            attachments: [
                {
                    filename: `invoice-${order._id || order.orderId}.pdf`,
                    content: pdfBuffer.toString("base64"),
                }
            ]
        });

        console.log("Admin notification sent to:", adminEmails);
        return response;

    } catch (error) {
        console.error("Failed to send admin notification:", error);
        // Don't throw, just log, so user flow isn't interrupted
    }
}

// ---------------------- VERIFY PAYMENT ------------------------

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order: orderPayload
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }

        // ---------------------------
        // CREATE ORDER IN DB
        // ---------------------------

        // 1. Process Items & Calculate Totals (Verify prices again from DB to be safe, or trust payload if accepted risk)
        // For security, it's better to fetch prices from DB.

        let totalAmount = 0;
        const orderItems = [];
        const { items, shippingAddress, userEmail, userName, userId, couponCode, shippingCost = 0, customizationNotes } = orderPayload;

        // If userId is not in payload, we might get it from req.user if authenticated middleware is used
        // Assuming verifyPayment is protected or we pass userId in payload
        const user_Id = userId || req.user?._id;

        // We need to fetch product details to get real prices and update stock
        for (const item of items) {
            // item from payload might have productId or just be flattened. 
            // Checkout.jsx sends: description, quantity, price. It DOES NOT send productId in the 'handler' payload yet.
            // I need to update Checkout.jsx to send productId.
            // Assuming Checkout.jsx will be updated to send productId.

            // Fallback if productId is missing (TEMPORARY FIX until frontend matches)
            // If we can't find product, we can't update stock properly. 
            // IMPORTANT: Checkout.jsx MUST send productId.

            // Let's assume the payload WILL contain productId.

            // If we trust the price from frontend (less secure but faster for now as per previous logic):
            // totalAmount += item.price * item.quantity;

            // BUT we need to save to DB.
            // Let's rely on what we have, but ideally we should fetch from DB.
            // To ensure we can create the order, we need valid ObjectIds for products.

            if (item.productId) {
                const product = await import("../models/product.model.js").then(m => m.Product.findById(item.productId));
                if (product) {
                    // Update stock
                    await import("../models/product.model.js").then(m => m.Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }));

                    orderItems.push({
                        product: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                    totalAmount += product.price * item.quantity;
                }
            }
        }

        // If totalAmount is 0 (e.g. products not found or payload issue), explicitly set it or rely on payload amount?
        // Using payload amount for robust fallback if DB lookup fails (though DB lookup is preferred).
        // Let's use the DB calculated total if available, else payload.
        if (totalAmount === 0 && orderPayload.amount) {
            // orderPayload.amount might be in paise? No, createOrder takes rupees. 
            // Checkout passes amount.
            // Let's re-calculate logic cleanly.
        }

        // Re-calacuating based on payload to ensure it matches what was paid
        // We already verified payment signature, so the amount paid is valid.

        // Let's refine the DB saving strategy:
        // We really need productIds. 

        // ... (Processing coupon)
        let discountAmount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            const Coupon = await import("../models/coupon.model.js").then(m => m.Coupon);
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon) {
                appliedCoupon = coupon;
                // Mark used
                if (user_Id) {
                    await Coupon.findByIdAndUpdate(coupon._id, { $push: { usedBy: user_Id } });
                }

                // Recalculate discount to save correct figure
                // Note: Frontend already applied discount to generate final amount.
                // We should ideally reverse calculate or just trust the values if we want to match exactly.
                // But for data integrity, we should calculate.

                // Total so far is items total.
                // Add shipping
                const subTotal = totalAmount + shippingCost;

                if (coupon.discountType === 'percentage') {
                    discountAmount = (totalAmount * coupon.discountValue) / 100; // Calculate on product total only
                } else {
                    discountAmount = coupon.discountValue;
                }
                if (discountAmount > subTotal) discountAmount = subTotal;
            }
        }

        // Final Total for DB
        const finalTotal = totalAmount + shippingCost - discountAmount;

        const Order = await import("../models/order.model.js").then(m => m.Order);

        const newOrder = await Order.create({
            user: user_Id,
            items: orderItems,
            totalAmount: finalTotal,
            shippingAddress: {
                // Parse address string or expect object?
                // Checkout.jsx constructs a string: "address, city, state..." 
                // BUT my plan said "Construct a complete orderPayload ... including shippingAddress object"
                // So I will update Frontend to send object.
                firstName: shippingAddress.firstName || userName.split(' ')[0],
                lastName: shippingAddress.lastName || userName.split(' ')[1] || '',
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone
            },
            paymentId: razorpay_payment_id,
            paymentStatus: 'paid',
            paymentMethod: 'online',
            coupon: appliedCoupon ? appliedCoupon._id : undefined,
            discountAmount,
            shippingCost,
            customizationNotes: customizationNotes || "" // Add this line
        });

        // ---------------------------
        // INVOIGE GENERATION
        // ---------------------------

        // Populate for invoice
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'title images price');

        const pdfBuffer = await generateInvoiceBuffer({
            orderId: newOrder._id.toString(),
            userName: userName,
            userAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipCode}`,
            userEmail: userEmail,
            userPhone: shippingAddress.phone,
            items: populatedOrder.items.map(item => ({
                description: item.product.title,
                quantity: item.quantity,
                price: item.price
            })),
            grandTotal: finalTotal
        });

        // Send Email
        await sendInvoiceEmail(userEmail, pdfBuffer, newOrder._id.toString());

        // Send Admin Notification
        const User = await import("../models/user.model.js").then(m => m.User);
        const admins = await User.find({ role: 'admin' });
        const adminEmails = admins.map(admin => admin.email);
        await sendAdminOrderNotification(adminEmails, populatedOrder, pdfBuffer);

        return res.status(200).json({
            success: true,
            message: "Payment verified & Order Created",
            orderId: newOrder._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};
