"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
    LayoutDashboard, FileText, Users, TrendingUp, ShieldCheck, 
    Building2, Globe, History, Brain, BarChart3, ShoppingCart, 
    Megaphone, MessageSquare, DollarSign, Mail, Package, Settings
} from "lucide-react";

interface AdminMenuProps {
    onClose: () => void;
}

export const AdminMenu = ({ onClose }: AdminMenuProps) => {
    const router = useRouter();

    // Synced 1:1 with Admin Dashboard sidebar (admin/page.tsx lines 1171-1188)
    const adminTabs = [
        { label: 'Overview', key: 'dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'Support Chat', key: 'support', icon: <MessageSquare size={16} /> },
        { label: 'User Management', key: 'users', icon: <Users size={16} /> },
        { label: 'Verification', key: 'verification', icon: <ShieldCheck size={16} /> },
        { label: 'Visa Database', key: 'visas', icon: <FileText size={16} /> },
        { label: 'Popular Visa', key: 'popular_visas', icon: <TrendingUp size={16} /> },
        { label: 'Company Formation', key: 'company_services', icon: <Building2 size={16} /> },
        { label: 'Arrival Card', key: 'arrival_cards', icon: <FileText size={16} /> },
        { label: 'Incoming Order', key: 'orders', icon: <ShoppingCart size={16} /> },
        { label: 'Invoicing', key: 'invoicing', icon: <FileText size={16} /> },
        { label: 'Finance & Tax', key: 'finance', icon: <DollarSign size={16} /> },
        { label: 'Email Communication', key: 'email_logs', icon: <Mail size={16} /> },
        { label: 'Audit Logs', key: 'logs', icon: <History size={16} /> },
        { label: 'Ai Master', key: 'ai_master', icon: <Brain size={16} /> },
        { label: 'Marketing Intelligence', key: 'marketing', icon: <BarChart3 size={16} /> },
        { label: 'Immigration Updates', key: 'updates', icon: <Megaphone size={16} /> },
        { label: 'Product Add-ons', key: 'addons', icon: <Package size={16} /> },
        { label: 'Global Info Popup', key: 'global_settings', icon: <Settings size={16} /> },
    ];

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={onClose}></div>
            <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 py-2 max-h-[80vh] overflow-y-auto">
                {adminTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            router.push(`/admin?tab=${tab.key}`);
                            onClose();
                        }}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        </>
    );
};
