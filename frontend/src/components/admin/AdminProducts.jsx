import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

export const AdminProducts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            return;
        }
        fetchProducts();
    }, [user]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getProducts({ limit: 100 }); // Fetch ample products
            if (response.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await apiClient.deleteProduct(id);
                if (response.success) {
                    setProducts(products.filter(p => p._id !== id));
                    alert('Product deleted successfully');
                }
            } catch (error) {
                alert(error.message || 'Error deleting product');
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">All Products</h1>
                    <button
                        onClick={() => navigate('/admin/products/new')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                        + Add New Product
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-4">Image</th>
                                    <th className="text-left p-4">Title</th>
                                    <th className="text-left p-4">Category</th>
                                    <th className="text-left p-4">Price</th>
                                    <th className="text-left p-4">Stock</th>
                                    <th className="text-left p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </td>
                                        <td className="p-4 font-semibold">{product.title}</td>
                                        <td className="p-4">{product.category}</td>
                                        <td className="p-4">₹{product.price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center p-8 text-gray-500">
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
