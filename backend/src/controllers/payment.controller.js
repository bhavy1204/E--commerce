import Razorpay from "razorpay";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Resend } from "resend"
import PDFDocument from 'pdfkit';


export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateInvoiceBuffer({ orderId, userName, userAddress, userEmail, items }) {
    return new Promise((resolve, reject) => {
        try {
            const PDFDocument = require("pdfkit");
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


export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // convert to paise
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

// Sending E mail via Resend.

export async function sendInvoiceEmail(email, pdfBuffer, orderId) {
    try {
        const response = await resend.emails.send({
            from: "Whimsey Weavers <onboarding@resend.dev>",
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

        // Generate PDF as buffer
        const pdfBuffer = await generateInvoiceBuffer(order);

        // Send email
        await sendInvoiceEmail(order.userEmail, pdfBuffer, order.orderId);


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

