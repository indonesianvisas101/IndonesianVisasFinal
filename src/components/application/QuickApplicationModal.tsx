"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Zap, ShieldCheck, Globe, User, Mail, MessageSquare, Phone, Calendar } from "lucide-react";
import { useApplication } from "./ApplicationContext";
import { calculateVisaTotal } from "@/lib/utils";
import { addWorkingDays, formatDateForInput, getDaysForTier } from "@/lib/dateUtils";

interface QuickApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VISA_MAPPING: Record<string, string> = {
    "b1": "B1",
    "voa": "B1",
    "c1": "C1",
    "b211a": "C1",
    "b211": "C1",
    "c2": "C2",
    "c12": "C12",
    "d1": "D1",
    "d2": "D2",
    "d12": "D12",
    "e33g": "E33G",
    "working visa": "E33G",
    "nomad": "E33G",
    "e28a": "E28A",
    "kitas": "E28A",
    "investment": "E28A"
};

const QuickApplicationModal: React.FC<QuickApplicationModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        email: "",
        phone: "",
        visaInput: "",
        notes: "",
        arrivalDate: ""
    });

    const { visas, quickApply, isLocked, visaType, personalInfo, country: contextCountry, priceTier: contextPriceTier } = useApplication();

    const [detectedVisa, setDetectedVisa] = useState<any>(null);
    const [selectedTier, setSelectedTier] = useState<string>("");
    const [isManualPrice, setIsManualPrice] = useState(false);
    const [customPrice, setCustomPrice] = useState<number>(0);
    const [hasManuallySetDate, setHasManuallySetDate] = useState(false);
    const [minArrivalDate, setMinArrivalDate] = useState("");

    // Sync from context on mount/open
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || (personalInfo.firstName ? `${personalInfo.firstName} ${personalInfo.lastName}` : ""),
                email: prev.email || personalInfo.email,
                phone: prev.phone || personalInfo.phone,
                country: prev.country || contextCountry || "",
                visaInput: isLocked && visaType ? visaType : prev.visaInput
            }));
            if (isLocked && contextPriceTier) {
                setSelectedTier(contextPriceTier);
            }
        }
    }, [isOpen, isLocked, visaType, personalInfo, contextCountry, contextPriceTier]);

    // Auto-detection logic
    useEffect(() => {
        const input = formData.visaInput.toLowerCase().trim();
        let matchedId = "";

        if (VISA_MAPPING[input]) {
            matchedId = VISA_MAPPING[input];
        } else {
            for (const key in VISA_MAPPING) {
                if (input.includes(key)) {
                    matchedId = VISA_MAPPING[key];
                    break;
                }
            }
        }

        if (matchedId) {
            const visa = visas.find(v => v.id === matchedId);
            setDetectedVisa(visa || null);
            if (visa && typeof visa.price === 'object') {
                const tier = isLocked && contextPriceTier ? contextPriceTier : Object.keys(visa.price)[0];
                setSelectedTier(tier);
            } else {
                setSelectedTier("Standard");
            }
            setIsManualPrice(false);
        } else {
            setDetectedVisa(null);
            setIsManualPrice(true);
        }
    }, [formData.visaInput, visas, isLocked, contextPriceTier]);

    // Smart Arrival Date Automation
    useEffect(() => {
        const tier = isManualPrice ? "Standard" : (selectedTier || "Standard");
        const days = getDaysForTier(tier);
        const calculatedDate = addWorkingDays(new Date(), days);
        const dateStr = formatDateForInput(calculatedDate);
        
        setMinArrivalDate(dateStr);

        if (!hasManuallySetDate || !formData.arrivalDate) {
            setFormData(prev => ({ ...prev, arrivalDate: dateStr }));
        }
    }, [selectedTier, isManualPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        quickApply({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            visaId: detectedVisa?.id || formData.visaInput,
            notes: formData.notes,
            priceTier: isManualPrice ? 'Custom' : selectedTier,
            customPrice: isManualPrice ? customPrice : undefined,
            arrivalDate: formData.arrivalDate,
            isLocked: isLocked
        });
        
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
            >
                {/* Header */}
                <div className="bg-primary/5 px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black mode-aware-text tracking-tighter">Quick Application</h2>
                        <p className="text-xs font-bold mode-aware-subtext uppercase tracking-widest opacity-60">Expedited Submission</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="mode-aware-text" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <User size={12} /> Full Name
                            </label>
                            <input 
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. John Doe"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Globe size={12} /> Citizenship
                            </label>
                            <input 
                                required
                                type="text"
                                value={formData.country}
                                onChange={e => setFormData({...formData, country: e.target.value})}
                                placeholder="e.g. United Kingdom"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Mail size={12} /> Email Address
                            </label>
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                placeholder="your@email.com"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Phone size={12} /> WhatsApp Number
                            </label>
                            <input 
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                placeholder="+1 234 567 890"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Arrival Date & Visa Input */}
                    <div className="grid md:grid-cols-2 gap-6">
                         {/* Arrival Date */}
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Calendar size={12} /> Arrival Date
                            </label>
                            <input 
                                required
                                type="date"
                                min={minArrivalDate}
                                value={formData.arrivalDate}
                                onChange={e => {
                                    setFormData({...formData, arrivalDate: e.target.value});
                                    setHasManuallySetDate(true);
                                }}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>

                        {/* Visa Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Zap size={12} /> Visa ID (B1, C1, E33G)
                            </label>
                            <div className="relative">
                                <input 
                                    required
                                    disabled={isLocked}
                                    type="text"
                                    value={formData.visaInput}
                                    onChange={e => setFormData({...formData, visaInput: e.target.value})}
                                    placeholder="e.g. B1, C1..."
                                    className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-black outline-none focus:border-primary transition-all pr-12 ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                />
                                {detectedVisa && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                        <ShieldCheck size={20} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detection Feedback & Tiers */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {detectedVisa && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                            {isLocked ? "Confirmed Selection:" : "Detected:"} {detectedVisa.name}
                                        </span>
                                        {!isLocked && (
                                            <button 
                                                type="button"
                                                onClick={() => setIsManualPrice(!isManualPrice)}
                                                className="text-[10px] font-bold text-primary underline"
                                            >
                                                {isManualPrice ? "Use Auto Price" : "Set Custom Price"}
                                            </button>
                                        )}
                                    </div>

                                    {!isManualPrice && (
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                const totals = calculateVisaTotal(detectedVisa.price, detectedVisa.fee);
                                                if (typeof totals === 'object') {
                                                    return Object.entries(totals).map(([tier, price]) => (
                                                        <button
                                                            key={tier}
                                                            type="button"
                                                            disabled={isLocked}
                                                            onClick={() => setSelectedTier(tier)}
                                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedTier === tier ? 'bg-primary text-black' : 'bg-white dark:bg-white/5 mode-aware-text'} ${isLocked && selectedTier !== tier ? 'opacity-30' : ''}`}
                                                        >
                                                            {tier} ({price})
                                                        </button>
                                                    ));
                                                } else {
                                                    return (
                                                        <div className="text-[10px] font-black text-emerald-600">
                                                            Total Price: {totals}
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    )}

                                    {isManualPrice && (
                                        <div className="pt-2">
                                            <label className="text-[8px] font-black uppercase text-gray-400 mb-1 block">Manual Price (IDR)</label>
                                            <input 
                                                type="number"
                                                value={customPrice || ""}
                                                onChange={e => setCustomPrice(parseInt(e.target.value) || 0)}
                                                placeholder="Enter agreed price..."
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-black outline-none"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {!detectedVisa && formData.visaInput.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3"
                                >
                                    <p className="text-[10px] font-bold text-amber-600">No automatic visa detected. Please enter manual price.</p>
                                    <div className="pt-2">
                                        <label className="text-[8px] font-black uppercase text-gray-400 mb-1 block">Negotiated Price (IDR)</label>
                                        <input 
                                            required
                                            type="number"
                                            value={customPrice || ""}
                                            onChange={e => setCustomPrice(parseInt(e.target.value) || 0)}
                                            placeholder="Enter amount agreed with agent..."
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-black outline-none"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <MessageSquare size={12} /> Optional Notes
                        </label>
                        <textarea 
                            rows={3}
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            placeholder="Any special requests or instructions..."
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 font-medium outline-none focus:border-primary transition-all"
                        />
                    </div>

                    {/* CTA */}
                    <button 
                        type="submit"
                        className="w-full bg-[#4B0082] text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                    >
                        Apply Now <Send size={20} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default QuickApplicationModal;
