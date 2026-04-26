"use client";

import React, { useState } from "react";
import { X, Send, User, Mail, MessageSquare, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceFormPopupProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}

const ServiceFormPopup: React.FC<ServiceFormPopupProps> = ({ isOpen, onClose, serviceName }) => {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        
        // Simulate API call or trigger WhatsApp
        // For now, we simulate success
        setTimeout(() => {
            setStatus("success");
            console.log(`Lead for ${serviceName}:`, formData);
        }, 1500);
    };

    if (!isOpen && status !== "success") return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black mode-aware-text tracking-tight uppercase">Apply Now</h3>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} className="mode-aware-text" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-black text-primary uppercase tracking-widest">{serviceName}</p>
                                <p className="text-sm mode-aware-subtext">Fill in your details and our Bali legal team will contact you within 2 hours.</p>
                            </div>

                            {status === "success" ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="py-12 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <Send size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold mode-aware-text">Application Sent!</h4>
                                    <p className="text-sm mode-aware-subtext px-8">We have received your request for {serviceName}. Please check your WhatsApp or Email shortly.</p>
                                    <button 
                                        onClick={onClose}
                                        className="mt-4 px-8 py-3 bg-primary text-black rounded-xl font-bold"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text ml-4">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="John Doe"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-primary outline-none transition-all mode-aware-text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text ml-4">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    required
                                                    type="email" 
                                                    placeholder="john@example.com"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-primary outline-none transition-all mode-aware-text text-sm"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text ml-4">WhatsApp</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    required
                                                    type="tel" 
                                                    placeholder="+62..."
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-primary outline-none transition-all mode-aware-text text-sm"
                                                    value={formData.whatsapp}
                                                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text ml-4">Notes (Optional)</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                                            <textarea 
                                                rows={3}
                                                placeholder="Tell us about your needs..."
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-primary outline-none transition-all mode-aware-text text-sm resize-none"
                                                value={formData.notes}
                                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full py-5 bg-primary text-black rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {status === "submitting" ? "Processing..." : "Submit Application"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ServiceFormPopup;
