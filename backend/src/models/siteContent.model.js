import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const sliderImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    caption: {
        type: String,
        trim: true
    }
}, { _id: false });

const siteContentSchema = new mongoose.Schema({
    aboutText: {
        type: String,
        default: ""
    },
    faqs: {
        type: [faqSchema],
        default: []
    },
    sliderImages: {
        type: [sliderImageSchema],
        default: []
    }
}, { timestamps: true });

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);


