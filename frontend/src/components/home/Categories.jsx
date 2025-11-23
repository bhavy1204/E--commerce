import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api.js';
import ProductCard from '../products/Productcard.jsx';
import { Link } from 'react-router-dom';

export const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.getCategories();
            if (response.success) {
                setCategories(response.data);
                response.data.forEach(async (category) => {
                    const productsResponse = await apiClient.getProducts({ category, limit: 5 });
                    if (productsResponse.success) {
                        setCategoryProducts(prev => ({
                            ...prev,
                            [category]: productsResponse.data.products
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <div className="px-4 md:px-20 py-10">
            
            <h1 className="text-2xl md:text-3xl font-semibold mb-10">
                Shop By <span className="text-purple-700">Categories</span>
            </h1>

            {categories.map((category) => (
                <div key={category} className="mb-16">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                        <h2 className="text-lg md:text-xl font-bold capitalize">{category}</h2>

                        <Link
                            to={`/products?category=${category}`}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                        {categoryProducts[category]?.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`}>
                                <ProductCard
                                    title={product.title}
                                    price={product.price}
                                    img={product.images[0]}
                                />
                            </Link>
                        ))}

                        {(!categoryProducts[category] || categoryProducts[category].length === 0) && (
                            <div className="text-gray-500 py-10 text-center">
                                No products in this category
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
