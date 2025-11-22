import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StatusBadge = ({ status }) => {
    const classes = {
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        shipped: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
        <span className={`px-3 py-1 rounded text-sm font-semibold ${classes[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
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
            alert(error.message || 'Unable to load order');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !order) {
        return <div className="min-h-screen flex items-center justify-center">Loading order...</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
                <button className="text-purple-600 hover:text-purple-800 text-sm" onClick={() => navigate('/orders')}>
                    ← Back to orders
                </button>
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Order #{order._id.slice(-8)}</h1>
                            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 uppercase mt-1">Payment: {order.paymentMethod}</p>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <StatusBadge status={order.status} />
                            <p className="text-xl font-semibold text-purple-700">Total: ₹{order.totalAmount}</p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
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

                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-3">Items</h2>
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
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity} × ₹{item.price}
                                        </p>
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

export default OrderDetail;
 