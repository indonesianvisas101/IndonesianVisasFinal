"use client";

import React, { useEffect } from "react";
import { useGlobalUI, Notification } from "@/hooks/useGlobalUI";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, XCircle, Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const getIcon = (type: Notification["type"]) => {
    switch (type) {
        case "success": return <CheckCircle2 className="text-emerald-500" size={20} />;
        case "error": return <XCircle className="text-rose-500" size={20} />;
        case "warning": return <AlertCircle className="text-amber-500" size={20} />;
        case "info":
        default: return <Info className="text-blue-500" size={20} />;
    }
};

export default function GlobalUIOverlay() {
    const { isLoading, showLoading, hideLoading, notifications, removeNotification } = useGlobalUI();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Clear loading automatically when route changes
    useEffect(() => {
        hideLoading();
    }, [pathname, searchParams, hideLoading]);

    // 2. Intercept clicks on internal links to trigger loading instantly
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a');
            if (!target) return;
            
            const href = target.getAttribute('href');
            if (!href) return;
            
            const isInternal = href.startsWith('/') || href.startsWith(window.location.origin);
            const isSamePage = href === pathname || href === window.location.pathname || href.startsWith('#') || target.target === '_blank';

            if (isInternal && !isSamePage) {
                showLoading();
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [pathname, showLoading]);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
            <AnimatePresence mode="popLayout">
                {/* 1. Global Loading Indicator */}
                {isLoading && (
                    <motion.div
                        key="global-loader"
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                        <Loader2 className="animate-spin text-primary" size={20} />
                        Processing...
                    </motion.div>
                )}

                {/* 2. Notification Stack */}
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="pointer-events-auto flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-white/10"
                    >
                        {getIcon(notif.type)}
                        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {notif.message}
                        </span>
                        <button
                            onClick={() => removeNotification(notif.id)}
                            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <XCircle size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
