import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart, useAuth } from '../../context/AuthContext';

export const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
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
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{getTotal()}</span>
                                </div>
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

