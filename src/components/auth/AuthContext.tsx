"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
    avatar?: string;
    role: 'user' | 'admin';
    status?: 'active' | 'deleted'; // New
    joinedAt: string;
    // Enhanced Profile
    address?: string; // New
    bio?: string;     // New
    // Extended Profile
    socials?: {
        instagram?: string;
        linkedin?: string;
    };
    privacySettings?: {
        showProfile: boolean;
        marketingEmails: boolean;
    };
}

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    location: GeolocationCoordinates | null;

    // Actions
    // Actions
    login: (email: string, password: string) => Promise<UserProfile | null>;
    loginWithGoogle: () => Promise<void>;
    register: (data: Partial<UserProfile>, password: string) => Promise<{ success: boolean; requiresEmail?: boolean }>;
    logout: () => void;
    deleteAccount: () => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    requestLocation: () => void;
    resetPassword: (email: string) => Promise<boolean>; // New
    updatePassword: (password: string) => Promise<boolean>; // New
    resendConfirmation: (email: string) => Promise<boolean>; // New
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true); // START TRUE to prevent premature redirects
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

    // Initialize Supabase Auth Listener
    useEffect(() => {
        // Check active session
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // Force session parsing if it somehow returned as string (experimental/bug mitigation)
                    const sessionObj = typeof session === 'string' ? JSON.parse(session) : session;
                    const finalSession = sessionObj?.user ? sessionObj : session;

                    await fetchProfile(finalSession.user.id, finalSession.user.email!, finalSession.access_token);
                    // Track Activity on session restore
                    fetch('/api/user/activity', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${finalSession.access_token}` }
                    }).catch(() => { });
                }
            } catch (e) {
                console.error("Session check failed", e);
            } finally {
                setIsLoading(false); // Ensure loading stops even if error
            }
        };
        initSession();

        // Listen for changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const sessionObj = typeof session === 'string' ? JSON.parse(session) : session;
                const finalSession = sessionObj?.user ? sessionObj : session;
                await fetchProfile(finalSession.user.id, finalSession.user.email!, finalSession.access_token);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem('app_user');
                setIsLoading(false); // Ensure loading stops on sign out
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Removed the 5-minute auto-logout timer per user request (Web App persistence)

    const fetchProfile = async (userId: string, email: string, token?: string): Promise<UserProfile> => {
        try {
            console.log("Fetching profile from API for UID:", userId);

            // Using API route instead of direct Supabase client to bypass RLS issues
            const fetchOptions: any = {};
            if (token) {
                fetchOptions.headers = { 'Authorization': `Bearer ${token}` };
            }

            const res = await fetch('/api/user/profile', fetchOptions);

            if (!res.ok) {
                console.warn("Profile API fetch failed, status:", res.status);
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();

            let profile: UserProfile;

            if (data && !data.error) {
                console.log("Profile found via API for UID:", userId, data.name);
                
                // SAFETY: Force admin role for the primary admin email
                const rawRole = (email.toLowerCase() === 'damnbayu@gmail.com') ? 'admin' : data.role;

                profile = {
                    id: data.id,
                    name: data.name || '',
                    email: data.email,
                    whatsapp: data.whatsapp || '',
                    role: rawRole as 'user' | 'admin',
                    joinedAt: data.createdAt || data.created_at || new Date().toISOString(),
                    avatar: data.avatar,
                    status: data.status as 'active',
                    address: data.address || '',
                    bio: data.bio || '',
                    socials: typeof data.socials === 'string' ? JSON.parse(data.socials) : (data.socials || {})
                };
            } else {
                console.warn("No DB record found via API for UID:", userId, ". Using fallback.");
                profile = {
                    id: userId,
                    name: '',
                    email: email,
                    whatsapp: '',
                    role: 'user',
                    joinedAt: new Date().toISOString(),
                    status: 'active'
                };
            }

            setUser(profile);
            return profile;

        } catch (e) {
            console.error("fetchProfile critical failure via API:", e);
            const fallback: UserProfile = {
                id: userId,
                name: '',
                email: email,
                whatsapp: '',
                role: (email.toLowerCase() === 'damnbayu@gmail.com') ? 'admin' : 'user',
                joinedAt: new Date().toISOString(),
                status: 'active'
            };
            setUser(fallback);
            return fallback;
        }
    };

    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(position.coords);
                    console.log("Location acquired:", position.coords);
                },
                (error) => {
                    let msg = '';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            msg = 'User denied the request for Geolocation.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            msg = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            msg = 'The request to get user location timed out.';
                            break;
                        default:
                            msg = 'An unknown error occurred.';
                            break;
                    }
                    console.error("Location error:", msg, error.message);
                }
            );
        }
    };

    const login = async (email: string, pass: string): Promise<UserProfile | null> => {
        setIsLoading(true);
        try {
            const trimmedEmail = email.trim().toLowerCase();
            console.log("Attempting login for:", trimmedEmail);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password: pass,
            });

            if (error) {
                console.error("Supabase Login Error:", error.message);
                alert(error.message);
                return null;
            }

            if (data.session?.user) {
                const sessionObj = typeof data.session === 'string' ? JSON.parse(data.session) : data.session;
                const finalSession = sessionObj?.user ? sessionObj : data.session;

                const profile = await fetchProfile(finalSession.user.id, finalSession.user.email!, finalSession.access_token);

                // Track Activity
                fetch('/api/user/activity', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${data.session.access_token}`
                    }
                }).catch(err => console.error("Failed to track login activity", err));

                return profile;
            }

            return null;
        } catch (error) {
            console.error("Login unexpected error:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        prompt: 'select_account'
                    },
                    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/${window.location.pathname.split('/')[1] || 'en'}/auth/callback` : undefined,
                }
            });
            if (error) {
                console.error("Google Login Error:", error.message);
                alert(error.message);
            }
        } catch (error) {
            console.error("Google Login unexpected error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: Partial<UserProfile>, pass: string): Promise<{ success: boolean; requiresEmail?: boolean }> => {
        setIsLoading(true);
        try {
            const trimmedEmail = (data.email?.trim() || '').toLowerCase();
            console.log("Attempting registration for:", trimmedEmail);
            const { data: authData, error } = await supabase.auth.signUp({
                email: trimmedEmail,
                password: pass,
                options: {
                    data: {
                        name: data.name,
                        whatsapp: data.whatsapp,
                        role: (data.email?.trim()?.toLowerCase() === 'damnbayu@gmail.com') ? 'admin' : 'user', // Strict role check
                    },
                    emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
                }
            });

            if (error) {
                console.error("Supabase Register Error:", error.message);
                alert(error.message);
                return { success: false };
            }

            // If auto-confirm is off, tell user to check email
            if (authData.user && !authData.session) {
                alert("Check your email and confirmation your account before logging in.");
                return { success: true, requiresEmail: true };
            }

            // Explicitly save the user profile to ensure all fields (like whatsapp) are persisted
            if (authData.user) {
                const trimmedEmail = (data.email?.trim() || '').toLowerCase();
                // ONLY damnbayu@gmail.com is allowed to be admin. Everyone else is a user.
                const finalRole = trimmedEmail === 'damnbayu@gmail.com' ? 'admin' : 'user';

                const { error: profileError } = await supabase
                    .from('users')
                    .upsert({
                        id: authData.user.id,
                        email: trimmedEmail,
                        name: data.name,
                        whatsapp: data.whatsapp,
                        role: finalRole,
                        status: 'active', // Default status
                        created_at: new Date().toISOString()
                    });

                if (profileError) {
                    console.error("Failed to create user profile:", profileError.message);
                    // If Trigger failed (common cause of 'Database error saving new user'), we show a warning but let them in.
                } else {
                    // Notify Admin about New User
                    try {
                        fetch('/api/notifications', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: "New User Registered",
                                message: `User ${data.name} (${data.email}) just joined.`,
                                type: "info",
                                actionLink: "/admin?tab=users",
                                actionText: "View Users"
                            })
                        });
                    } catch (e) { console.error("Failed to notify admin", e); }
                }
            }

            return { success: true };
        } catch (error) {
            console.error("Registration unexpected error:", error);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            // timeout race to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Logout Timeout")), 3000)
            );
            await Promise.race([supabase.auth.signOut(), timeoutPromise]);
        } catch (error) {
            console.error("Logout error (non-blocking):", error);
        } finally {
            // Force clear state
            setUser(null);
            localStorage.removeItem('app_user');

            // Force redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    };


    const updateProfile = async (data: Partial<UserProfile>) => {
        if (user) {
            // 1. Optimistic Update (UI behaves instantly)
            const updated = { ...user, ...data };
            setUser(updated);
            localStorage.setItem('app_user', JSON.stringify(updated));

            // 2. Persist to Database
            try {
                // Persist to Database via API to bypass RLS
                const res = await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                    },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    const err = await res.json();
                    console.error("Failed to persist profile update:", err.details || err.error);
                    alert("Failed to save profile changes. Please try again.");
                } else {
                    console.log("Profile persisted to DB via API");
                }
            } catch (err) {
                console.error("Unexpected error saving profile:", err);
                alert("An unexpected error occurred while saving.");
            }
        }
    };

    const deleteAccount = () => {
        if (user) {
            // Soft delete: mark as deleted but keep data (simulated)
            const deletedUser = { ...user, status: 'deleted' as const };
            // In a real app, send API request here.
            console.log("Account deleted:", deletedUser);

            // Log out user
            setUser(null);
            localStorage.removeItem('app_user');
            alert("Your account has been deleted.");
        }
    };

    const resetPassword = async (email: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const trimmedEmail = email.trim().toLowerCase();
            console.log("Attempting password reset for:", trimmedEmail);
            const locale = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'en') : 'en';
            const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/${locale}/update-password` : undefined,
            });

            if (error) {
                console.error("Password reset error:", error.message);
                alert(error.message);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Reset unexpected error:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resendConfirmation = async (email: string) => {
        setIsLoading(true);
        try {
            const locale = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'en') : 'en';
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
                }
            });
            if (error) throw error;
            alert("Confirmation email resent! Please check your inbox.");
            return true;
        } catch (error: any) {
            console.error("Resend error:", error.message);
            alert(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                console.error("Update Password Error:", error.message);
                alert(error.message);
                return false;
            }

            alert("Password updated successfully!");
            return true;
        } catch (error) {
            console.error("Update Password unexpected error:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            location,
            login,
            loginWithGoogle,
            register,
            logout,
            deleteAccount,
            updateProfile,
            requestLocation,
            resetPassword,
            updatePassword,
            resendConfirmation
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
