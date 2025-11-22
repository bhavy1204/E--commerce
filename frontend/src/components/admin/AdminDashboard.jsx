import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            return;
        }
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await apiClient.getDashboardStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!stats) {
        return <div className="min-h-screen flex items-center justify-center">Error loading dashboard</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Products</p>
                                <p className="text-3xl font-bold">{stats.stats.totalProducts}</p>
                            </div>
                            <Package className="w-12 h-12 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Orders</p>
                                <p className="text-3xl font-bold">{stats.stats.totalOrders}</p>
                            </div>
                            <ShoppingBag className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Users</p>
                                <p className="text-3xl font-bold">{stats.stats.totalUsers}</p>
                            </div>
                            <Users className="w-12 h-12 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Revenue</p>
                                <p className="text-3xl font-bold">₹{stats.stats.revenue.toFixed(2)}</p>
                            </div>
                            <DollarSign className="w-12 h-12 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Order ID</th>
                                    <th className="text-left p-2">Customer</th>
                                    <th className="text-left p-2">Total</th>
                                    <th className="text-left p-2">Status</th>
                                    <th className="text-left p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.slice(0, 10).map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                className="text-purple-600 hover:underline"
                                            >
                                                {order._id.slice(-8)}
                                            </button>
                                        </td>
                                        <td className="p-2">
                                            {order.user?.firstName} {order.user?.lastName}
                                        </td>
                                        <td className="p-2">₹{order.totalAmount}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Products by Views</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {stats.topProducts.map((product) => (
                            <div key={product._id} className="border rounded-lg p-4">
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <p className="font-semibold truncate">{product.title}</p>
                                <p className="text-sm text-gray-600">Views: {product.views}</p>
                                <p className="text-purple-600 font-bold">₹{product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

