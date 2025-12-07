import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Tag } from 'lucide-react';
import { apiClient } from '../../utils/api';

export const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expirationDate: ''
    });

    const fetchCoupons = async () => {
        try {
            const response = await apiClient.getCoupons();
            setCoupons(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await apiClient.deleteCoupon(id);
                fetchCoupons();
            } catch (error) {
                console.error('Error deleting coupon:', error);
                alert('Failed to delete coupon');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.createCoupon(formData);
            setShowForm(false);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                expirationDate: ''
            });
            fetchCoupons();
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert(error.message || 'Failed to create coupon');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    Coupon Management
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700"
                >
                    <Plus className="w-4 h-4" />
                    {showForm ? 'Cancel' : 'Add Coupon'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full p-2 border rounded-md"
                                required
                                placeholder="SUMMER2024"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                            <input
                                type="date"
                                value={formData.expirationDate}
                                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                            <input
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                                min="0"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                            >
                                Create Coupon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Code</th>
                            <th className="p-4 font-semibold text-gray-600">Type</th>
                            <th className="p-4 font-semibold text-gray-600">Value</th>
                            <th className="p-4 font-semibold text-gray-600">Expires</th>
                            <th className="p-4 font-semibold text-gray-600">Usage</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{coupon.code}</td>
                                <td className="p-4 capitalize">{coupon.discountType}</td>
                                <td className="p-4">
                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                </td>
                                <td className="p-4">
                                    {new Date(coupon.expirationDate).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    {coupon.usedBy.length} uses
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No coupons found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
