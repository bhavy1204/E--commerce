import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useCart } from '../../context/AuthContext';



export const Checkout = () => {
    const { cart, getTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const { couponCode, discountAmount } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const loadRazorpayScript = () => new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const startRazorpay = async () => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load.');
            return;
        }

        try {
            const amount = getTotal() - (discountAmount || 0); // total in rupees
            const data = await apiClient.request('/payment/create-order', {
                method: "POST",
                body: JSON.stringify({ amount })
            })

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: 'Restaurant App',
                description: 'Order Payment',
                order_id: data.orderId,
                handler: async (response) => {
                    const orderPayload = {
                        orderId: data.orderId,
                        userEmail: user?.email,
                        userName: `${formData.firstName} ${formData.lastName}`,
                        userAddress: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
                        items: cart.map(item => ({
                            description: item.product.title,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    };

                    const verifyRes = await apiClient.request('/payment/verify', {
                        method: 'POST',
                        body: JSON.stringify({
                            ...response,
                            order: orderPayload
                        }),
                    });

                    if (verifyRes.success) {
                        await handlePaidOrder();
                        alert('Payment successful!');
                    } else {
                        alert('Payment verification failed!');
                    }
                },
                theme: { color: '#f97316' },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert('Error initializing payment');
        }
    };

    const handlePaidOrder = async () => {
        const orderData = {
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            shippingAddress: formData,
            paymentMethod: 'razorpay',
            paymentStatus: 'paid',
            couponCode
        };

        const response = await apiClient.createOrder(orderData);
        if (response.success) {
            clearCart();
            navigate(`/orders/${response.data._id}`);
        }
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                shippingAddress: formData,
                paymentMethod: 'cod',
                couponCode
            };

            const response = await apiClient.createOrder(orderData);
            if (response.success) {
                clearCart();
                navigate(`/orders/${response.data._id}`);
            }
        } catch (error) {
            alert(error.message || 'Order failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 md:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Shipping Form */}
                    <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip Code"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 font-semibold text-lg disabled:opacity-50 mb-2"
                        >
                            {loading ? 'Processing...' : 'Place COD Order'}
                        </button>
                        <button
                            onClick={startRazorpay}
                            type='button'
                            disabled={loading || !formData.firstName}
                            className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 font-semibold text-lg disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Continue with Razorpay'}
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex justify-between">
                                        <span>{item.product.title} x {item.quantity}</span>
                                        <span>₹{item.product.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{getTotal()}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <>
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({couponCode})</span>
                                            <span>-₹{discountAmount}</span>
                                        </div>
                                        <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                            <span>Final Total</span>
                                            <span>₹{getTotal() - discountAmount}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
