import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    subCategory: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 3 && v.length <= 5;
            },
            message: 'Product must have between 3 and 5 images'
        }
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    views: { type: Number, default: 0 }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);