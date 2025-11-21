import express from "express";
import {
    getAllProducts,
    getProductById,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// Admin routes
router.post("/", verifyJWT, isAdmin, upload.array('images', 5), createProduct);
router.put("/:id", verifyJWT, isAdmin, upload.array('images', 5), updateProduct);
router.delete("/:id", verifyJWT, isAdmin, deleteProduct);

export default router;

