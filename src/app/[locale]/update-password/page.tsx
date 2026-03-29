"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Lock, CheckCircle, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";
import { formatNavLink } from "@/utils/seo";
import styles from "../login/page.module.css"; // Reusing login styles

const UpdatePasswordPage = () => {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";
    const { updatePassword, isAuthenticated, isLoading: authLoading } = useAuth();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    // Security: If not authenticated (code exchange failed or session lost), redirect to login
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`${formatNavLink(locale, "/login")}?error=reset-session-expired`);
        }
    }, [isAuthenticated, authLoading, router, locale]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        const success = await updatePassword(password);
        setIsLoading(false);

        if (success) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push(formatNavLink(locale, "/login"));
            }, 3000);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header locale={locale} />
            <div className="flex-grow flex items-center justify-center p-4 pt-48 sm:pt-56">
                <section className={styles.section} style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div className={`glass-card ${styles.formCard} rounded-[2.5rem]`} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>

                        {!isSuccess ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                        <Lock size={32} />
                                    </div>
                                    <h1 className={styles.heading} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Update Password</h1>
                                    <p className={styles.intro} style={{ margin: '0', fontSize: '1rem' }}>Enter your new secure password</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 animate-shake">
                                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleUpdate} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>New Password</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <Lock size={20} />
                                            </div>
                                            <input
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
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className={styles.input}
                                                style={{ paddingLeft: '3rem' }}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`btn btn-primary ${styles.submitBtn} flex items-center justify-center gap-2 mt-4`}
                                    >
                                        {isLoading ? "Updating..." : "Update Password"} <ArrowRight size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8 animate-fade-in">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-4 dark:text-white">Password Updated!</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    Your password has been changed successfully.<br />
                                    Redirecting you to login...
                                </p>
                                <button
                                    onClick={() => router.push(formatNavLink(locale, "/login"))}
                                    className="btn btn-primary w-full py-4 rounded-xl shadow-lg"
                                >
                                    Proceed to Login
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <Footer locale={locale} />
        </div>
    );
};

export default UpdatePasswordPage;
