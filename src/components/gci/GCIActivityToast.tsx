"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Globe, Activity, CheckCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface ActivityItem {
    country: string;
    action: string;
    count: number;
}

export default function GCIActivityToast({ dict }: { dict?: any }) {
    const pathname = usePathname();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [current, setCurrent] = useState(0);
    const [visible, setVisible] = useState(false);

    // Naive locale detection from path
    const locale = pathname?.split('/')[1] === 'id' ? 'id' : 'en';

    const fetchActivity = async () => {
        try {
            const res = await fetch('/api/gci/activity');
            const result = await res.json();
            if (result.data && result.data.length > 0) {
                setActivities(result.data);
                setVisible(true);
            }
        } catch (e) {
            // Quietly fail
        }
    };

    useEffect(() => {
        const initialTimer = setTimeout(fetchActivity, 3000);
        
        const cycleTimer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                if (activities.length > 0 && current >= activities.length - 1) {
                    fetchActivity();
                    setCurrent(0);
                } else if (activities.length > 0) {
                    setCurrent((prev) => (prev + 1));
                    setVisible(true);
                }
            }, 1000);
        }, 15000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(cycleTimer);
        };
    }, [current, activities.length]);

    if (activities.length === 0) return null;

    const activity = activities[current];

    const labels = {
        en: { live: "Live Activity", usersFrom: "users from", actionPost: "are" },
        id: { live: "Aktivitas Langsung", usersFrom: "pengguna dari", actionPost: "sedang" }
    }[locale] || { live: "Live Activity", usersFrom: "users from", actionPost: "are" };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, y: 100 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed bottom-6 right-6 z-[9999]"
                >
                    <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/15 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 max-w-sm">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/10">
                            <Activity size={28} className="animate-pulse" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                    <Globe size={12} /> {labels.live}
                                </span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            </div>
                            
                            <p className="text-sm text-white font-bold leading-tight line-clamp-2">
                                <span className="text-blue-200">{activity.count || 1}</span> {labels.usersFrom} <span className="text-amber-400">{activity.country}</span> <br/> 
                                <span className="text-slate-400 font-medium italic">{labels.actionPost} {activity.action}.</span>
                            </p>
                        </div>

                        <button onClick={() => setVisible(false)} className="text-slate-600 hover:text-white transition-colors bg-white/5 p-2 rounded-xl">
                            <CheckCircle size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
