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

export async function generateInvoice({ orderId, userName, userAddress, userEmail, items }) {
    return new Promise((resolve, reject) => {
        try {
            console.log("GENERATE INVOICE RECEIVED:", orderId);

            const invoiceDir = path.join(process.cwd(), "invoices");
            if (!fs.existsSync(invoiceDir)) {
                fs.mkdirSync(invoiceDir, { recursive: true });
            }

            const invoicePath = path.join(invoiceDir, `${orderId}.pdf`);
            // console.log("Invoice will be saved to:", invoicePath);

            // Create a document
            const doc = new PDFDocument({ margin: 50 });

            // Pipe its output to a file
            const stream = fs.createWriteStream(invoicePath);
            doc.pipe(stream);

            // Add content
            // Header
            doc.fontSize(20).font('Helvetica-Bold').text('WHIMSEY WEAVERS', 50, 50);
            doc.fontSize(10).font('Helvetica').text('Somewhere in India', 50, 75);
            
            // Invoice title
            doc.fontSize(16).font('Helvetica-Bold').text(`INVOICE #${orderId}`, 50, 120);
            doc.fontSize(10).font('Helvetica').text(`Date: ${new Date().toLocaleDateString()}`, 50, 140);

            // Customer information
            doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 180);
            doc.fontSize(10).font('Helvetica')
                .text(userName, 50, 200)
                .text(userEmail, 50, 215)
                .text(userAddress, 50, 230);

            // Table header
            const tableTop = 280;
            doc.fontSize(10).font('Helvetica-Bold')
                .text('Description', 50, tableTop)
                .text('Quantity', 250, tableTop)
                .text('Price', 350, tableTop)
                .text('Amount', 450, tableTop);

            // Table rows
            let y = tableTop + 20;
            let totalAmount = 0;

            items.forEach(item => {
                const amount = item.quantity * item.price;
                totalAmount += amount;

                doc.fontSize(10).font('Helvetica')
                    .text(item.description, 50, y)
                    .text(item.quantity.toString(), 250, y)
                    .text(`₹${item.price.toFixed(2)}`, 350, y)
                    .text(`₹${amount.toFixed(2)}`, 450, y);

                y += 20;
            });

            // Total
            doc.fontSize(12).font('Helvetica-Bold')
                .text(`Total: ₹${totalAmount.toFixed(2)}`, 350, y + 20);

            // Footer
            doc.fontSize(8).font('Helvetica')
                .text('Thank you for your business!', 50, doc.page.height - 50);

            // Finalize the PDF and end the stream
            doc.end();

            stream.on('finish', () => {
                console.log("Invoice generated successfully at:", invoicePath);
                resolve(invoicePath);
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (err) {
            console.error("Invoice ERROR:", err);
            reject(err);
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

export async function sendInvoiceEmail(email, invoicePath, orderId) {
    try {
        console.log("📧 Attempting to send email to:", email);
        console.log("📧 Using Resend API Key:", process.env.RESEND_API_KEY ? "Present" : "Missing");
        console.log("📧 Invoice path:", invoicePath);

        // Check if invoice file exists
        if (!fs.existsSync(invoicePath)) {
            console.error("❌ Invoice file not found:", invoicePath);
            throw new Error("Invoice file not found");
        }

        const pdfBuffer = fs.readFileSync(invoicePath);
        console.log("📧 PDF buffer size:", pdfBuffer.length, "bytes");

        const emailData = {
            from: "Whimsey Weavers <onboarding@resend.dev>",
            to: email,
            subject: `Invoice for Order ${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Thank you for your order!</h2>
                    <p>Your order <strong>#${orderId}</strong> was successfully placed.</p>
                    <p>Your invoice is attached to this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        If you have any questions, please contact us at support@whimseyweavers.com
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: `invoice-${orderId}.pdf`,
                    content: pdfBuffer.toString("base64"),
                }
            ]
        };

        console.log("📧 Sending email with data:", {
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject
        });

        const response = await resend.emails.send(emailData);
        console.log("✅ Email sent successfully:", response);
        
        return response;
    } catch (error) {
        console.error("❌ Email sending failed:", error);
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

        // Generate PDF
        const invoicePath = await generateInvoice(order);

        // Email the user
        await sendInvoiceEmail(order.userEmail, invoicePath, order.orderId);

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

