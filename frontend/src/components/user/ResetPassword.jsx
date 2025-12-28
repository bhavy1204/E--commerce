import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiClient } from '../../utils/api';

export const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { email, otp } = location.state || {};

    if (!email || !otp) {
        setTimeout(() => navigate('/forgot-password'), 0);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiClient.request('/users/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, otp, newPassword: password })
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
                    <p className="text-gray-600 mb-6">Your password has been reset successfully.</p>
                    <Link
                        to="/login"
                        className="block w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                    >
                        Login with New Password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Confirm new password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-purple-600 hover:text-purple-700">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
