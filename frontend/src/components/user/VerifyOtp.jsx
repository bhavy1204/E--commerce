import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/api';

export const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get email from previous step
    const email = location.state?.email;

    if (!email) {
        // Redirect if accessed directly without email
        setTimeout(() => navigate('/forgot-password'), 0);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await apiClient.request('/users/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email, otp })
            });
            // If verification matches, proceed to reset password with email and otp
            navigate('/reset-password', { state: { email, otp } });
        } catch (err) {
            setError(err.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">Verify OTP</h2>
                <p className="text-center text-gray-600 mb-6">Enter the 6-digit OTP sent to {email}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength="6"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
                            placeholder="------"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="w-full text-purple-600 text-sm hover:underline"
                    >
                        Resend / Change Email
                    </button>
                </form>
            </div>
        </div>
    );
};
