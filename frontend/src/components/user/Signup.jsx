import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../utils/api';

export const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.register(formData);
            if (response.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-20'>
            <div className="form-div flex flex-col items-center gap-5 w-full max-w-md rounded-md px-6 py-8 shadow-lg bg-white">
                <h1 className='text-3xl font-semibold text-purple-800'>Signup</h1>
                
                {error && (
                    <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-full' autoComplete='off'>
                    <div className='flex gap-4'>
                        <input
                            type="text"
                            name='firstName'
                            placeholder='First Name'
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className='w-1/2 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500'
                        />
                        <input
                            type="text"
                            name='lastName'
                            placeholder='Last Name'
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className='w-1/2 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500'
                        />
                    </div>
                    <input
                        type="email"
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500'
                    />
                    <input
                        type="password"
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className='px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500'
                    />
                    <div className="flex items-center justify-between w-full">
                        <Link to="/login" className='text-sm text-blue-600 underline'>
                            Already have an account? Login
                        </Link>
                        <button 
                            type='submit' 
                            disabled={loading}
                            className='bg-green-600 mt-5 px-4 py-2 font-semibold text-white rounded-md hover:bg-green-700 disabled:opacity-50'>
                            {loading ? 'Signing up...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
