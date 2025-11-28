import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))


app.use(express.json({ limit: "5mb" }));


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import orderRouter from "./src/routes/order.route.js";
import adminRouter from "./src/routes/admin.route.js";
import contentRouter from "./src/routes/content.route.js";
import paymentRouter from "./src/routes/payment.route.js"

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/payment", paymentRouter);

export { app }