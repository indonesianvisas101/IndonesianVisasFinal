"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useParams, useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Chrome } from "lucide-react";
import Link from "next/link";
import { formatNavLink } from "@/utils/seo";
import styles from "./page.module.css";

const LoginPage = () => {
    const { login, loginWithGoogle, resendConfirmation, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Simple password strength calculator
    const getStrength = (pass: string) => {
        let strength = 0;
        if (pass.length > 5) strength += 20;
        if (pass.length > 7) strength += 20;
        if (/[A-Z]/.test(pass)) strength += 20;
        if (/[0-9]/.test(pass)) strength += 20;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
        return strength;
    };

    const strength = getStrength(password);

    const getStrengthColor = () => {
        if (strength <= 20) return "bg-red-500";
        if (strength <= 40) return "bg-orange-500";
        if (strength <= 60) return "bg-yellow-500";
        if (strength <= 80) return "bg-lime-500";
        return "bg-green-500";
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        const profile = await login(trimmedEmail, password);
        if (profile) {
            if (profile.role === 'admin' && trimmedEmail === 'damnbayu@gmail.com') {
                router.push(formatNavLink(locale, "/admin"));
            } else {
                router.push(formatNavLink(locale, "/dashboard"));
            }
        }
    };

    return (
        <PageWrapper className="transition-colors duration-300 flex items-center justify-center">
            <main className="flex-grow flex items-center justify-center p-4 w-full">
                <section className={styles.section} style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div className={`glass-card ${styles.formCard} rounded-[2.5rem]`} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                        <div className="text-center mb-8 relative">
                            {/* EXIT BUTTON */}
                            <Link
                                href={formatNavLink(locale, "/")}
                                className="absolute -top-6 -right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </Link>

                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                <Lock size={32} />
                            </div>
                            <h1 className={styles.heading} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                            <p className={styles.intro} style={{ margin: '0', fontSize: '1rem' }}>Sign in to manage your account</p>
                        </div>

                        <form onSubmit={handleLogin} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className={styles.input}
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className={styles.input}
                                        style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {/* Password Strength Meter */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                style={{ width: `${strength}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-right mt-1 text-gray-500">
                                            {strength < 40 ? "Weak" : strength < 80 ? "Medium" : "Strong"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm mt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                    Remember me
                                </label>
                                <Link href={formatNavLink(locale, "/forgot-password")} className="font-semibold text-primary hover:underline">Forgot Password?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`btn btn-primary ${styles.submitBtn} flex items-center justify-center gap-2`}
                            >
                                {isLoading ? "Signing In..." : "Sign In"} <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>Or continue with</span>
                        </div>

                        <button
                            onClick={loginWithGoogle}
                            className={styles.googleBtn}
                            type="button"
                        >
                            <Chrome size={20} className="mr-2" />
                            Continue with Google
                        </button>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 text-center flex flex-col gap-3">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Don't have an account? <Link href={formatNavLink(locale, "/register")} className="font-bold text-primary hover:underline">Create Account</Link>
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    const email = prompt("Enter your email to resend confirmation:");
                                    if (email) resendConfirmation(email);
                                }}
                                className="text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer"
                            >
                                Didn't receive confirmation email? Resend it
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </PageWrapper>
    );
};

export default LoginPage;
