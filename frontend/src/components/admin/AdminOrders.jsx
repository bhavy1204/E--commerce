import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { openInvoiceWindow } from '../utils/invoice';

export const AdminOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            return;
        }
        fetchOrders();
    }, [user, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            const response = await apiClient.getAllOrders(params);
            if (response.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await apiClient.updateOrderStatus(orderId, newStatus);
            if (response.success) {
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || 'Error updating order status');
        }
    };

    // Download Invoice Function
    const downloadInvoice = async (orderId) => {
        try {
            const res = await apiClient.downloadInvoice(orderId);

            if (!res.ok) {
                return alert("Invoice not found.");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Invoice download failed:", err);
            alert("Error downloading invoice");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Order Management</h1>

                {/* Filter */}
                <div className="mb-6">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-4">Order ID</th>
                                <th className="text-left p-4">Customer</th>
                                <th className="text-left p-4">Items</th>
                                <th className="text-left p-4">Total</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <button
                                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                                            className="text-purple-600 hover:underline"
                                        >
                                            {order._id.slice(-8)}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        {order.user?.firstName} {order.user?.lastName}
                                        <br />
                                        <span className="text-sm text-gray-600">{order.user?.email}</span>
                                    </td>
                                    <td className="p-4">
                                        {order.items.length} item(s)
                                    </td>
                                    <td className="p-4 font-semibold">₹{order.totalAmount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* ⭐ ADDED: Download Invoice Button */}
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        {/* ⭐ BUTTON */}
                                        <button
                                             onClick={() => openInvoiceWindow(order)}
                                            className="text-blue-600 hover:underline ml-4 text-sm"
                                        >
                                            Download Invoice
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
