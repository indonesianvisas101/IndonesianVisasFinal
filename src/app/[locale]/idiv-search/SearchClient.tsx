"use client";

import React, { useState } from "react";
import { 
    Search, QrCode, ShieldCheck, 
    ArrowRight, Loader2, Info, 
    CheckCircle2, XCircle, FileText,
    Globe, Lock, Shield, LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IDivCardModern from "@/components/idiv/IDivCardModern";

// Parse JSON-packed address
function parseAddress(raw: string | null | undefined) {
    const fb = { street: "", birthPlaceDate: "", gender: "", occupation: "" };
    if (!raw) return fb;
    try {
        const p = JSON.parse(raw);
        return { street: p.street || "", birthPlaceDate: p.birthPlaceDate || p.dob || "", gender: p.gender || "", occupation: p.occupation || "" };
    } catch { return { ...fb, street: raw }; }
}

export default function SearchClient({ locale }: { locale: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(`/api/verification?query=${searchQuery.trim()}`);
            if (res.ok) {
                const data = await res.json();
                setResult(data);
            } else {
                setError("No record found with this ID Number. Please check and try again.");
            }
        } catch (err) {
            setError("Search failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 text-primary px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase italic"
                >
                    <Globe size={14} /> Public Verification Gateway
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter uppercase italic leading-none"
                >
                    Track Your <br /> IDiv Status
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto text-xl mode-aware-subtext font-medium"
                >
                    Enter your 10-digit IDiv number or Passport number to access your real-time verification record and digital card.
                </motion.p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-24">
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-x-0 -bottom-2 h-14 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-full" />
                    <input 
                        type="text"
                        placeholder="IV-8829-XXXX or Passport Number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-20 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-full px-10 text-xl font-bold mode-aware-text focus:outline-none focus:border-primary transition-all relative z-10"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-3 bottom-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-8 rounded-full font-black uppercase italic tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all z-20 disabled:opacity-50 shadow-xl"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        Search
                    </button>
                </form>
                
                <div className="flex justify-center gap-8 mt-8">
                     <div className="flex items-center gap-2 text-[10px] font-black mode-aware-subtext uppercase tracking-[0.2em] opacity-50">
                        <Lock size={12} /> Secure Auth
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black mode-aware-subtext uppercase tracking-[0.2em] opacity-50">
                        <ShieldCheck size={12} /> Privacy Shield
                     </div>
                </div>
            </div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24 space-y-6"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-ping" />
                            <QrCode className="absolute inset-0 m-auto text-primary animate-pulse" size={40} />
                        </div>
                        <div className="text-sm font-black mode-aware-text uppercase tracking-widest">Scanning Blockchain Nodes...</div>
                    </motion.div>
                )}

                {error && !isLoading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg mx-auto bg-red-500/10 border border-red-500/20 p-10 rounded-[3rem] text-center space-y-4"
                    >
                        <XCircle className="mx-auto text-red-500" size={48} />
                        <h3 className="text-xl font-black text-red-500">Record Not Found</h3>
                        <p className="font-medium mode-aware-subtext">
                            {error}
                        </p>
                        <button 
                            onClick={() => { setSearchQuery(""); setError(""); }}
                            className="bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest"
                        >
                            Reset Search
                        </button>
                    </motion.div>
                )}

                {result && !isLoading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid lg:grid-cols-2 gap-16 items-start"
                    >
                        {/* 3D Visual Preview */}
                        <div className="space-y-8 sticky top-32">
                             <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase italic">
                                <QrCode size={14} /> System Verified ID
                             </div>
                             {(() => {
                                 const addr = parseAddress(result.address);
                                 const isSmart = result.visaType?.toUpperCase().includes('SMART') || result.visaType?.toUpperCase().includes('KITAS') || result.visaType?.toUpperCase().includes('ITAP');
                                 const isIDG = result.visaType?.toUpperCase().includes('IDG') || result.visaType?.toUpperCase().includes('GUIDE');
                                 return (
                                     <IDivCardModern
                                         mode={isSmart ? 'SMART' : (isIDG ? 'IDG' : 'IDIV')}
                                         variant="purple"
                                         data={{
                                             id_number:        result.id,
                                             name:             result.fullName,
                                             passport_number:  result.passportNumber,
                                             nationality:      result.nationality || "VERIFIED HOLDER",
                                             visa_type:        result.visaType,
                                             expiry_date:      result.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : 'N/A',
                                             issue_date:       result.issuedDate ? new Date(result.issuedDate).toLocaleDateString() : 'N/A',
                                             address:          addr.street || result.address || "",
                                             birth_place_date: addr.birthPlaceDate,
                                             gender:           addr.gender,
                                             occupation:       addr.occupation,
                                             photoUrl:         result.photoUrl,
                                             order_id:         result.slug || result.application?.slug || "N/A"
                                         }}
                                         autoRotate={true}
                                         showDownload={false}
                                     />
                                 );
                             })()}
                             
                             <div className="p-8 bg-slate-900 dark:bg-white/10 rounded-[2.5rem] text-white space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-primary tracking-widest uppercase italic">
                                    <Shield size={14} /> Security Notice
                                </div>
                                <p className="text-sm font-medium text-white/60 leading-relaxed">
                                    This visual preview is a real-time rendering of your official record. Authorized officers can scan the Smart Code on your physical card to reach this authenticated portal.
                                </p>
                             </div>
                        </div>

                        {/* Detailed Data */}
                        <div className="space-y-8">
                            <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                                <div className="bg-primary/5 p-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                                    <h3 className="text-2xl font-black mode-aware-text tracking-tighter uppercase italic">Record Integrity</h3>
                                    <CheckCircle2 className="text-green-500" size={32} />
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        {(() => {
                                            const addr2 = parseAddress(result.address);
                                            const rows = [
                                                { label: "Full Name",     value: result.fullName, icon: Info },
                                                { label: "ID No.",        value: result.id, icon: LayoutGrid },
                                                { label: "Visa Permit",   value: result.visaType, icon: FileText },
                                                { label: "Smart ID",      value: result.slug, icon: QrCode, highlight: true },
                                                { label: "Permit Status", value: result.application?.status || result.status, icon: ShieldCheck, highlight: true },
                                                { label: "Issued Date",   value: result.issuedDate ? new Date(result.issuedDate).toLocaleDateString() : 'N/A', icon: Clock },
                                                { label: "Tempat/Tgl Lahir", value: addr2.birthPlaceDate || '—', icon: Info },
                                                { label: "Pekerjaan",     value: addr2.occupation || '—', icon: Info },
                                                { label: "Alamat",        value: addr2.street || '—', icon: Info },
                                            ];
                                            return rows;
                                        })().map((item: any, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="text-[10px] font-black mode-aware-subtext uppercase tracking-widest opacity-50 flex items-center gap-2">
                                                    {item.icon && <item.icon size={12} />}
                                                    {item.label}
                                                </div>
                                                <div className={`text-lg font-black tracking-tight ${item.highlight ? 'text-primary' : 'mode-aware-text'}`}>
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                    <h4 className="font-black mode-aware-text uppercase italic tracking-tight mb-4">Verification Explained</h4>
                                    <p className="text-xs font-medium mode-aware-subtext leading-relaxed opacity-70">
                                        The IDiv system is Indonesia's most advanced private verification layer, providing instant authenticity checks for foreigners under PT Indonesian Visas Agency sponsorship.
                                    </p>
                                    <a href={`/${locale}/verification-explained`} className="mt-4 text-[10px] font-black text-primary tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all">
                                        Learn More <ArrowRight size={14} />
                                    </a>
                                </div>
                                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                    <h4 className="font-black mode-aware-text uppercase italic tracking-tight mb-4">Official Sponsor</h4>
                                    <p className="text-xs font-medium mode-aware-subtext leading-relaxed opacity-70">
                                        All records represent verified clients of Indonesian Visas. In case of verification discrepancies, please contact our 24/7 legal team immediately.
                                    </p>
                                    <a href={`/${locale}/about`} className="mt-4 text-[10px] font-black text-primary tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all">
                                        Corporate Profile <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Minimal Icons for Display
function Clock({ size, className }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function Calendar({ size, className }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>; }
