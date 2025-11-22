import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const AdminProductForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        stock: ''
    });
    const [newCategory, setNewCategory] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            return;
        }
        fetchCategories();
    }, [user]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'category') {
            if (value === 'new') {
                setIsNewCategory(true);
                setFormData({
                    ...formData,
                    category: ''
                });
            } else {
                setIsNewCategory(false);
                setNewCategory('');
                setFormData({
                    ...formData,
                    category: value
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleNewCategoryChange = (e) => {
        const value = e.target.value;
        setNewCategory(value);
        setFormData({
            ...formData,
            category: value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length < 3 || files.length > 5) {
            setError('Please select between 3 and 5 images');
            return;
        }

        setError('');
        setImages(files);

        // Create previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate category
        const categoryToUse = isNewCategory ? newCategory.trim() : formData.category;
        if (!categoryToUse) {
            setError('Please select or enter a category');
            setLoading(false);
            return;
        }

        if (images.length < 3 || images.length > 5) {
            setError('Please select between 3 and 5 images');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', categoryToUse);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('stock', formData.stock);

            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const response = await apiClient.createProduct(formDataToSend);
            if (response.success) {
                alert('Product created successfully!');
                // Refresh categories list to include the new one
                await fetchCategories();
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message || 'Error creating product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Product Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Category</label>
                                <select
                                    name="category"
                                    value={isNewCategory ? 'new' : formData.category}
                                    onChange={handleInputChange}
                                    required={!isNewCategory}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                    <option value="new">Add New Category</option>
                                </select>
                                {isNewCategory && (
                                    <input
                                        type="text"
                                        name="newCategory"
                                        placeholder="Enter new category name"
                                        value={newCategory}
                                        onChange={handleNewCategoryChange}
                                        required
                                        className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                min="1"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Product Images (3-5 images required)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                Select between 3 and 5 images
                            </p>
                        </div>

                        {imagePreview.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                {imagePreview.map((preview, idx) => (
                                    <div key={idx} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-full h-32 object-cover rounded-md border"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 font-semibold disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

