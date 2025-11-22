import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const emptyFaq = { question: '', answer: '' };
const emptySliderImage = { url: '', caption: '' };

export const AdminContentManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [content, setContent] = useState({
        aboutText: '',
        faqs: [emptyFaq],
        sliderImages: []
    });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            return;
        }
        fetchContent();
    }, [user]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getSiteContent();
            if (response.success) {
                setContent({
                    aboutText: response.data.aboutText || '',
                    faqs: response.data.faqs?.length ? response.data.faqs : [emptyFaq],
                    sliderImages: response.data.sliderImages || []
                });
            }
        } catch (error) {
            setMessage(error.message || 'Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleFaqChange = (index, field, value) => {
        setContent((prev) => {
            const updatedFaqs = [...prev.faqs];
            updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
            return { ...prev, faqs: updatedFaqs };
        });
    };

    const handleSliderChange = (index, field, value) => {
        setContent((prev) => {
            const updated = [...prev.sliderImages];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, sliderImages: updated };
        });
    };

    const addFaq = () => setContent((prev) => ({ ...prev, faqs: [...prev.faqs, emptyFaq] }));
    const removeFaq = (index) => setContent((prev) => ({ ...prev, faqs: prev.faqs.filter((_, idx) => idx !== index) }));

    const addSlider = () => setContent((prev) => ({ ...prev, sliderImages: [...prev.sliderImages, emptySliderImage] }));
    const removeSlider = (index) => setContent((prev) => ({ ...prev, sliderImages: prev.sliderImages.filter((_, idx) => idx !== index) }));

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const payload = {
                aboutText: content.aboutText,
                faqs: content.faqs.filter(faq => faq.question.trim() && faq.answer.trim()),
                sliderImages: content.sliderImages.filter(image => image.url.trim())
            };
            const response = await apiClient.updateSiteContent(payload);
            if (response.success) {
                setMessage('Content updated successfully');
                setContent({
                    aboutText: response.data.aboutText,
                    faqs: response.data.faqs.length ? response.data.faqs : [emptyFaq],
                    sliderImages: response.data.sliderImages
                });
            }
        } catch (error) {
            setMessage(error.message || 'Failed to update content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading content...</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Site Content</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                {message && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded">
                        {message}
                    </div>
                )}

                {/* About Section */}
                <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h2 className="text-2xl font-semibold">About Us</h2>
                    <textarea
                        value={content.aboutText}
                        onChange={(e) => setContent((prev) => ({ ...prev, aboutText: e.target.value }))}
                        rows="6"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Write about your brand..."
                    />
                </section>

                {/* FAQ Section */}
                <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">FAQs</h2>
                        <button onClick={addFaq} className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                            + Add FAQ
                        </button>
                    </div>
                    <div className="space-y-4">
                        {content.faqs.map((faq, index) => (
                            <div key={index} className="border rounded-md p-4 space-y-3">
                                <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                    placeholder="Question"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <textarea
                                    value={faq.answer}
                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                    placeholder="Answer"
                                    rows="3"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {content.faqs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFaq(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Slider Images */}
                <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Home Slider Images</h2>
                        <button onClick={addSlider} className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                            + Add Image
                        </button>
                    </div>
                    {content.sliderImages.length === 0 && (
                        <p className="text-sm text-gray-500">No slider images configured. Add at least one image URL.</p>
                    )}
                    <div className="space-y-4">
                        {content.sliderImages.map((image, index) => (
                            <div key={`${image.url}-${index}`} className="border rounded-md p-4 space-y-3">
                                <input
                                    type="url"
                                    value={image.url}
                                    onChange={(e) => handleSliderChange(index, 'url', e.target.value)}
                                    placeholder="Image URL"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <input
                                    type="text"
                                    value={image.caption || ''}
                                    onChange={(e) => handleSliderChange(index, 'caption', e.target.value)}
                                    placeholder="Caption (optional)"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => removeSlider(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                    {image.url && (
                                        <img src={image.url} alt="" className="w-32 h-16 object-cover rounded-md border" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};


