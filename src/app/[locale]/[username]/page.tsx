"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';

import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import {
    User, MapPin, Shield, Activity, Phone, MessageCircle, AlertTriangle,
    Link as LinkIcon, Edit2, LogOut, FileText, ArrowRight, Plus,
    Bell, Send, Building, Clock, Camera, Lock, Globe, CheckCircle2
} from "lucide-react";
import { VisaType } from "@/constants/visas";
import { useApplication } from "@/components/application/ApplicationContext";

// Mock Data Removed - Now Types Only
import { UserDocument } from "@/components/application/ApplicationContext";
const SupportChat = dynamic(() => import("@/components/dashboard/SupportChat"), { ssr: false });

import { X } from "lucide-react"; // Import X for close button
import { QRCodeSVG } from 'qrcode.react';
import NotificationManager from "@/components/dashboard/NotificationManager";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import { downloadIDiv } from "@/utils/idivDownloadTools";
import { Download, FileImage, FileType } from "lucide-react";


interface VisaHistoryItem {
    id: string;
    visaName: string;
    status: string;
    appliedAt: string;
    expiresAt?: string;
    slug?: string;
    paymentStatus?: string;
}

const UserDashboard = () => {
    const { user, location, updateProfile, logout, deleteAccount, requestLocation, updatePassword } = useAuth();
    const {
        getDocuments,
        announcement, // Admin Broadcast
        personalInfo,
        visaType,
        country,
        documents: appDocs,
        pushNotification,
        notifications,
        setNotifications, // Added
        clearNotifications
    } = useApplication();

    const router = useRouter();
    const params = useParams();
    const [editMode, setEditMode] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showChat, setShowChat] = useState(false); // New Chat State

    // Change Password State
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [visas, setVisas] = useState<VisaType[]>([]);

    // Real Data State
    const [realDocs, setRealDocs] = useState<any[]>([]);
    const [visaHistory, setVisaHistory] = useState<VisaHistoryItem[]>([]);
    const [verification, setVerification] = useState<any>(null); // New
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Fetch User Data (Documents & History)
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                // 1. Fetch Documents
                const docsRes = await fetch(`/api/documents?userId=${user.id}`);
                if (docsRes.ok) setRealDocs(await docsRes.json());

                // 2. Fetch Visa History
                const historyRes = await fetch(`/api/applications?userId=${user.id}`);
                if (historyRes.ok) {
                    const history = await historyRes.json();
                    setVisaHistory(history.map((h: any) => ({
                        id: h.id,
                        visaName: h.visaName,
                        status: h.status,
                        appliedAt: new Date(h.appliedAt).toLocaleDateString(),
                        expiresAt: h.expiresAt ? new Date(h.expiresAt).toLocaleDateString() : "-",
                        slug: h.slug,
                        paymentStatus: h.paymentStatus || 'UNPAID'
                    })));
                }

                // 3. Fetch Verification
                const verifyRes = await fetch(`/api/verification?userId=${user.id}`);
                if (verifyRes.ok) {
                    const data = await verifyRes.json();
                    if (data) setVerification(data);
                }

                // 4. Fetch Persistent Notifications
                const notifRes = await fetch(`/api/notifications?userId=${user.id}`);
                if (notifRes.ok) {
                    const notifs = await notifRes.json();
                    // format dates or ensure compatibility if necessary, assuming API returns compatible AppNotification[]
                    setNotifications(user.id, notifs);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [user?.id]);

    // Fetch Visas
    useEffect(() => {
        const fetchVisas = async () => {
            try {
                const res = await fetch('/api/visas');
                if (res.ok) {
                    const data = await res.json();
                    setVisas(data);
                }
            } catch (error) {
                console.error("Failed to fetch visas", error);
            }
        };
        fetchVisas();
    }, []);

    // Helper for sending notifications (accessible to all hooks)
    const sendNotificationIfNew = async (userId: string, title: string, message: string, type: string) => {
        // Only send if not already in local notification list to avoid spamming
        const existing = notifications[userId]?.find(n => n.title === title);
        // Note: For chat, we might want to allow duplicates, but let's keep it debounced for now or use a different check?
        // Actually for chat messages, the title is usually distinct enough or we just allow it.
        // But for safety let's keep the existing check.
        if (!existing) {
            try {
                await fetch('/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId, // Target specific user
                        title,
                        message,
                        type,
                        actionLink: '/admin/tab=support', // Should link to support? User just stays here.
                        actionText: 'View Chat'
                    })
                });
            } catch (e) { console.error("Auto-notif failed", e); }
        }
    };

    // NEW: Realtime Chat Notifications
    useEffect(() => {
        if (!user?.id) return;

        let channel: any;

        const setupRealtime = async () => {
            try {
                // Listen to Notifications Table directly
                // (Since we now have a DB trigger populating it)
                channel = supabase
                    .channel(`user_notifications:${user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'Notification',
                            filter: `userId=eq.${user.id}`
                        },
                        (payload: any) => {
                            const newNote = payload.new;
                            // Update Context
                            // We need to fetch current list or just append? Context logic:
                            // setNotifications expects array. We should append.
                            // However, we don't have access to "prev" state inside this callback easily unless we use the setter callback pattern in context,
                            // OR we just assume `pushNotification` works for UI, but `pushNotification` creates a local object.
                            // Ideally `setNotifications` should handle merging.
                            // Let's use `pushNotification` for the UI Toast, AND re-fetch or manual append.

                            // 1. Show Toast / Update State ONLY if chat is closed or different context
                            // If user is chatting, we assume they see the message (or if it's a message type)
                            // But "Notification" table includes Admin Broadcasts too, which should ALWAYS show.
                            // Logic: If type='info' (chat Msg) AND showChat is true -> Skip Toast.
                            // Else -> Show Toast.

                            const isChatMsg = newNote.title?.toLowerCase().includes('message');
                            if (!isChatMsg || !showChat) {
                                pushNotification(user.id, newNote.message || "New Notification");
                            }

                            // 2. Refresh List (safest to ensure full data consistency)
                            // We can re-call the API or just add to local state if we trust payload
                            fetch(`/api/notifications?userId=${user.id}`)
                                .then(res => res.json())
                                .then(data => setNotifications(user.id, data));
                        }
                    )
                    .subscribe();

            } catch (e) {
                console.error("Notification setup failed", e);
            }
        };

        setupRealtime();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [user?.id, showChat]); // Re-added showChat to fix array size error and enable logic

    // Existing Expiry Logic
    useEffect(() => {
        if (!visaHistory || visaHistory.length === 0) return;

        const checkExpiry = async () => {
            // Find active visa (latest)
            const activeVisa = visaHistory.find(v => v.status === 'Active' || v.status === 'Approved');
            if (!activeVisa || !activeVisa.expiresAt || activeVisa.expiresAt === '-') return;

            const expiryDate = new Date(activeVisa.expiresAt);
            const today = new Date();
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 3 && diffDays > 0) {
                // Warning Notification
                await sendNotificationIfNew(
                    user!.id,
                    `Visa Expiring in ${diffDays} Days!`,
                    'Please extend your visa immediately to avoid overstay fines.',
                    'warning'
                );
            } else if (diffDays <= 0) {
                // Danger Notification (Expired)
                await sendNotificationIfNew(
                    user!.id,
                    `VISA EXPIRED! Overstay Risk!`,
                    'Your stay permit has ended. You may be fined 1,000,000 IDR/day. Contact us immediately!',
                    'error'
                );
            }
        };


        if (user?.id) checkExpiry();
    }, [visaHistory, user]);

    // Active Application Logic
    const hasApplication = !!country || !!visaType;
    const selectedVisa = visas.find(v => v.id === visaType);

    // Profile State (Mapped to ensure step 1-3 data persistence)
    // We prioritize UserProfile (AuthContext) but fallback to ApplicationContext if empty
    const [formData, setFormData] = useState({
        name: "",
        whatsapp: "",
        address: "",
        emergencyName: "",
        emergencyNumber: "",
        instagram: "",
        linkedin: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || personalInfo.firstName + " " + personalInfo.lastName || "",
                whatsapp: user.whatsapp || personalInfo.phone || "",
                address: user.address || "",
                emergencyName: user.bio?.split('|')[0] || "",
                emergencyNumber: user.bio?.split('|')[1] || "",
                instagram: user.socials?.instagram || "",
                linkedin: user.socials?.linkedin || "",
            });
        }
    }, [user, personalInfo]);

    // Verification & Redirect Logic
    useEffect(() => {
        if (!user) {
            const locale = params?.locale || "en";
            router.push(`/${locale}/login`);
            return;
        }

        // Slugify user name to compare with params
        const userSlug = user.name
            ? user.name.toLowerCase().replace(/\s+/g, '_')
            : "profile";

        const paramSlug = (params?.username as string)?.toLowerCase();

        // If trying to access someone else's dashboard, redirect to own
        if (paramSlug && paramSlug !== userSlug) {
            const locale = params?.locale || "en";
            // Optional: Allow viewing public profiles in future
            // For now, redirect to own dashboard
            router.replace(`/${locale}/${userSlug}`);
        }
    }, [user, router, params]);

    if (!user) {
        return null;
    }

    const handleSaveProfile = () => {
        updateProfile({
            name: formData.name,
            whatsapp: formData.whatsapp,
            address: formData.address,
            // Storing emergency contact in bio field as "Name|Number" for simple persistence
            bio: `${formData.emergencyName}|${formData.emergencyNumber}`,
            socials: {
                instagram: formData.instagram,
                linkedin: formData.linkedin
            }
        });
        setEditMode(false);
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            deleteAccount();
            router.push('/');
        }
    };

    // Need to import supabase if not available in context. Assuming we can use client lib or a helper.
    // Ideally we import { supabase } from '@/lib/supabase' at top.

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Upload to Supabase
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                // We need supabase client here. Since I can't add imports easily without ruining top of file, 
                // I will assume global supabase or try to fetch a signed url via API?
                // No, standard is client upload. 
                // Let's force a reload of the file to add imports if needed, but for now I will try to use a fetch to existing upload API if any?
                // Or just use the one from 'src/lib/supabase' if I can ensure it's imported.
                // Actually I can't add import here since I'm in function body.
                // I will use a direct fetch to a new upload endpoint OR assume I can update the file header later.
                // Let's create a specialized upload handler that imports supabase dynamically or uses an API route.

                // Better: Create a FormData and send to /api/users/upload (I need to create this route?)
                // Or simpler: /api/upload?type=avatar

                const formData = new FormData();
                formData.append('file', file);
                formData.append('userId', user.id);

                // Since I don't have a dedicated upload route yet, I'll create/use one 
                // OR use the existing /api/documents but treat as avatar.
                // Using /api/documents is for docs.

                // I will write a simple upload function that uses fetch to a new endpoint I'll make: /api/upload

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    updateProfile({ avatar: data.url });
                    alert("Profile photo updated and saved!");
                } else {
                    alert("Failed to upload photo.");
                }
            } catch (err) {
                console.error("Upload error", err);
                alert("Error uploading photo.");
            }
        }
    };

    // Emergency Logic
    const handleEmergency = (type: 'police' | 'ambulance' | 'hospital' | 'immigration') => {
        let query = "";
        switch (type) {
            case 'police': query = 'Police Station'; break;
            case 'ambulance': query = 'Ambulance'; break;
            case 'hospital': query = 'Hospital'; break;
            case 'immigration': query = 'Kantor Imigrasi'; break;
        }

        // Use address from profile if available, else GPS
        const searchLocation = user.address ? user.address : (location ? `${location.latitude},${location.longitude}` : "");

        const url = searchLocation
            ? `https://www.google.com/maps/search/${query}/@${location ? location.latitude + ',' + location.longitude : ''},14z` // Ideally use search near location
            : `https://www.google.com/maps/search/${query}`;

        window.open(url, '_blank');
    };

    const handlePushProcess = async () => {
        if (user?.id) {
            // Optimistic Update
            pushNotification(user.id, `Request sent! We are expediting your application.`);

            try {
                // Real Notification to Admin
                await fetch('/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: "Urgent: Push Process Request",
                        message: `User ${user.name} (${user.email}) has requested expedited processing.`,
                        type: "warning",
                        actionLink: `/admin/users`, // Link to user management
                        actionText: "View User"
                    })
                });
                alert("Notification Sent! Admin has been alerted to prioritize your application.");
            } catch (e) {
                console.error("Failed to send push notification", e);
                alert("Failed to reach server, but we've noted your request locally.");
            }
        }
    };

    const handleGeolocation = () => {
        requestLocation();
        alert("Requesting device location...");
    };

    const handleDownload = (doc: any) => {
        if (doc.url) window.open(doc.url, "_blank");
        else alert(`DownloadingMock ${doc.name}...`);
    };

    // Use Real Docs instead of Context Docs
    const displayDocs = realDocs;

    return (
        <PageWrapper>
            <NotificationManager userId={user.id} />
            {/* 1. TOP CARD (Redesigned) */}
            <SectionWrapper className="mb-8">
                <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>

                    {/* Left: Check Status / Welcome */}
                    <div className="md:w-1/3 z-10 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold mb-2 text-inherit">Welcome, {user.name.split(' ')[0]}!</h1>
                        <p className="text-inherit opacity-80 mb-4">Manage your visa applications and documents.</p>

                        {/* Status Chip */}
                        {verification?.status === 'VALID' || verification?.status === 'Active' ? (
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                                <Shield size={14} /> Verified Traveler
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                                Unverified Account
                            </div>
                        )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="md:w-2/3 z-10 flex flex-wrap gap-3 justify-center md:justify-end">
                        {/* GEOLOCATION BUTTON (Restored) */}
                        <button
                            onClick={handleGeolocation}
                            className="bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/20 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-all shadow-sm hover:shadow-md group"
                        >
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <MapPin size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-inherit group-hover:text-blue-600 transition-colors">Access Geolocation</p>
                                <p className="text-xs text-inherit opacity-70">Update location</p>
                            </div>
                        </button>

                        {/* NOTIFY ADMIN BUTTON (Restored Push Button) */}
                        <button
                            onClick={handlePushProcess}
                            className="bg-white dark:bg-white/10 hover:bg-orange-50 dark:hover:bg-orange-500/20 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-all shadow-sm hover:shadow-md group"
                        >
                            <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400">
                                <Bell size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-inherit group-hover:text-orange-600 transition-colors">Notif Admin</p>
                                <p className="text-xs text-inherit opacity-70">Alert support team</p>
                            </div>
                        </button>

                        {/* CHAT ADMIN BUTTON (Simplified Quick Support) */}
                        <button
                            onClick={() => setShowChat(!showChat)}
                            className="bg-white dark:bg-white/10 hover:bg-purple-50 dark:hover:bg-purple-500/20 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-all shadow-sm hover:shadow-md group relative"
                        >
                            {/* Unread Badge */}
                            {notifications && notifications[user!.id]?.some(n => n.title?.includes('Message') || n.title?.includes('Support')) && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                                    {notifications[user!.id].filter(n => n.title?.includes('Message') || n.title?.includes('Support')).length}
                                </span>
                            )}

                            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                                <MessageCircle size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-inherit group-hover:text-purple-600 transition-colors">Chat Admin</p>
                                <p className="text-xs text-inherit opacity-70">Open support chat</p>
                            </div>
                        </button>
                    </div>
                </div>
            </SectionWrapper>

            {/* 2. INFORMATION CENTER & VERIFICATION PANEL */}
            <SectionWrapper className="mb-8" noBottomMargin>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT: Information Center (Notifications & Broadcasts) */}
                    <div className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Activity size={20} className="text-blue-500" /> Information Center
                            </h3>
                            {notifications && notifications[user.id]?.length > 0 && (
                                <button onClick={() => clearNotifications(user.id)} className="text-xs text-red-500 hover:underline">Clear All</button>
                            )}
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {/* Admin Broadcast (Pinned) */}
                            {announcement && (
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-red-100 dark:border-red-500/30">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-red-500 text-white rounded-lg mt-1"><Bell size={14} /></div>
                                        <div>
                                            <p className="font-bold text-sm text-red-700 dark:text-red-300">Admin Broadcast</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{announcement.text}</p>
                                            {announcement.link && (
                                                <a href={announcement.link} target="_blank" className="text-xs text-red-600 font-bold hover:underline mt-2 inline-block">Read More →</a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* User Notifications */}
                            {notifications && notifications[user.id]?.length > 0 ? (
                                notifications[user.id].map((note, idx) => (
                                    <div key={idx} className={`p-3 rounded-xl border-l-4 ${note.type === 'warning' || note.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'}`}>
                                        <p className="font-bold text-sm mb-1">{note.title}</p>
                                        <p className="text-xs opacity-80">{note.message}</p>
                                    </div>
                                ))
                            ) : !announcement && (
                                <div className="text-center py-8 text-gray-400">
                                    <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Verification & Invoice Status (REPLACED WITH PREMIUM IDIV VIEW) */}
                    <div className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 h-full relative overflow-hidden flex flex-col items-center">
                        {verification && (verification.status === 'VALID' || verification.status === 'Active') ? (
                            <>
                                <div className="mb-6 w-full transform scale-[0.85] origin-top">
                                    <IDivCardModern 
                                        mode={verification.visaType?.toUpperCase().includes('IDG') || verification.visaType?.toUpperCase().includes('GUIDE') ? 'IDG' : 'IDIV'}
                                        variant="purple"
                                        showActions={false}
                                        data={{
                                            id_number: verification.id?.substring(0, 18),
                                            name: verification.fullName,
                                            nationality: verification.nationality,
                                            visa_type: verification.visaType,
                                            expiry_date: verification.expiresAt ? new Date(verification.expiresAt).toLocaleDateString() : 'N/A',
                                            issue_date: verification.issuedDate ? new Date(verification.issuedDate).toLocaleDateString() : 'N/A',
                                            address: verification.address,
                                            photoUrl: verification.photoUrl,
                                            order_id: verification.slug
                                        }} 
                                    />
                                </div>

                                <div className="w-full space-y-3 z-20">
                                    <h3 className="text-lg font-bold text-center mb-1">Your Digital IDiv Card</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => downloadIDiv('idiv-front', `IDiv-Front-${verification.slug}`, 'png')}
                                            className="flex flex-col items-center gap-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition-colors"
                                        >
                                            <FileImage size={18} className="text-blue-600" />
                                            <span className="text-[10px] font-bold">PNG</span>
                                        </button>
                                        <button
                                            onClick={() => downloadIDiv('idiv-front', `IDiv-Front-${verification.slug}`, 'jpeg')}
                                            className="flex flex-col items-center gap-1 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 transition-colors"
                                        >
                                            <Download size={18} className="text-orange-600" />
                                            <span className="text-[10px] font-bold">JPG</span>
                                        </button>
                                        <button
                                            onClick={() => downloadIDiv('idiv-front', `IDiv-Front-${verification.slug}`, 'pdf')}
                                            className="flex flex-col items-center gap-1 p-2 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <FileType size={18} className="text-red-600" />
                                            <span className="text-[10px] font-bold">PDF</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-center text-gray-400">High-quality export for printing</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full text-gray-400 py-10">
                                <Shield size={48} className="mb-4 opacity-20" />
                                <h3 className="text-lg font-bold text-gray-500 mb-2">IDiv Not Active</h3>
                                <p className="text-sm max-w-xs mx-auto mb-6">
                                    Your digital verification card will be available here once your visa is fully processed.
                                </p>
                                <button onClick={() => setShowChat(true)} className="btn btn-primary text-xs py-2 px-4 rounded-full">
                                    Check Status
                                </button>
                            </div>
                        )}

                        {/* Status Watermark */}
                        <div className={`absolute -bottom-10 -right-10 text-9xl font-black opacity-5 pointer-events-none select-none ${verification?.status === 'VALID' || verification?.status === 'Active' ? 'text-green-500' : 'text-gray-300'}`}>
                            {verification?.status === 'VALID' || verification?.status === 'Active' ? 'VALID' : 'WAIT'}
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* 3. Main Grid */}
            <SectionWrapper noBottomMargin>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Profile (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card p-8 rounded-[2rem]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold dark:text-gray-500 flex items-center gap-2">
                                    <User size={20} className="text-gray-500" /> My Profile
                                </h3>
                                <button
                                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                                    className="text-primary text-sm font-bold bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                                >
                                    {editMode ? "Save Changes" : "Edit"}
                                </button>
                            </div>

                            <div className="flex flex-col items-center mb-8 relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white dark:border-gray-800 relative">
                                    {user.avatar && user.avatar.length > 5 ? (
                                        <Image
                                            src={user.avatar}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover rounded-full"
                                            // @ts-ignore
                                            onError={(e: any) => {
                                                e.currentTarget.src = '/ProfileDefault.webp';
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src="/ProfileDefault.webp"
                                            alt="Default Profile"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={24} />
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                    </label>
                                </div>
                                <h3 className="text-xl font-bold text-inherit">{user.name}</h3>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>

                            {/* Profile Fields */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                    {editMode ? (
                                        <input
                                            className="w-full bg-white dark:bg-white/5 border border-gray-400 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-medium dark:text-gray-200">{user.name}</p>
                                    )}
                                </div>

                                {/* WhatsApp */}
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">WhatsApp</label>
                                    {editMode ? (
                                        <input
                                            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-medium dark:text-gray-200">{user.whatsapp || "Not set"}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Current Address</label>
                                    {editMode ? (
                                        <textarea
                                            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                                            rows={2}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-medium text-sm dark:text-gray-200">{user.address || "No address provided"}</p>
                                    )}
                                </div>

                                {/* UPDATED: Emergency Contact (was Bio) */}
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-l-4 border-red-400">
                                    <label className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-1">Emergency Contact</label>
                                    {editMode ? (
                                        <div className="space-y-2">
                                            <input
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                                                placeholder="Contact Name"
                                                value={formData.emergencyName}
                                                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                            />
                                            <input
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                                                placeholder="Contact Number"
                                                value={formData.emergencyNumber}
                                                onChange={(e) => setFormData({ ...formData, emergencyNumber: e.target.value })}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-sm">
                                            <p className="font-bold dark:text-white">{user.bio?.split('|')[0] || "Not Set"}</p>
                                            <p className="text-gray-500">{user.bio?.split('|')[1] || ""}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Privacy & Delete */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                                <button
                                    onClick={() => setShowPrivacy(!showPrivacy)}
                                    className="w-full flex justify-between items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-4"
                                >
                                    Privacy & Settings
                                    <ArrowRight size={16} className={`transform transition-transform ${showPrivacy ? 'rotate-90' : ''}`} />
                                </button>

                                {showPrivacy && (
                                    <div className="space-y-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                        {/* Delete Account */}
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="w-full py-2 rounded-lg bg-red-100 text-red-600 text-sm font-bold hover:bg-red-200 transition-colors"
                                        >
                                            Delete My Account
                                        </button>

                                        {/* Change Password Form */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                                            <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Lock size={16} /> Change Password
                                            </h4>

                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="w-full mb-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                className="w-full mb-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            />

                                            <button
                                                onClick={async () => {
                                                    if (newPassword !== confirmNewPassword) {
                                                        alert("Passwords do not match!");
                                                        return;
                                                    }
                                                    if (newPassword.length < 6) {
                                                        alert("Password must be at least 6 characters.");
                                                        return;
                                                    }

                                                    setIsChangingPassword(true);
                                                    const success = await updatePassword(newPassword);
                                                    if (success) {
                                                        setNewPassword("");
                                                        setConfirmNewPassword("");
                                                        setShowPrivacy(false); // Close panel on success
                                                    }
                                                    setIsChangingPassword(false);
                                                }}
                                                disabled={!newPassword || !confirmNewPassword || isChangingPassword}
                                                className="w-full py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isChangingPassword ? "Updating..." : "Update Password"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={logout}
                                    className="w-full py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 font-bold flex items-center justify-center gap-2 transition-colors mt-2"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Active Visa & Emergency (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Primary Actions (Apply/Extend) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onClick={() => router.push('/apply')} className="glass-card p-6 rounded-[2rem] hover:border-primary/50 transition-all group text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Plus size={100} className="text-primary" />
                                </div>
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <Plus size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-1 text-inherit">Apply for New Visa</h3>
                                <span className="text-primary font-bold flex items-center gap-2 text-sm">Start Application <ArrowRight size={16} /></span>
                            </button>
                            <button onClick={() => router.push('/extend')} className="glass-card p-6 rounded-[2rem] hover:border-accent/50 transition-all group text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Clock size={100} className="text-accent" />
                                </div>
                                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                    <Clock size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-1 text-inherit">Extend My Visa</h3>
                                <span className="text-accent font-bold flex items-center gap-2 text-sm">Extend Now <ArrowRight size={16} /></span>
                            </button>
                        </div>

                        {/* Active Application */}
                        {hasApplication && (
                            <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden">
                                <button
                                    onClick={() => router.push('/apply')}
                                    className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
                                    title="Edit Application"
                                    aria-label="Edit application"
                                >
                                    <Edit2 size={18} className="text-gray-700" />
                                </button>

                                <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                        <FileText size={20} className="text-accent" /> Application in Progress
                                    </h3>
                                    <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Step 3 of 4
                                    </span>
                                </div>

                                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Applicant</p>
                                            <p className="font-bold dark:text-white">{personalInfo.firstName} {personalInfo.lastName}</p>
                                            <p className="text-sm text-gray-500">{personalInfo.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Visa Type</p>
                                            <p className="font-bold dark:text-white">{selectedVisa?.name || visaType || "Not Selected"}</p>
                                            <p className="text-sm text-gray-500">Destination: {country || "Indonesia"}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative pt-6 mt-4 border-t border-gray-200">
                                        <div className="flex mb-2 items-center justify-between">
                                            <span className="text-xs font-semibold inline-block text-primary">Validation Pending</span>
                                            <span className="text-xs font-semibold inline-block text-primary">75%</span>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                                            <div style={{ width: `75%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"></div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/apply')}
                                    className="btn btn-primary w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    Continue Application <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Emergency Center (Updated) */}
                        <div className="glass-card p-8 rounded-[2rem] border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-2">
                                <AlertTriangle size={24} /> Emergency Action Hub
                            </h3>
                            <p className="text-inherit opacity-70 mb-6 text-sm">
                                Instant routing to local Bali emergency services via GPS or your registered address.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => handleEmergency('police')}
                                    className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl flex flex-col items-center justify-center text-blue-700 transition-all hover:-translate-y-1"
                                    aria-label="Call Police Emergency"
                                >
                                    <Shield size={28} className="mb-2" />
                                    <span className="font-bold text-sm">Police</span>
                                </button>
                                <button
                                    onClick={() => handleEmergency('ambulance')}
                                    className="bg-red-50 hover:bg-red-100 p-4 rounded-xl flex flex-col items-center justify-center text-red-600 transition-all hover:-translate-y-1"
                                    aria-label="Call Ambulance"
                                >
                                    <Activity size={28} className="mb-2" />
                                    <span className="font-bold text-sm">Ambulance</span>
                                </button>
                                <button
                                    onClick={() => handleEmergency('hospital')}
                                    className="bg-green-50 hover:bg-green-100 p-4 rounded-xl flex flex-col items-center justify-center text-green-700 transition-all hover:-translate-y-1"
                                    aria-label="Find Hospital"
                                >
                                    <div className="text-3xl font-bold mb-0 leading-none">+</div>
                                    <span className="font-bold text-sm">Hospital</span>
                                </button>
                                <button
                                    onClick={() => handleEmergency('immigration')}
                                    className="bg-orange-50 hover:bg-orange-100 p-4 rounded-xl flex flex-col items-center justify-center text-orange-700 transition-all hover:-translate-y-1"
                                    aria-label="Contact Immigration"
                                >
                                    <Building size={28} className="mb-2" />
                                    <span className="font-bold text-sm">Immigration</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Support & Documents Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-[2rem]">
                                <h3 className="font-bold mb-4 text-inherit flex items-center gap-2">
                                    <Clock size={18} className="text-primary" /> 24/7 Priority Support
                                </h3>
                                <div className="space-y-3">
                                    <a href="https://wa.me/6285727041992" target="_blank" className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-800 text-sm">WhatsApp Direct</p>
                                            <p className="text-xs text-green-600">+62 857-2704-1992</p>
                                        </div>
                                    </a>

                                    {/* New Chat Admin Trigger */}
                                    <button
                                        onClick={() => setShowChat(true)}
                                        className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-blue-800 text-sm">Chat Admin</p>
                                            <p className="text-xs text-blue-600">In-App Support</p>
                                        </div>
                                    </button>

                                </div>
                            </div>
                            {/* Documents */}
                            <div className="glass-card p-6 rounded-[2rem]">
                                <h3 className="font-bold mb-4 text-inherit">My Documents</h3>
                                <div className="space-y-2 h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {displayDocs.length > 0 ? displayDocs.map(doc => (
                                        <div key={doc.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 text-sm text-inherit">
                                            <span className="truncate max-w-[120px] font-medium">{doc.name}</span>
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="text-primary hover:bg-primary/10 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                                                aria-label={`Download ${doc.name}`}
                                            >
                                                Download <ArrowRight size={14} className="-rotate-90" />
                                            </button>
                                        </div>
                                    )) : <p className="text-xs text-gray-400">No documents found.</p>}
                                </div>
                            </div>
                        </div>

                        {/* NEW: Security & AI Safeguard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Digital Vault */}
                            <div className="glass-card p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Lock size={120} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Shield size={24} className="text-green-400" /> Secure Data Vault
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                    Your data is our priority. All your document scans, application logs, and personal identity data are saved safely inside our **Hussle-Free Integrated System**. We use AES-256 bank-grade encryption to ensure your digital life in Indonesia is protected 24/7.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
                                    <CheckCircle2 size={14} /> Encrypted & Secure
                                </div>
                            </div>

                            {/* AI System Safeguard */}
                            <div className="glass-card p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Globe size={120} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Activity size={24} className="text-white" /> AI System Safeguard
                                </h3>
                                <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                                    Our integrated AI engine monitors your stay duration in real-time. It automatically alerts our legal team if an overstay risk is detected, ensuring a hussle-free experience.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                                    <Bell size={14} /> Integrated Protection
                                </div>
                            </div>
                        </div>

                        {/* NEW: Dedicated Partner Ecosystem Section */}
                        <div className="glass-card p-8 rounded-[3rem] bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Globe size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold mode-aware-text text-inherit">Linked Partner Companies</h3>
                                    <p className="text-xs mode-aware-subtext text-inherit opacity-70">Exclusive services for our valued members</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href="https://tropictechbali.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-[2rem] transition-all border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 shadow-sm hover:shadow-md"
                                >
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <Building size={28} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-extrabold text-blue-900 dark:text-blue-300">Tropic Tech Bali</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">Rent Setup for Work</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Plus size={16} />
                                    </div>
                                </a>

                                <a
                                    href="https://wellnessbali.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-[2rem] transition-all border border-gray-100 dark:border-white/5 hover:border-green-200 dark:hover:border-green-500/30 shadow-sm hover:shadow-md"
                                >
                                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <Activity size={28} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-extrabold text-green-900 dark:text-green-300">Wellness Bali</p>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium whitespace-nowrap">Massage and Jacuzzi</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-green-200 dark:border-green-500/30 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                                        <Plus size={16} />
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* NEW: Visa History (Photo 2) */}
                        <div className="glass-card p-8 rounded-[2rem]">
                            <h3 className="text-xl font-bold mb-6 text-inherit">Visa History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-white/10">
                                            <th className="pb-3 text-sm font-bold text-inherit opacity-60">Visa Type</th>
                                            <th className="pb-3 text-sm font-bold text-inherit opacity-60">Date Applied</th>
                                            <th className="pb-3 text-sm font-bold text-inherit opacity-60">Status</th>
                                            <th className="pb-3 text-sm font-bold text-inherit opacity-60 text-right">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {hasApplication && (
                                            <tr className="border-b border-gray-100 dark:border-white/5">
                                                <td className="py-4 font-bold text-inherit">{selectedVisa?.name || visaType}</td>
                                                <td className="py-4 text-inherit opacity-80">{new Date().toLocaleDateString()}</td>
                                                <td className="py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">In Progress</span></td>
                                                <td className="py-4 text-right">-</td>
                                            </tr>
                                        )}
                                        {visaHistory.length === 0 && !hasApplication && (
                                            <tr><td colSpan={4} className="py-4 text-center text-gray-400">No visa history found.</td></tr>
                                        )}
                                        {visaHistory.map((h, i) => (
                                            <tr key={i} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-4 font-bold text-inherit">{h.visaName}</td>
                                                <td className="py-4 text-inherit opacity-80">{h.appliedAt}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${h.status === 'Active' || h.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {h.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    {h.slug ? (
                                                        <a href={`/invoice/${h.slug}`} className={`font-bold focus:outline-none focus:underline hover:underline text-xs ${h.paymentStatus === 'PAID' ? 'text-green-600' : 'text-primary'}`} target="_blank" rel="noopener noreferrer">
                                                            {h.paymentStatus === 'PAID' ? 'View Receipt' : 'Pay Invoice'}
                                                        </a>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </SectionWrapper>

            {/* CHAT OVERLAY */}
            {
                showChat && (
                    <div className="fixed bottom-6 right-6 z-50 w-96 shadow-2xl animate-fade-in-up">
                        <div className="bg-white rounded-xl shadow-lg relative">
                            {/* Close Chat Button */}
                            <button
                                onClick={() => setShowChat(false)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors z-[60]"
                            >
                                <X size={16} />
                            </button>
                            <SupportChat />
                        </div>
                    </div>
                )
            }
        </PageWrapper>
    );
};

export default UserDashboard;
