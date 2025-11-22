import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useCart } from '../../context/AuthContext';
import { FaqList } from './FaqList';

export const Productpage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setSelectedImage(product.images[0]);
        }
    }, [product]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getProductById(id);
            if (response.success) {
                setProduct(response.data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product && quantity > 0 && quantity <= product.stock) {
            addToCart(product, quantity);
            alert('Product added to cart!');
        }
    };

    const handleBuyNow = () => {
        if (product && quantity > 0 && quantity <= product.stock) {
            addToCart(product, quantity);
            navigate('/cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Product not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Navigation */}
                <div className="text-sm text-gray-600 mb-6">
                    <span className="cursor-pointer hover:text-purple-600" onClick={() => navigate('/home')}>Home</span>
                    {' / '}
                    <span className="cursor-pointer hover:text-purple-600" onClick={() => navigate('/products')}>Products</span>
                    {' / '}
                    <span>{product.title}</span>
                </div>

                {/* Product Details */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Images */}
                    <div className="flex flex-col lg:flex-row gap-4 flex-1">
                        <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`${product.title} ${idx + 1}`}
                                    className={`h-20 w-20 lg:h-24 lg:w-24 object-cover rounded-md cursor-pointer border-2 ${
                                        selectedImage === img ? 'border-purple-500' : 'border-gray-200'
                                    }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                        <div className="flex-1 order-1 lg:order-2">
                            <img
                                src={selectedImage}
                                alt={product.title}
                                className="w-full h-auto max-h-[600px] object-contain rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                        <p className="text-3xl font-bold text-purple-600 mb-6">₹{product.price}</p>
                        
                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Stock:</span> {product.stock} available
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Category:</span> {product.category}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-lg font-semibold mb-2">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || quantity > product.stock}
                                className="bg-purple-500 px-6 py-3 text-xl text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add To Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0 || quantity > product.stock}
                                className="bg-purple-700 px-6 py-3 text-xl text-white rounded-md hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description and FAQ */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-4">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-4">FAQ</h3>
                        <div className="flex flex-col gap-5">
                            <FaqList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
