"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff, Chrome } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const RegisterPage = () => {
    const { register, loginWithGoogle, resendConfirmation, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";

    const [regSuccess, setRegSuccess] = useState(false);
    const [regEmail, setRegEmail] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        countryCode: "+62", // Default to Indonesia
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const strength = getStrength(formData.password);

    const getStrengthColor = () => {
        if (strength <= 20) return "bg-red-500";
        if (strength <= 40) return "bg-orange-500";
        if (strength <= 60) return "bg-yellow-500";
        if (strength <= 80) return "bg-lime-500";
        return "bg-green-500";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const result = await register({
            name: formData.name,
            email: formData.email,
            whatsapp: `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
        }, formData.password);

        if (result.success) {
            if (result.requiresEmail) {
                setRegSuccess(true);
                setRegEmail(formData.email);
            } else {
                router.push("/dashboard");
            }
        }
    };

    if (regSuccess) {
        return (
            <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
                <Header locale={locale} />
                <main className="flex-grow flex items-center justify-center p-4 pt-48 sm:pt-56">
                    <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-[500px] w-full border-2 border-[#9155FD]/20">
                        <div className="w-20 h-20 bg-[#9155FD]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="text-[#9155FD]" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
                        <p className="text-gray-500 mb-8">
                            We've sent a confirmation link to <span className="font-bold text-black dark:text-white">{regEmail}</span>.
                            Please check your inbox (and spam folder) to activate your account.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => resendConfirmation(regEmail)}
                                className="w-full py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-[#9155FD] text-[#9155FD] font-bold hover:bg-[#9155FD] hover:text-white transition-all"
                            >
                                Resend Confirmation Email
                            </button>
                            <Link href="/login" className="text-gray-400 hover:text-[#9155FD] font-medium transition-colors">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer locale={locale} />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header locale={locale} />
            <main className="flex-grow flex items-center justify-center p-4 pt-48 sm:pt-56">
                <section className={styles.section} style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div className={`glass-card ${styles.formCard} rounded-[2.5rem]`} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                        <div className="text-center mb-8">
                            <h1 className={styles.heading} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                            <p className={styles.intro} style={{ margin: '0', fontSize: '1rem' }}>Join thousands of satisfied travelers</p>
                        </div>

                        <form onSubmit={handleRegister} className={styles.form}>

                            {/* Name Input */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className={styles.input}
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className={styles.input}
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* WhatsApp Input with Country Code Selector */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>WhatsApp Number</label>
                                <div className="flex gap-2">
                                    <div className="relative w-[100px]">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="countryCode"
                                            className={styles.input}
                                            style={{ paddingLeft: '2.5rem', paddingRight: '0.5rem', fontSize: '0.9rem' }}
                                            placeholder="+62"
                                            list="country-codes"
                                            value={formData.countryCode}
                                            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                        />
                                        <datalist id="country-codes">
                                            <option value="+62">Indonesia (+62)</option>
                                            <option value="+1">USA (+1)</option>
                                            <option value="+44">UK (+44)</option>
                                            <option value="+61">Australia (+61)</option>
                                            <option value="+33">France (+33)</option>
                                            <option value="+49">Germany (+49)</option>
                                            <option value="+7">Russia/Kazakhstan (+7)</option>
                                            <option value="+81">Japan (+81)</option>
                                            <option value="+86">China (+86)</option>
                                            <option value="+91">India (+91)</option>
                                            <option value="+65">Singapore (+65)</option>
                                            <option value="+60">Malaysia (+60)</option>
                                            <option value="+34">Spain (+34)</option>
                                            <option value="+39">Italy (+39)</option>
                                            <option value="+971">UAE (+971)</option>
                                        </datalist>
                                    </div>
                                    <div className="relative flex-grow">
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className={styles.input}
                                            placeholder="812 3456 789"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        className={styles.input}
                                        style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {/* Strength Meter */}
                                {formData.password && (
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

                            {/* Confirm Password Input */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        className={styles.input}
                                        style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl bg-[#9155FD] hover:bg-[#7e4ae8] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative z-10`}
                            >
                                {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight size={20} />
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

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer locale={locale} />
        </div>
    );
};

export default RegisterPage;
