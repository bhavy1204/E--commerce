import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { useCart, useAuth } from '../../context/AuthContext';

export const Checkout = () => {
    const { cart, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Ensure location is defined
    const { couponCode, discountAmount, shippingState, shippingCost: initialShippingCost, customizationNotes } = location.state || {}; // Add shipping props
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [expressDelivery, setExpressDelivery] = useState(false);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: shippingState || '', // Pre-fill state
        zipCode: '',
        country: 'India', // Enforce India
        phone: ''
    });

    // Calculate dynamic shipping cost
    const shippingCost = expressDelivery ? 180 : (initialShippingCost || 0);

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
            const amount = getTotal() - (discountAmount || 0) + shippingCost; // Include dynamic shipping
            const data = await apiClient.request('/payment/create-order', {
                method: "POST",
                body: JSON.stringify({ amount })
            })

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,

                name: "Whimsey Weavers",
                description: "Secure Checkout",

                order_id: data.orderId,

                handler: async (response) => {
                    const orderPayload = {
                        userId: user?._id || user?.id,
                        userEmail: user?.email,
                        userName: `${formData.firstName} ${formData.lastName}`,
                        shippingAddress: formData, // Send full object
                        shippingCost,
                        couponCode,
                        customizationNotes, // Include notes
                        amount: data.amount,
                        items: cart.map((item) => ({
                            productId: item.productId, // CRITICAL: Send productId for backend stock update
                            description: item.product.title,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    };

                    const verifyRes = await apiClient.request("/payment/verify", {
                        method: "POST",
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            order: orderPayload,
                        }),
                    });

                    if (verifyRes.success) {
                        // Order is already created in backend during verify
                        // Just clear cart and redirect
                        // We need the new orderId from backend response
                        clearCart();
                        alert("Payment successful!");
                        navigate(`/orders`);
                    } else {
                        alert("Payment verification failed!");
                    }
                },

                theme: {
                    color: "#7C3AED",
                },
            };


            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert('Error initializing payment');
        }
    };

    // handlePaidOrder removed as backend creates order now



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
                couponCode,
                shippingCost,
                customizationNotes,
                totalAmount: getTotal() - (discountAmount || 0) + shippingCost
            };

            const response = await apiClient.createOrder(orderData);
            if (response.success) {
                clearCart();
                navigate(`/orders`);
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
                                readOnly // Make state read-only to prevent shipping cost mismatch
                                className="px-4 py-2 border rounded-md bg-gray-100 focus:outline-none cursor-not-allowed"
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
                                readOnly // Make country read-only
                                className="px-4 py-2 border rounded-md bg-gray-100 focus:outline-none cursor-not-allowed"
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



                        <div className="mb-6 space-y-3">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Customization / Order Notes</label>
                                <div className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 min-h-[80px]">
                                    {customizationNotes || "No customization notes added."}
                                </div>
                            </div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">
                                    I agree to the <a href="/shipping-policy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Shipping Policy</a>
                                </span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={expressDelivery}
                                    onChange={(e) => setExpressDelivery(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Express Delivery (2 days, ₹180)
                                </span>
                            </label>
                        </div>

                        {/* COD Button Removed as per request */}
                        {/* <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 font-semibold text-lg disabled:opacity-50 mb-2"
                        >
                            {loading ? 'Processing...' : 'Place COD Order'}
                        </button> */}

                        <button
                            onClick={startRazorpay}
                            type='button'
                            disabled={loading || !formData.firstName || !termsAccepted}
                            className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 font-semibold text-lg disabled:opacity-50 shadow-lg transform transition hover:scale-105"
                        >
                            {loading ? 'Processing...' : 'Pay Securely Now'}
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
                                    <span>Subtotal</span>
                                    <span>₹{getTotal()}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({couponCode})</span>
                                        <span>-₹{discountAmount}</span>
                                    </div>
                                )}

                                {shippingCost > 0 && (
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>+₹{shippingCost}</span>
                                    </div>
                                )}

                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Final Total</span>
                                    <span>₹{getTotal() - (discountAmount || 0) + shippingCost}</span>
                                </div>

                                <div className="border-t pt-4 text-center">
                                    <p className="text-gray-600 font-semibold">Estimated Delivery</p>
                                    <p className="text-purple-600 font-bold text-lg">
                                        {(() => {
                                            const daysToAdd = expressDelivery ? 9 : 14;
                                            const date = new Date();
                                            date.setDate(date.getDate() + daysToAdd);
                                            return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
