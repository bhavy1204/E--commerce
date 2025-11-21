import { SiteContent } from "../models/siteContent.model.js";

const DEFAULT_CONTENT = {
    aboutText: "At Whimsy Weavers we blend craftsmanship with creativity to bring you timeless pieces for every space in your home.",
    faqs: [
        {
            question: "How long does shipping take?",
            answer: "Orders are processed within 48 hours and typically arrive within 5-7 business days."
        },
        {
            question: "Do you offer returns?",
            answer: "Yes, we accept returns within 30 days of delivery as long as the item is unused and in its original packaging."
        }
    ],
    sliderImages: []
};

const getOrCreateContent = async () => {
    let content = await SiteContent.findOne();
    if (!content) {
        content = await SiteContent.create(DEFAULT_CONTENT);
    }
    return content;
};

export const getSiteContent = async (_req, res) => {
    try {
        const content = await getOrCreateContent();
        return res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching site content"
        });
    }
};

export const updateSiteContent = async (req, res) => {
    try {
        const { aboutText, faqs, sliderImages } = req.body;
        const content = await getOrCreateContent();

        if (typeof aboutText === "string") {
            content.aboutText = aboutText;
        }

        if (Array.isArray(faqs)) {
            content.faqs = faqs.filter(faq => faq.question && faq.answer).map(faq => ({
                question: faq.question.trim(),
                answer: faq.answer.trim()
            }));
        }

        if (Array.isArray(sliderImages)) {
            content.sliderImages = sliderImages
                .filter(image => image.url)
                .map(image => ({
                    url: image.url.trim(),
                    caption: image.caption?.trim() || ""
                }));
        }

        await content.save();

        return res.status(200).json({
            success: true,
            message: "Site content updated successfully",
            data: content
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating site content"
        });
    }
};


