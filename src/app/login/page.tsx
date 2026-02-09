"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock authentication delay
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f0f4f8] p-6 font-secondary">
            {/* RCA Logo - Standalone at top */}
            <div className="mb-14">
                <img
                    src="/assets/logo.png"
                    alt="RCA Logo"
                    className="w-48 h-48 object-contain"
                />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[620px] bg-white rounded-12 border border-slate-200/50 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.12)] p-14 md:p-20">
                <div className="mb-14 text-center md:text-left">
                    <h1 className="text-32px font-bold text-[#4d576a] mb-3 tracking-tight">School Account Login</h1>
                    <p className="text-[#a1aec1] text-18px">Log In to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-[60px] px-8 bg-[#f0f4f8] border border-transparent rounded-8 text-18px text-slate-700 placeholder:text-[#a1aec1] outline-none focus:bg-white focus:border-[#cbd5e0] transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-[60px] px-8 pr-16 bg-[#f0f4f8] border border-transparent rounded-8 text-18px text-slate-700 placeholder:text-[#a1aec1] outline-none focus:bg-white focus:border-[#cbd5e0] transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Actions: Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center text-16px pt-2">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-5 h-5 bg-white border border-slate-300 rounded-4 text-[#1d2b4b] focus:ring-0 cursor-pointer"
                            />
                            <span className="text-[#a1aec1] font-medium select-none group-hover:text-slate-500 transition-colors">Remember Me</span>
                        </label>
                        <a href="#" className="text-[#1d2b4b] font-bold hover:underline underline-offset-4 transition-all">Forgot my password</a>
                    </div>

                    {/* Login Button */}
                    <div className="flex justify-center pt-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full max-w-[200px] h-[60px] bg-[#1d2b4b] text-white rounded-full text-18px font-bold flex items-center justify-center gap-2 hover:bg-[#151f38] transition-all shadow-xl hover:shadow-[#1d2b4b]/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={26} />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
