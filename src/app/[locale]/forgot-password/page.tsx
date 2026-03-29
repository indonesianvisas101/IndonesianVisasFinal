"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { ArrowLeft, Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";
import { formatNavLink } from "@/utils/seo";
import styles from "../login/page.module.css"; // Reusing login styles

const ForgotPasswordPage = () => {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";
    const { resetPassword } = useAuth(); // Connect to real auth
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await resetPassword(email);

        setIsLoading(false);
        if (success) {
            setIsSent(true);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header locale={locale} />
            <div className="flex-grow flex items-center justify-center p-4 pt-48 sm:pt-56">
                <section className={styles.section} style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div className={`glass-card ${styles.formCard} rounded-[2.5rem]`} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>

                        {!isSent ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                        <Mail size={32} />
                                    </div>
                                    <h1 className={styles.heading} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reset Password</h1>
                                    <p className={styles.intro} style={{ margin: '0', fontSize: '1rem' }}>Enter your email to receive instructions</p>
                                </div>

                                <form onSubmit={handleReset} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <Mail size={20} />
                                            </div>
                                            <input
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

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`btn btn-primary ${styles.submitBtn} flex items-center justify-center gap-2 mt-4`}
                                    >
                                        {isLoading ? "Sending..." : "Send Reset Link"} <ArrowRight size={20} />
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
                                    <Link href={formatNavLink(locale, "/login")} className="flex items-center justify-center gap-2 font-bold text-gray-500 hover:text-primary transition-colors">
                                        <ArrowLeft size={16} /> Back to Login
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 animate-fade-in">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-4 dark:text-white">Check Your Inbox</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    We have sent a password reset link to<br />
                                    <strong>{email}</strong>
                                </p>
                                <button
                                    onClick={() => router.push(formatNavLink(locale, "/login"))}
                                    className="btn btn-primary w-full py-4 rounded-xl shadow-lg"
                                >
                                    Return to Login
                                </button>
                                <button
                                    onClick={() => setIsSent(false)}
                                    className="mt-4 text-sm text-gray-500 hover:text-primary transition-colors"
                                >
                                    Try another email
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

export default ForgotPasswordPage;
