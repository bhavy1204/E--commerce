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
                // Fetch all products for the first row (limit 5 or 10)
                const allProductsRes = await apiClient.getProducts({ limit: 10 });
                if (allProductsRes.success) {
                    setCategoryProducts(prev => ({
                        ...prev,
                        'all': allProductsRes.data.products
                    }));
                }

                response.data.forEach(async (catObj) => {
                    const productsResponse = await apiClient.getProducts({ category: catObj.name, limit: 5 });
                    if (productsResponse.success) {
                        setCategoryProducts(prev => ({
                            ...prev,
                            [catObj.name]: productsResponse.data.products
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

            {/* All Products Row */}
            <div className="mb-16">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                    <h2 className="text-lg md:text-xl font-bold capitalize">All Products</h2>
                    <Link
                        to={`/products`}
                        className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                        View All →
                    </Link>
                </div>
                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                    {categoryProducts['all']?.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`}>
                            <ProductCard
                                title={product.title}
                                price={product.price}
                                img={product.images[0]}
                                className="w-40 min-w-[160px] md:w-60 md:min-w-[240px] flex-shrink-0"
                            />
                        </Link>
                    ))}
                    {(!categoryProducts['all'] || categoryProducts['all'].length === 0) && (
                        <div className="text-gray-500 py-10 text-center w-full">
                            Loading products...
                        </div>
                    )}
                </div>
            </div>

            {categories.map((catObj) => (
                <div key={catObj.name} className="mb-16">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                        <h2 className="text-lg md:text-xl font-bold capitalize">{catObj.name}</h2>

                        <Link
                            to={`/products?category=${catObj.name}`}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                        {categoryProducts[catObj.name]?.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`}>
                                <ProductCard
                                    title={product.title}
                                    price={product.price}
                                    img={product.images[0]}
                                    className="w-40 min-w-[160px] md:w-60 md:min-w-[240px] flex-shrink-0"
                                />
                            </Link>
                        ))}

                        {(!categoryProducts[catObj.name] || categoryProducts[catObj.name].length === 0) && (
                            <div className="text-gray-500 py-10 text-center w-full">
                                No products in this category
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
