"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { VisaType } from "@/constants/visas";

// Mock Users removed - using real data
const DEFAULT_MOCK_USERS: AdminUser[] = [];

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    visa: string;
    expires: string;
}

// Define the comprehensive application state
interface ApplicationState {
    currentStep: number;
    isPanelOpen: boolean;

    // Data State
    country: string | null;
    numPeople: number;
    visaType: string | null;
    priceTier: string | null; // NEW: Track selected duration/tier
    arrivalDate: string; // New

    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        passport: string;
        dob: string; // New
    };

    travelers: {
        firstName: string;
        lastName: string;
        email: string; // NEW: Collect email for each traveler
        passport: string;
        dob: string;
    }[];

    documents: {
        passportPhoto: File | null;
        recentPhoto: File | null;
        proofOfAccommodation: File | File[] | null;
    }[];

    paymentMethod: string | null;
    completedSteps: number[]; // New for Hero glow effect
    userDocuments: Record<string, UserDocument[]>;
    // New: Admin Announcement
    announcement: {
        imageUrl?: string;
        text: string;
        link?: string;
    } | null;

    // New: Notifications (User -> Admin)
    notifications: Record<string, AppNotification[]>; // UserId -> Notifications
    allNotifications: AppNotification[]; // Admin View

    // New: Admin User Management
    adminUsers: AdminUser[];

    // New: Upsells
    upsells: {
        express: boolean;
        insurance: boolean;
        vip: boolean;
        idiv: boolean; // NEW: ID Indonesian Visas
        idg: boolean; // NEW: Indonesian ID Guide
        smartId: boolean; // NEW: Smart ID (KTP-style)
    };
    addons: any[];
    popularVisaIds: string[];
    customPrice: number | null;
    optionalNotes: string; // NEW: Quick application notes
    isLocked: boolean; // NEW: Prevent visa selection changes when context is specific
}

export interface AppNotification {
    id: string;
    title?: string;
    message: string;
    type?: string;
    date: string;
    isRead: boolean;
    actionLink?: string;
    actionText?: string;
}

interface ApplicationContextType extends ApplicationState {
    visas: VisaType[]; // New
    refreshVisas: () => Promise<void>;
    openPanel: (data?: { visaId?: string; priceTier?: string; isLocked?: boolean }) => void;
    closePanel: () => void;
    setStep: (step: number) => void;
    updateData: (key: keyof ApplicationState, value: any) => void;
    updatePersonalInfo: (key: keyof ApplicationState['personalInfo'], value: string) => void;
    updateTraveler: (index: number, key: string, value: string) => void;
    updateTravelerDocument: (index: number, type: 'passportPhoto' | 'recentPhoto' | 'proofOfAccommodation', file: File | File[] | null) => void;
    markStepComplete: (step: number) => void;
    resetApplication: () => void;
    // Documents
    userDocuments: Record<string, UserDocument[]>;
    addDocument: (userId: string, doc: UserDocument) => void;
    getDocuments: (userId: string) => UserDocument[];
    updateAnnouncement: (data: { imageUrl?: string; text: string; link?: string } | null) => void;
    // Notifications
    notifications: Record<string, AppNotification[]>;
    allNotifications: AppNotification[];
    toggleUpsell: (key: 'express' | 'insurance' | 'vip' | 'idiv' | 'idg' | 'smartId') => void;
    pushNotification: (userId: string, message: string) => void;
    setNotifications: (userId: string, notifications: AppNotification[]) => void;
    setAllNotifications: (notifications: AppNotification[]) => void;
    clearNotifications: (userId: string) => void;
    deleteNotification: (id: string) => Promise<void>;

    // Admin Users
    adminUsers: AdminUser[];
    updateAdminUser: (user: AdminUser) => void;
    selectVisa: (visaId: string) => void;
    quickApply: (data: { 
        name: string, 
        email: string, 
        phone: string, 
        country: string, 
        visaId: string, 
        notes: string,
        priceTier?: string,
        customPrice?: number,
        isLocked?: boolean,
        arrivalDate?: string,
        documents?: {
            passport: string;
            photo: string;
            additional: string[];
        }
    }) => void;
    // Addons
    addons: any[];
    refreshAddons: () => Promise<void>;
    popularVisaIds: string[];
    refreshPopularVisas: () => Promise<void>;
}

const defaultState: ApplicationState = {
    currentStep: 1,
    isPanelOpen: false,
    country: null,
    numPeople: 1,
    visaType: null,
    priceTier: null,
    arrivalDate: "",
    personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passport: "",
        dob: "",
    },
    travelers: [],
    documents: [{
        passportPhoto: null,
        recentPhoto: null,
        proofOfAccommodation: null,
    }],
    paymentMethod: null,
    completedSteps: [],
    // New: User Documents Storage (Mock Database)
    userDocuments: {},
    announcement: null,
    notifications: {},
    allNotifications: [],
    adminUsers: DEFAULT_MOCK_USERS,
    upsells: {
        express: false,
        insurance: false,
        vip: false,
        idiv: false,
        idg: false,
        smartId: false
    },
    addons: [],
    popularVisaIds: [],
    customPrice: null,
    optionalNotes: "",
    isLocked: false
};

// Types
export interface UserDocument {
    id: string;
    name: string;
    date: string;
    size: string;
    url?: string; // For real download
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
    // Load initial state safely (Hydration-safe)
    const [state, setState] = useState<ApplicationState>(defaultState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Initial Hydration from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('appState_v2');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setState((prev) => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Failed to parse app state during hydration", e);
                }
            }
            setIsHydrated(true);
        }
    }, []);

    // Persistence Effect
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Only persist critical parts (Users, Notifications, UserDocs) to avoid giant blobs
            const toSave = {
                adminUsers: state.adminUsers,
                notifications: state.notifications,
                userDocuments: state.userDocuments,
                announcement: state.announcement
            };
            localStorage.setItem('appState_v2', JSON.stringify(toSave));
        }
    }, [state.adminUsers, state.notifications, state.userDocuments, state.announcement]);

    const [visas, setVisas] = useState<VisaType[]>([]);
    const [addons, setAddons] = useState<any[]>([]);
    const [popularVisaIds, setPopularVisaIds] = useState<string[]>([]);

    const refreshPopularVisas = React.useCallback(async () => {
        try {
            const res = await fetch('/api/settings/public', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data.popular_visas && Array.isArray(data.popular_visas)) {
                    setPopularVisaIds(data.popular_visas);
                } else {
                    // Fallback to constants if not configured in DB yet
                    import('@/constants/visas').then(m => {
                        setPopularVisaIds(prev => prev.length === 0 ? m.POPULAR_VISA_IDS : prev);
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch popular visas", error);
            // Fallback
            import('@/constants/visas').then(m => {
                setPopularVisaIds(prev => prev.length === 0 ? m.POPULAR_VISA_IDS : prev);
            });
        }
    }, []);

    // Fetch Addons
    const refreshAddons = React.useCallback(async () => {
        try {
            const res = await fetch('/api/addons', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setAddons(data);
            }
        } catch (error) {
            console.error("Failed to fetch addons in context", error);
        }
    }, []);

    // Listen for the custom event from Hero/Overview or other trigger points
    useEffect(() => {
        const handleOpenEvent = () => openPanel();
        window.addEventListener('open-application-panel', handleOpenEvent);
        return () => window.removeEventListener('open-application-panel', handleOpenEvent);
    }, []);

    // Fetch Visas Globally
    const refreshVisas = React.useCallback(async () => {
        try {
            const res = await fetch('/api/visas', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setVisas(data);
            }
        } catch (error) {
            console.error("Failed to fetch visas in context", error);
        }
    }, []);

    useEffect(() => {
        refreshVisas();
        refreshAddons();
        refreshPopularVisas();

        // Handle Deep Linking / Auto-selection from URL
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const visaParam = params.get('visa');
            const openParam = params.get('open');

            if (visaParam) {
                console.log("[Context] Auto-selecting visa from URL:", visaParam);
                selectVisa(visaParam);
                if (openParam !== 'false') {
                    openPanel();
                }
            } else if (openParam === 'true') {
                openPanel();
            }
        }
    }, [refreshVisas, refreshAddons]);

    const openPanel = (data?: { visaId?: string; priceTier?: string; isLocked?: boolean }) => {
        setState((prev) => {
            const updates: Partial<ApplicationState> = { isPanelOpen: true };
            
            if (data?.visaId) {
                const foundVisa = visas.find(v => v.id === data.visaId);
                updates.visaType = foundVisa ? foundVisa.name : data.visaId;
                updates.currentStep = 2; // SKIP TO COUNTRY SELECTION
                updates.completedSteps = [1];
            }

            if (data?.priceTier) {
                updates.priceTier = data.priceTier;
            }

            if (data?.isLocked !== undefined) {
                updates.isLocked = data.isLocked;
            }

            // Ensure arrival date is initialized
            if (!prev.arrivalDate && !updates.arrivalDate) {
                updates.arrivalDate = new Date().toISOString().split('T')[0];
            }

            return { ...prev, ...updates };
        });
    };
    const closePanel = () => setState((prev) => ({ ...prev, isPanelOpen: false }));

    const setStep = (step: number) => setState((prev) => ({ ...prev, currentStep: step }));

    const updateData = (key: keyof ApplicationState, value: any) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const updatePersonalInfo = (key: keyof ApplicationState['personalInfo'], value: string) => {
        setState((prev) => {
            const newState = {
                ...prev,
                personalInfo: { ...prev.personalInfo, [key]: value },
            };

            // SIDE EFFECT: Ghost Lead Capture
            // If we have email and at least one other field (name or phone), save as lead
            if (newState.personalInfo.email && (newState.personalInfo.firstName || newState.personalInfo.phone)) {
                saveLead(newState);
            }

            return newState;
        });
    };

    const saveLead = async (currentState: ApplicationState) => {
        try {
            // Get attribution from cookie
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
                return null;
            };

            const attributionRaw = getCookie('marketing_attribution');
            const attribution = attributionRaw ? JSON.parse(decodeURIComponent(attributionRaw)) : null;

            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: currentState.personalInfo.email,
                    name: `${currentState.personalInfo.firstName} ${currentState.personalInfo.lastName}`.trim(),
                    phone: currentState.personalInfo.phone,
                    visaType: currentState.visaType || 'Unknown',
                    attributionData: attribution,
                    documents: {
                        passport: currentState.personalInfo.passport,
                        photo: (currentState.documents?.[0] as any)?.photoUrl || null,
                        additional: (currentState.documents?.[0] as any)?.additional || []
                    }
                })
            });
        } catch (e) {
            // Silent fail for lead capture
            console.warn("Lead capture failed", e);
        }
    };

    const updateTraveler = (index: number, key: string, value: string) => {
        setState((prev) => {
            const newTravelers = [...prev.travelers];
            if (!newTravelers[index]) {
                newTravelers[index] = { firstName: '', lastName: '', email: '', passport: '', dob: '' };
            }
            newTravelers[index] = { ...newTravelers[index], [key]: value } as any;
            return { ...prev, travelers: newTravelers };
        });
    };

    const updateTravelerDocument = (index: number, type: 'passportPhoto' | 'recentPhoto' | 'proofOfAccommodation', file: File | File[] | null) => {
        setState((prev) => {
            const newDocs = [...(Array.isArray(prev.documents) ? prev.documents : [prev.documents])];
            // Ensure the nested object exists
            if (!newDocs[index]) {
                newDocs[index] = { passportPhoto: null, recentPhoto: null, proofOfAccommodation: null };
            }
            newDocs[index] = { ...newDocs[index], [type]: file };
            return { ...prev, documents: newDocs };
        });
    };

    const markStepComplete = (step: number) => {
        setState((prev) => {
            if (!prev.completedSteps.includes(step)) {
                return { ...prev, completedSteps: [...prev.completedSteps, step] };
            }
            return prev;
        });
    };

    const resetApplication = () => setState({
        ...defaultState,
        adminUsers: state.adminUsers,
        notifications: state.notifications,
        userDocuments: state.userDocuments,
        announcement: state.announcement
    });

    // Document Management (Mock)
    const addDocument = (userId: string, doc: UserDocument) => {
        setState((prev) => {
            const currentDocs = prev.userDocuments[userId] || [];
            return {
                ...prev,
                userDocuments: {
                    ...prev.userDocuments,
                    [userId]: [doc, ...currentDocs] // prepend
                }
            };
        });
    };

    const getDocuments = (userId: string) => {
        return state.userDocuments[userId] || [];
    };

    const updateAnnouncement = (data: { imageUrl?: string; text: string; link?: string } | null) => {
        setState((prev) => ({ ...prev, announcement: data }));
    };

    // Notification Logic
    const pushNotification = (userId: string, message: string) => {
        setState((prev) => {
            const current = prev.notifications[userId] || [];
            const newNote: AppNotification = {
                id: `notif_${Date.now()}`,
                message,
                date: new Date().toISOString(),
                isRead: false
            };
            return {
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [userId]: [newNote, ...current]
                }
            };
        });
    };

    const selectVisa = (visaId: string) => {
        const foundVisa = visas.find(v => v.id === visaId);
        const visaName = foundVisa ? foundVisa.name : visaId;

        setState((prev) => ({
            ...prev,
            currentStep: 1,
            isPanelOpen: true,
            visaType: visaName,
            priceTier: null,
            isLocked: false
        }));
    };

    const quickApply = (data: { 
        name: string, 
        email: string, 
        phone: string, 
        country: string, 
        visaId: string, 
        notes: string,
        priceTier?: string,
        customPrice?: number,
        isLocked?: boolean,
        arrivalDate?: string,
        documents?: {
            passport: string;
            photo: string;
            additional: string[];
        }
    }) => {
        const foundVisa = visas.find(v => v.id === data.visaId);
        const visaName = foundVisa ? foundVisa.name : data.visaId;
        
        // Split name into first and last
        const nameParts = data.name.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setState((prev) => ({
            ...prev,
            currentStep: 4, // JUMP TO PAYMENT
            isPanelOpen: true,
            country: data.country,
            numPeople: 1,
            visaType: visaName,
            priceTier: data.priceTier || null,
            customPrice: data.customPrice || null,
            optionalNotes: data.notes,
            personalInfo: {
                ...defaultState.personalInfo,
                firstName,
                lastName,
                email: data.email,
                phone: data.phone,
                passport: data.documents?.passport || ""
            },
            // NEW: Store URLs in documents array for StepPayment to pick up
            documents: data.documents ? [{
                passportPhoto: null,
                recentPhoto: null,
                proofOfAccommodation: null,
                // Add custom fields for URLs
                passportUrl: data.documents.passport,
                photoUrl: data.documents.photo,
                additional: data.documents.additional,
                isPreUploaded: true
            }] : [],
            completedSteps: [1, 2, 3], // Mark previous steps as done
            isLocked: data.isLocked || false,
            arrivalDate: data.arrivalDate || prev.arrivalDate
        }));

        // Side effect: Save lead with documents
        saveLead({
            ...state,
            personalInfo: { 
                ...defaultState.personalInfo, 
                firstName, 
                lastName, 
                email: data.email, 
                phone: data.phone,
                passport: data.documents?.passport || "" 
            },
            visaType: visaName,
            // Pass document URLs for backend to pick up
            documents: data.documents ? [{
                recentPhotoUrl: data.documents.photo,
                additional: data.documents.additional
            } as any] : []
        } as any);
    };

    const clearNotifications = async (userId: string) => {
        // Optimistic UI update
        setState((prev) => {
            const newNotifs = { ...prev.notifications };
            delete newNotifs[userId];
            return { ...prev, notifications: newNotifs };
        });

        // Persist to Server
        try {
            await fetch(`/api/notifications?userId=${userId}`, { method: 'DELETE' });
        } catch (e) {
            console.error("Failed to clear notifications on server", e);
        }
    };

    const deleteNotification = async (id: string) => {
        setState((prev) => {
            // Remove from allNotifications
            const newAll = prev.allNotifications.filter(n => n.id !== id);

            // Remove from user-specific map (scan all keys)
            const newMap = { ...prev.notifications };
            Object.keys(newMap).forEach(key => {
                newMap[key] = newMap[key].filter(n => n.id !== id);
            });

            return { ...prev, allNotifications: newAll, notifications: newMap };
        });

        try {
            await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error("Failed to delete notification", e);
        }
    };

    const updateAdminUser = (updatedUser: AdminUser) => {
        setState(prev => ({
            ...prev,
            adminUsers: prev.adminUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
        }));
    };

    const toggleUpsell = (key: 'express' | 'insurance' | 'vip' | 'idiv' | 'idg' | 'smartId') => {
        setState(prev => ({
            ...prev,
            upsells: {
                ...prev.upsells,
                [key]: !prev.upsells[key]
            }
        }));
    };

    return (
        <ApplicationContext.Provider
            value={{
                ...state,
                visas,
                refreshVisas,
                openPanel,
                closePanel,
                setStep,
                updateData,
                updatePersonalInfo,
                updateTraveler,
                updateTravelerDocument,
                markStepComplete,
                resetApplication,
                userDocuments: state.userDocuments,
                addDocument,
                getDocuments,
                announcement: state.announcement,
                updateAnnouncement,
                notifications: state.notifications,
                pushNotification,
                setNotifications: (userId: string, notifications: AppNotification[]) => {
                    setState((prev) => ({
                        ...prev,
                        notifications: {
                            ...prev.notifications,
                            [userId]: notifications
                        }
                    }));
                },
                allNotifications: state.allNotifications,
                setAllNotifications: (notifications: AppNotification[]) => {
                    setState((prev) => ({ ...prev, allNotifications: notifications }));
                },
                clearNotifications,
                deleteNotification,
                adminUsers: state.adminUsers,
                updateAdminUser,
                selectVisa,
                quickApply,
                toggleUpsell,
                addons,
                refreshAddons,
                popularVisaIds,
                refreshPopularVisas
            }}
        >
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error("useApplication must be used within an ApplicationProvider");
    }
    return context;
};
