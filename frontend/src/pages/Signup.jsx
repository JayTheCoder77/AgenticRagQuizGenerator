import { useForm } from 'react-hook-form';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        try {
            await client.post('/auth/signup', data);
            alert('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            setError('Signup failed. Email might exist.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-green-400">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email</label>
                        <input {...register('email')} className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block mb-1">Password</label>
                        <input type="password" {...register('password')} className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <button type="submit" className="w-full py-2 font-bold bg-green-600 rounded hover:bg-green-500 transition">
                        Create Account
                    </button>
                </form>
                <p className="text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
