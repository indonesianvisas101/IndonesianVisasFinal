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
        passport: string;
        dob: string;
    }[];

    documents: {
        passportPhoto: File | null;
        recentPhoto: File | null;
        proofOfAccommodation: File | null;
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
    openPanel: () => void;
    closePanel: () => void;
    setStep: (step: number) => void;
    updateData: (key: keyof ApplicationState, value: any) => void;
    updatePersonalInfo: (key: keyof ApplicationState['personalInfo'], value: string) => void;
    updateTraveler: (index: number, key: string, value: string) => void;
    updateTravelerDocument: (index: number, type: 'passportPhoto'|'recentPhoto'|'proofOfAccommodation', file: File | null) => void;
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
    pushNotification: (userId: string, message: string) => void;
    setNotifications: (userId: string, notifications: AppNotification[]) => void;
    setAllNotifications: (notifications: AppNotification[]) => void;
    clearNotifications: (userId: string) => void;
    deleteNotification: (id: string) => Promise<void>;

    // Admin Users
    adminUsers: AdminUser[];
    updateAdminUser: (user: AdminUser) => void;
    selectVisa: (visaId: string) => void;
}

const defaultState: ApplicationState = {
    currentStep: 1,
    isPanelOpen: false,
    country: null,
    numPeople: 1,
    visaType: null,
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
    adminUsers: DEFAULT_MOCK_USERS
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
    // Load initial state from localStorage if available, else default
    const [state, setState] = useState<ApplicationState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('appState_v2');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return { ...defaultState, ...parsed };
                } catch (e) { console.error("Failed to parse app state", e); }
            }
        }
        return defaultState;
    });

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
    }, [refreshVisas]);

    const openPanel = () => setState((prev) => ({ ...prev, isPanelOpen: true }));
    const closePanel = () => setState((prev) => ({ ...prev, isPanelOpen: false }));

    const setStep = (step: number) => setState((prev) => ({ ...prev, currentStep: step }));

    const updateData = (key: keyof ApplicationState, value: any) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const updatePersonalInfo = (key: keyof ApplicationState['personalInfo'], value: string) => {
        setState((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [key]: value },
        }));
    };

    const updateTraveler = (index: number, key: string, value: string) => {
        setState((prev) => {
            const newTravelers = [...prev.travelers];
            if (!newTravelers[index]) {
                newTravelers[index] = { firstName: '', lastName: '', passport: '', dob: '' };
            }
            newTravelers[index] = { ...newTravelers[index], [key]: value };
            return { ...prev, travelers: newTravelers };
        });
    };

    const updateTravelerDocument = (index: number, type: 'passportPhoto'|'recentPhoto'|'proofOfAccommodation', file: File | null) => {
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

    const resetApplication = () => setState(defaultState);

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
        setState((prev) => ({
            ...prev,
            // Reset application data
            currentStep: 1,
            isPanelOpen: true,
            country: null,
            numPeople: 1,
            visaType: visaId,
            arrivalDate: "",
            personalInfo: defaultState.personalInfo,
            travelers: [],
            documents: defaultState.documents,
            paymentMethod: null,
            completedSteps: [],
        }));
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
                selectVisa
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
