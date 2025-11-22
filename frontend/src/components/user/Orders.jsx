import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await apiClient.getUserOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 mb-4">You have no orders yet</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <span className={`px-3 py-1 rounded text-sm ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-2 uppercase">Payment: {order.paymentMethod || 'cod'}</p>
                                        <p className="text-xl font-bold">₹{order.totalAmount}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                        className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
                                    >
                                        View Details →
                                    </button>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Items:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <img
                                                    src={item.product?.images[0]}
                                                    alt={item.product?.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold">{item.product?.title}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {order.shippingAddress && (
                                    <div className="border-t pt-4 mt-4">
                                        <h4 className="font-semibold mb-2">Shipping Address:</h4>
                                        <p className="text-sm text-gray-600">
                                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                            <br />
                                            {order.shippingAddress.address}
                                            <br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                            <br />
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

