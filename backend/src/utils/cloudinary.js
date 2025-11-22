import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// log environment for sanity check
// console.log("🔧 Loading Cloudinary config:", {
//   CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//   API_KEY: process.env.CLOUDINARY_API_KEY,
//   API_SECRET: process.env.CLOUDINARY_API_SECRET ? "present" : "missing",
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

export const uploadToCloudinary = async (buffer) => {
  try {
    const base64String = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: "ecommerce-products",
      resource_type: "image",
    });

    return result.secure_url;
  } catch (error) {
    console.error("🚨 Cloudinary upload error:", error);
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

export const uploadMultipleToCloudinary = async (files) => {
  try {
    const urls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer))
    );
    return urls;
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error);
    throw new Error(`Error uploading images: ${error.message}`);
  }
};
