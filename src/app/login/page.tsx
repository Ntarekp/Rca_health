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
        <div className="min-h-screen w-full bg-[#f4f6fb] font-secondary">
            <div className="min-h-screen w-full max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
                {/* RCA Logo - Left panel */}
                <div className="flex items-center justify-center lg:justify-start">
                    <img
                        src="/assets/logo.png"
                        alt="RCA Logo"
                        className="w-[260px] h-[260px] object-contain"
                    />
                </div>

                {/* Login Card - Right panel */}
                <div className="flex items-center justify-center lg:justify-end">
                    <div className="w-full max-w-[520px] bg-[#f7f8fc] rounded-16 border border-slate-200/60 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] px-10 py-12">
                        <div className="mb-10">
                            <h1 className="text-[18px] font-extrabold tracking-wide text-slate-600">WELCOME BACK</h1>
                            <p className="mt-2 text-[14px] text-slate-400 font-medium">Log into your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full h-[52px] px-6 bg-[#eef0f6] border border-slate-200/70 rounded-12 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-300 transition-all"
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
                                        className="w-full h-[52px] px-6 pr-14 bg-[#eef0f6] border border-slate-200/70 rounded-12 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Actions: Remember Me & Forgot Password */}
                            <div className="flex justify-between items-center pt-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 bg-white border border-slate-300 rounded-[4px] text-[#1d2b4b] focus:ring-0 cursor-pointer"
                                    />
                                    <span className="text-[12px] text-slate-400 font-medium select-none group-hover:text-slate-500 transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-[12px] text-[#1d2b4b] font-semibold hover:underline underline-offset-4 transition-all">Forgot Password</a>
                            </div>

                            {/* Login Button */}
                            <div className="flex justify-center pt-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full max-w-[180px] h-[48px] bg-[#1d2b4b] text-white rounded-full text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#151f38] transition-all shadow-[0_14px_28px_-14px_rgba(29,43,75,0.65)] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
