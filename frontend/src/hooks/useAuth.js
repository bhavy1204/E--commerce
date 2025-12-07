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

    return { user, setUser, loading, login, logout, checkAuth };
};


