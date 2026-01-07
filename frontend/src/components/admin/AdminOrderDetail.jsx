import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const AdminOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            return;
        }
        fetchOrder();
    }, [user, orderId]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getOrderById(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            alert(error.message || 'Failed to load order');
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!order || newStatus === order.status) return;

        setStatusUpdating(true);
        try {
            const response = await apiClient.updateOrderStatus(order._id, newStatus);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            alert(error.message || 'Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    if (loading || !order) {
        return <div className="min-h-screen flex items-center justify-center">Loading order details...</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-5xl mx-auto space-y-6">
                <button className="text-purple-600 hover:text-purple-800 text-sm" onClick={() => navigate('/admin/orders')}>
                    ← Back to orders
                </button>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Order #{order._id.slice(-8)}</h1>
                            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 uppercase mt-1">Payment: {order.paymentMethod}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Order Status</label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={statusUpdating}
                                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-3">Customer</h2>
                            <p className="font-semibold">{order.user?.firstName} {order.user?.lastName}</p>
                            <p className="text-sm text-gray-600">{order.user?.email}</p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
                            {order.shippingAddress ? (
                                <p className="text-sm text-gray-600 leading-6">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    <br />
                                    {order.shippingAddress.address}
                                    <br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                    <br />
                                    {order.shippingAddress.country}
                                    <br />
                                    Phone: {order.shippingAddress.phone}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">No shipping address provided</p>
                            )}
                        </div>
                    </div>

                    {/* Customization Notes */}
                    {order.customizationNotes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Customization Notes</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{order.customizationNotes}</p>
                        </div>
                    )}

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Items</h2>
                            <p className="text-xl font-bold">Total: ₹{order.totalAmount}</p>
                        </div>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 border rounded-md p-3">
                                    <img
                                        src={item.product?.images?.[0]}
                                        alt={item.product?.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.product?.title}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

