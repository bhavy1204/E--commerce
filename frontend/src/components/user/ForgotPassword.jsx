import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../utils/api';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await apiClient.request('/users/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setMessage('OTP sent to your email.');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 1000);
        } catch (err) {
            setError(err.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your registered email"
                        />
                    </div>
                    {message && <p className="text-green-600 text-sm">{message}</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-purple-600 hover:text-purple-700">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
