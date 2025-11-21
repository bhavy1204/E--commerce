import express from "express";
import {
    getDashboardStats,
    getTrafficStats
} from "../controllers/admin.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/traffic", getTrafficStats);

export default router;

