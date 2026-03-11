"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

interface GlobalUIContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
    notifications: Notification[];
    notify: (message: string, type?: NotificationType, duration?: number) => void;
    removeNotification: (id: string) => void;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(undefined);

export const GlobalUIProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showLoading = useCallback(() => setIsLoading(true), []);
    const hideLoading = useCallback(() => setIsLoading(false), []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const notify = useCallback((message: string, type: NotificationType = "info", duration: number = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    return (
        <GlobalUIContext.Provider value={{
            isLoading,
            showLoading,
            hideLoading,
            notifications,
            notify,
            removeNotification
        }}>
            {children}
        </GlobalUIContext.Provider>
    );
};

export const useGlobalUI = () => {
    const context = useContext(GlobalUIContext);
    if (context === undefined) {
        throw new Error("useGlobalUI must be used within a GlobalUIProvider");
    }
    return context;
};
