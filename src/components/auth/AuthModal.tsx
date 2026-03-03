"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff, Mail, Phone, Lock, User, ArrowRight, ShieldCheck, Chrome } from "lucide-react";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { login, register, loginWithGoogle, isLoading } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPass, setShowPass] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score; // Max 5
    };

    const strength = getPasswordStrength(password);

    const getStrengthColor = (s: number) => {
        if (s < 2) return 'bg-red-500';
        if (s < 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const router = useRouter();  // Add router

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result = { success: false, requiresEmail: false };
        if (mode === 'login') {
            const ok = await login(email, password);
            result.success = !!ok;
        } else {
            const res = await register({ name, email, whatsapp }, password);
            result.success = res.success;
            result.requiresEmail = !!res.requiresEmail;
        }

        if (result.success) {
            onClose();
            if (result.requiresEmail) {
                router.push('/login');
                return;
            }
            // Redirect logic
            const isAdm = email.trim().toLowerCase() === 'damnbayu@gmail.com';
            if (isAdm) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    };

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X size={24} />
                </button>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
                        onClick={() => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
                        onClick={() => setMode('register')}
                    >
                        Sign Up
                    </button>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>
                        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                    </h3>
                    <p className={styles.subtitle}>
                        {mode === 'login'
                            ? 'Access your dashboard and manage your visas.'
                            : 'Join us to easily apply and track your visas.'}
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {mode === 'register' && (
                            <div className={styles.inputGroup}>
                                <User className={styles.icon} size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className={styles.input}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <Mail className={styles.icon} size={20} />
                            <input
                                type="text"
                                placeholder="Email Address"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {mode === 'register' && (
                            <div className={styles.inputGroup}>
                                <Phone className={styles.icon} size={20} />
                                <input
                                    type="text"
                                    placeholder="WhatsApp Number"
                                    className={styles.input}
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <Lock className={styles.icon} size={20} />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className={styles.eyeBtn}
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Password Strength Bar */}
                        {password.length > 0 && (
                            <div className="w-full h-1 bg-gray-200 mt-2 rounded overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                                    style={{ width: `${(strength / 5) * 100}%` }}
                                />
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                            {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                            {!isLoading && <ArrowRight size={18} className="ml-2" />}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>Or continue with</span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className={styles.googleBtn}
                    >
                        <Chrome size={20} className="mr-2" />
                        Continue with Google
                    </button>

                    <div className={styles.footer}>
                        <p>
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className={styles.linkBtn}
                            >
                                {mode === 'login' ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>

                    <div className={styles.secureBadge}>
                        <ShieldCheck size={14} />
                        <span>Secure SSL Encrypted Connection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
