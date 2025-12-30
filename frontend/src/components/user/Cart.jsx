import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag } from 'lucide-react';
import { useCart, useAuth } from '../../context/AuthContext';
import { apiClient } from '../../utils/api';

export const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [shippingState, setShippingState] = useState('');

    const indianStates = [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
        "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
        "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const getShippingCost = () => {
        if (!shippingState) return 0;

        const lowerState = shippingState.toLowerCase();

        if (lowerState === 'rajasthan') return 60;
        if (lowerState === 'gujarat') return 100;

        const southStates = ['tamil nadu', 'kerala', 'karnataka', 'andhra pradesh', 'telangana'];
        if (southStates.includes(lowerState)) return 160;

        return 120;
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        setCouponSuccess('');

        try {
            const response = await apiClient.validateCoupon(couponCode);
            setAppliedCoupon(response.data);
            setCouponSuccess('Coupon applied successfully!');
        } catch (error) {
            setAppliedCoupon(null);
            setCouponError(error.message || 'Invalid coupon');
        }
    };

    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;
        const subtotal = getTotal();
        let discount = 0;
        if (appliedCoupon.discountType === 'percentage') {
            discount = (subtotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        return Math.min(discount, subtotal);
    };

    const getFinalTotal = () => {
        return getTotal() - getDiscountAmount() + getShippingCost();
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!shippingState) {
            alert("Please select a shipping state to proceed.");
            return;
        }
        navigate('/checkout', {
            state: {
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                discountAmount: getDiscountAmount(),
                shippingState: shippingState,
                shippingCost: getShippingCost()
            }
        });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <Link
                        to="/products"
                        className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex flex-col sm:flex-row gap-4 pb-6 mb-6 border-b last:border-b-0"
                                >
                                    <Link to={`/product/${item.productId}`}>
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            className="w-full sm:w-32 h-32 object-cover rounded-md cursor-pointer"
                                        />
                                    </Link>
                                    <div className="flex-1">
                                        <Link to={`/product/${item.productId}`}>
                                            <h3 className="text-xl font-semibold mb-2 hover:text-purple-600">
                                                {item.product.title}
                                            </h3>
                                        </Link>
                                        <p className="text-purple-600 font-bold text-lg mb-4">
                                            ₹{item.product.price}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-100"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-100"
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold">
                                            ₹{item.product.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={clearCart}
                            className="mt-4 text-red-500 hover:text-red-700"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{getTotal()}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>-₹{getDiscountAmount()}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span>Shipping</span>
                                        <span>{shippingState ? `₹${getShippingCost()}` : '-'}</span>
                                    </div>
                                    <select
                                        value={shippingState}
                                        onChange={(e) => setShippingState(e.target.value)}
                                        className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                                    >
                                        <option value="">Select State</option>
                                        {indianStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    <Link to="/shipping-policy" className="text-xs text-purple-600 hover:text-purple-700 text-right">
                                        View Shipping Policy
                                    </Link>
                                </div>

                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{getFinalTotal()}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Coupon Code"
                                        className="flex-1 border rounded-md px-3 py-2"
                                        disabled={!!appliedCoupon}
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setCouponCode('');
                                                setCouponSuccess('');
                                            }}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApplyCoupon}
                                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                                {couponSuccess && <p className="text-green-600 text-sm mt-1">{couponSuccess}</p>}
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 font-semibold text-lg"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/products"
                                className="block text-center mt-4 text-purple-600 hover:text-purple-700"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

