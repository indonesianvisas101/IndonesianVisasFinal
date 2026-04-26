"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Info, AlertCircle, Zap, Globe } from "lucide-react";
import { useApplication } from "./ApplicationContext";
import { calculateVisaTotal } from "@/lib/utils";
import { addWorkingDays, formatDateForInput, getDaysForTier } from "@/lib/dateUtils";

interface VisaChildQuickCTAProps {
    visa: any;
}

export default function VisaChildQuickCTA({ visa }: VisaChildQuickCTAProps) {
    const { quickApply } = useApplication();
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        notes: ""
    });

    if (!visa) return null;

    const totals = calculateVisaTotal(visa.price, visa.fee);
    const hasTiers = typeof totals === 'object' && totals !== null;

    const handleQuickApply = (e: React.FormEvent) => {
        e.preventDefault();

        if (hasTiers && !selectedTier) {
            setIsShaking(true);
            return;
        }

        const tier = selectedTier || (typeof totals === 'string' ? 'Standard' : Object.keys(totals)[0]);
        const days = getDaysForTier(tier);
        const arrivalDate = formatDateForInput(addWorkingDays(new Date(), days));

        quickApply({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            visaId: visa.id,
            notes: formData.notes,
            priceTier: tier,
            isLocked: true,
            arrivalDate
        });
    };

    return (
        <section className="py-20 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="container mx-auto px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                        <Zap size={14} /> Quick Application
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tighter leading-tight">
                        Ready to secure your <span className="text-primary">{visa.name}</span>?
                    </h2>

                    <p className="text-xl mode-aware-subtext font-medium max-w-2xl mx-auto leading-relaxed">
                        Start your expedited application now. Our system will prioritize your request and route it directly to our immigration experts.
                    </p>

                    {/* Quick Input Form */}
                    <form onSubmit={handleQuickApply} className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text opacity-60 ml-2">Full Name *</label>
                                <input 
                                    required
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text opacity-60 ml-2">Email Address *</label>
                                <input 
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text opacity-60 ml-2">Citizenship *</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. United Kingdom"
                                        value={formData.country}
                                        onChange={e => setFormData({...formData, country: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 pl-12 font-bold outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text opacity-60 ml-2">WhatsApp (Optional)</label>
                                <input 
                                    type="tel"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest mode-aware-text opacity-60 ml-2">Optional Notes</label>
                            <textarea 
                                rows={2}
                                placeholder="Any special requests or details..."
                                value={formData.notes}
                                onChange={e => setFormData({...formData, notes: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-medium outline-none focus:border-primary transition-all"
                            />
                        </div>

                        {/* Tier Selection if applicable */}
                        {hasTiers && (
                            <div className="space-y-4 pt-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest mode-aware-text opacity-60">Select Processing Speed</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {Object.entries(totals).map(([tier, price]) => (
                                        <button
                                            key={tier}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTier(tier);
                                                setIsShaking(false);
                                            }}
                                            className={`px-6 py-3 rounded-xl border-2 transition-all font-black flex flex-col items-center gap-1 ${selectedTier === tier ? 'bg-primary border-primary text-black' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 mode-aware-text hover:border-primary/50'}`}
                                        >
                                            <span className="text-[8px] uppercase tracking-widest opacity-60">{tier}</span>
                                            <span className="text-sm">{price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Important Note inside Form */}
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3 text-left">
                            <Info className="text-amber-600 shrink-0" size={18} />
                            <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed font-medium">
                                Quick Application requires all necessary data to be submitted via WhatsApp or Email after submission.
                            </p>
                        </div>

                        {/* Action Button */}
                        <motion.div
                            animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            onAnimationComplete={() => setIsShaking(false)}
                            className="pt-2"
                        >
                            <button 
                                type="submit"
                                className="group w-full inline-flex items-center justify-center gap-4 px-12 py-5 text-black font-black rounded-2xl shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all text-xl"
                                style={{ background: 'linear-gradient(135deg, #FFB400 0%, #FFD700 100%)' }}
                            >
                                Submit Quick Application <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            {isShaking && (
                                <p className="text-rose-500 text-[10px] font-bold mt-3 flex items-center justify-center gap-2">
                                    <AlertCircle size={12} /> Please select a processing speed above.
                                </p>
                            )}
                        </motion.div>
                    </form>
                </div>
            </div>
        </section>
    );
}
