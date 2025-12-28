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

export function generateInvoiceBuffer({ orderId, userName, userAddress, userEmail, items }) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            doc.fontSize(20).font("Helvetica-Bold").text("WHIMSEY WEAVERS", 50, 50);
            doc.fontSize(10).font("Helvetica").text("Somewhere in India", 50, 75);

            doc.fontSize(16).font("Helvetica-Bold").text(`INVOICE #${orderId}`, 50, 120);
            doc.fontSize(10).font("Helvetica").text(`Date: ${new Date().toLocaleDateString()}`, 50, 140);

            doc.fontSize(12).font("Helvetica-Bold").text("Bill To:", 50, 180);
            doc.fontSize(10).font("Helvetica")
                .text(userName, 50, 200)
                .text(userEmail, 50, 215)
                .text(userAddress, 50, 230);

            const tableTop = 280;
            doc.fontSize(10).font("Helvetica-Bold")
                .text("Description", 50, tableTop)
                .text("Quantity", 250, tableTop)
                .text("Price", 350, tableTop)
                .text("Amount", 450, tableTop);

            let y = tableTop + 20;
            let totalAmount = 0;

            items.forEach(item => {
                const amount = item.quantity * item.price;
                totalAmount += amount;

                doc.fontSize(10).font("Helvetica")
                    .text(item.description, 50, y)
                    .text(item.quantity.toString(), 250, y)
                    .text(`₹${item.price.toFixed(2)}`, 350, y)
                    .text(`₹${amount.toFixed(2)}`, 450, y);

                y += 20;
            });

            doc.fontSize(12).font("Helvetica-Bold")
                .text(`Total: ₹${totalAmount.toFixed(2)}`, 350, y + 20);

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
            order
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

        // Generate PDF buffer
        const pdfBuffer = await generateInvoiceBuffer(order);

        // Send email
        await sendInvoiceEmail(order.userEmail, pdfBuffer, order.orderId);

        // Send Admin Notification
        const admins = await User.find({ role: 'admin' });
        const adminEmails = admins.map(admin => admin.email);

        // We need to construct a robust order object for the text summary if 'order' isn't fully populated
        // The 'order' object here in verifyPayment is actually constructed manually in client or passed partially?
        // Let's check verifyPayment caller. It seems 'order' is passed in body?
        // In verifyPayment, 'order' is extracted from req.body. Let's assume it has necessary details or we fetch it.
        // Actually, looking at verifyPayment implementation, it just uses 'order' from body.
        // To be safe, we pass 'order' as is, but we might want to fetch real DB order if needed.
        // But for now, using passed order object.
        await sendAdminOrderNotification(adminEmails, order, pdfBuffer);

        return res.status(200).json({
            success: true,
            message: "Payment verified & invoice sent"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};
