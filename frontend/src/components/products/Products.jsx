import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import ProductCard from './Productcard';
import ProductRow from './ProductRow';

export const Products = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    const [groupedProducts, setGroupedProducts] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory && !searchQuery) {
            // Check if category has subcategories, if so fetch per subcategory
            const currentCat = categories.find(c => c.name === selectedCategory);
            if (currentCat && currentCat.subCategories && currentCat.subCategories.length > 0) {
                fetchSubCategoryProducts(currentCat);
            } else {
                fetchProducts();
            }
        } else {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, selectedCategory, searchQuery, categories.length]); // added categories.length to retry if cats loaded late

    useEffect(() => {
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        if (category) setSelectedCategory(category);
        if (search) setSearchQuery(search);
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12
            };
            if (selectedCategory) params.category = selectedCategory;
            if (searchQuery) params.search = searchQuery;

            const response = await apiClient.getProducts(params);
            if (response.success) {
                setProducts(response.data.products);
                setTotalPages(response.data.pages);
                setGroupedProducts({}); // Clear grouped if switching to flat view
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubCategoryProducts = async (categoryObj) => {
        setLoading(true);
        try {
            const promises = categoryObj.subCategories.map(async (sub) => {
                // Fetch limit 10 for each subcategory row
                const response = await apiClient.getProducts({ category: categoryObj.name, subCategory: sub, limit: 10 });
                return { sub, products: response.success ? response.data.products : [] };
            });

            const results = await Promise.all(promises);
            const newGrouped = {};
            results.forEach(res => {
                if (res.products.length > 0) {
                    newGrouped[res.sub] = res.products;
                }
            });
            setGroupedProducts(newGrouped);
            setProducts([]); // Clear flat products
        } catch (error) {
            console.error('Error fetching subcats:', error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen px-4 md:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                    Our <span className="text-purple-700">Products</span>
                </h1>

                {/* Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0 ${selectedCategory === ''
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((catObj) => (
                            <button
                                key={catObj.name}
                                onClick={() => setSelectedCategory(catObj.name)}
                                className={`px-4 py-2 rounded-md capitalize whitespace-nowrap flex-shrink-0 ${selectedCategory === catObj.name
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {catObj.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-xl">Loading...</div>
                    </div>
                ) : products.length === 0 && Object.keys(groupedProducts).length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No products found</p>
                    </div>
                ) : Object.keys(groupedProducts).length > 0 ? (
                    // Grouped View
                    <div className="flex flex-col gap-8">
                        {Object.keys(groupedProducts).map(subCat => (
                            <ProductRow key={subCat} category={subCat} products={groupedProducts[subCat]} />
                        ))}
                    </div>
                ) : (
                    // Flat Grid View
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Link key={product._id} to={`/product/${product._id}`}>
                                    <ProductCard
                                        title={product.title}
                                        price={product.price}
                                        img={product.images[0]}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* Pagination - Only show if in flat view and we have pages */}
                        {products.length > 0 && totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

