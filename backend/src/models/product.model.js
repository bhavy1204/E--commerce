import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    description: {
        type: String,
        required: true,
    },
    category:{
        type:String,
        required:true,
    },
    stock: {
        type: Number,
        required: [true, "Password is required"],
        default:1,
    },
    images:{
        type:String
    }
}, { timeStamps: true });

export const User = mongoose.model("User", userSchema);