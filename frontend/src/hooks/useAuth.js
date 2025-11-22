import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await apiClient.getCurrentUser();
            if (response.success) {
                setUser(response.data);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await apiClient.login(email, password);
        if (response.success) {
            setUser(response.data.user);
            return response;
        }
        throw new Error(response.message || 'Login failed');
    };

    const logout = async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    return { user, loading, login, logout, checkAuth };
};

export const useCart = () => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product._id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { productId: product._id, product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal };
};

