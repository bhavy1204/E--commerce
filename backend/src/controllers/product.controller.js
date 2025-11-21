import { Product } from "../models/product.model.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        const query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                products,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching products"
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching product"
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching categories"
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, stock } = req.body;

        if (!title || !description || !category || !price || !stock) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!req.files || req.files.length < 3 || req.files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Product must have between 3 and 5 images"
            });
        }

        const imageUrls = await uploadMultipleToCloudinary(req.files);

        const product = await Product.create({
            title,
            description,
            category,
            price: parseFloat(price),
            stock: parseInt(stock),
            images: imageUrls
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating product"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, price, stock } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let imageUrls = product.images;

        if (req.files && req.files.length > 0) {
            if (req.files.length < 3 || req.files.length > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Product must have between 3 and 5 images"
                });
            }
            imageUrls = await uploadMultipleToCloudinary(req.files);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                title: title || product.title,
                description: description || product.description,
                category: category || product.category,
                price: price ? parseFloat(price) : product.price,
                stock: stock ? parseInt(stock) : product.stock,
                images: imageUrls
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating product"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting product"
        });
    }
};

