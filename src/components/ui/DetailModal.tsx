"use client";

import React, { useEffect } from "react";
import { X, Info, ShieldCheck, Globe, Scale, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    details?: string[];
    icon?: React.ElementType;
    ctaText?: string;
    ctaLink?: string;
}

const DetailModal = ({
    isOpen,
    onClose,
    title,
    description,
    details = [],
    icon: Icon = Info,
    ctaText,
    ctaLink
}: DetailModalProps) => {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-[#0d1117] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10"
                    >
                        {/* Header Image/Pattern */}
                        <div className="h-32 bg-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -ml-12 -mb-12 blur-xl" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-xl">
                                    <Icon size={32} />
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-black/5 dark:bg-white/5 mode-aware-text hover:bg-black/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black mode-aware-text tracking-tight uppercase italic">{title}</h3>
                                <div className="h-1 w-12 bg-primary rounded-full" />
                            </div>
                            
                            <p className="text-lg mode-aware-subtext leading-relaxed font-medium">
                                {description}
                            </p>

                            {details.length > 0 && (
                                <ul className="space-y-4">
                                    {details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            <span className="text-sm font-bold mode-aware-text">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {ctaText && ctaLink && (
                                <div className="pt-4">
                                    <a 
                                        href={ctaLink}
                                        className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-4 transition-all"
                                    >
                                        {ctaText}
                                        <ArrowRight size={16} />
                                    </a>
                                </div>
                            )}

                            <button 
                                onClick={onClose}
                                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DetailModal;
