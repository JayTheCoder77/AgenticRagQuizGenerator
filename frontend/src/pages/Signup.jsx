import { useForm } from 'react-hook-form';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Github } from 'lucide-react';

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
        <div className="min-h-screen bg-[#F9F9F9] text-gray-800 font-sans relative overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Quizify.</span>
                </div>
                <a href="https://github.com/JayTheCoder77/AgenticRagQuizGenerator" target="_blank" rel="noopener noreferrer" className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    <Github size={20} />
                </a>
            </header>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen relative">

                {/* Abstract Shapes (Left) */}
                <div className="hidden lg:block absolute left-20 bottom-0 w-64 h-64">
                    {/* Simple CSS shapes */}
                    <div className="absolute bottom-20 left-10 w-24 h-32 bg-yellow-200 rounded-lg border-2 border-black z-0"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-2 border-black bg-white z-10 flex items-center justify-center">
                        <span className="text-2xl">🚀</span>
                    </div>
                </div>

                {/* Card */}
                <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl relative z-20">
                    <div className="mb-8 ">
                        <h2 className="text-3xl font-bold mb-2">Lets Start Learning</h2>
                        <p className="text-gray-500">Please sign up to continue</p>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                {...register('email')}
                                placeholder="Your Email"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="Create Password"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1">
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 font-medium">
                            Already Have An Account? <Link to="/login" className="text-black font-bold hover:underline">Login</Link>
                        </p>
                    </div>
                </div>

                {/* Abstract Shapes (Right) */}
                <div className="hidden lg:block absolute right-20 bottom-0">
                    <div className="w-24 h-48 bg-yellow-200 border-2 border-black rounded-t-full"></div>
                    <div className="w-32 h-32 border-2 border-black bg-white -ml-8"></div>
                </div>

            </div>
        </div>
    );
}
