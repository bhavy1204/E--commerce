import React from 'react';
import { createContext, useContext } from 'react';
import { useAuth as useAuthHook, useCart as useCartHook } from '../hooks/useAuth';

const AuthContext = createContext(null);
const CartContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const auth = useAuthHook();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const CartProvider = ({ children }) => {
    const cart = useCartHook();
    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return useAuthHook();
    }
    return context;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        return useCartHook();
    }
    return context;
};


