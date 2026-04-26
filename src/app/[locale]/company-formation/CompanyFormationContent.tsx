"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
    CheckCircle2, 
    ArrowRight, 
    ArrowLeft, 
    Building2, 
    Coins, 
    Users, 
    Contact2, 
    UploadCloud, 
    Search,
    Plus,
    Trash2,
    AlertTriangle,
    Info,
    CheckCircle,
    Loader2,
    X,
    FileText
} from "lucide-react";
import { toast } from "react-hot-toast";

// Types
interface KBLI {
    code: string;
    name: string;
}

interface Stakeholder {
    id: string;
    name: string;
    role: 'Shareholder' | 'Director' | 'Commissioner';
    nationality: string;
    shares?: number;
    email?: string;
}

const FORM_STEPS = [
    { title: "Identity", icon: Building2 },
    { title: "Capital", icon: Coins },
    { title: "Structure", icon: Users },
    { title: "Contact", icon: Contact2 },
    { title: "Upload", icon: UploadCloud }
];

const CompanyFormationWizard = ({ dict }: { dict: any }) => {
    const t = dict?.company_formation || {};
    
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        companyName: "",
        kbli: "",
        address: "",
        equityCapital: "10000000000",
        depositedCapital: "10000000000",
        stakeholders: [
            { id: '1', name: '', role: 'Director', nationality: 'Indonesia' }
        ] as Stakeholder[],
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        taxDetails: { npwp: "" },
        files: {
            passport: null as any,
            ktp: null as any,
            officeProof: null as any
        }
    });

    // Validation Logic
    const validateStep = () => {
        if (currentStep === 1) {
            const words = formData.companyName.trim().split(/\s+/);
            if (words.length < 3) {
                toast.error("Company Name must be at least 3 words.");
                return false;
            }
            if (formData.kbli.trim() === "") {
                toast.error("Please enter a KBLI code or category.");
                return false;
            }
        }
        if (currentStep === 2) {
            if (parseFloat(formData.equityCapital) < 10000000000) {
                toast.error("Minimum Authorized Capital for PT PMA is Rp 10 Billion.");
                return false;
            }
        }
        if (currentStep === 3) {
            const hasIndonesianDirector = formData.stakeholders.some(s => s.role === 'Director' && s.nationality === 'Indonesia');
            if (!hasIndonesianDirector) {
                toast.error("At least 1 Indonesian Director is mandatory.");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < 5) setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addStakeholder = () => {
        setFormData({
            ...formData,
            stakeholders: [...formData.stakeholders, { id: Date.now().toString(), name: '', role: 'Director', nationality: '' }]
        });
    };

    const removeStakeholder = (id: string) => {
        setFormData({
            ...formData,
            stakeholders: formData.stakeholders.filter(s => s.id !== id)
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Upload files first (Simulated or via API)
            // In a real app, you'd use formData to upload to Supabase via /api/upload
            
            const res = await fetch('/api/company-formation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Submission Error Response:", errorText);
                throw new Error("Failed to submit formation request");
            }

            const result = await res.json();
            if (result.success) {
                window.location.href = `/company-formation/success?id=${result.id}`;
            } else {
                toast.error(result.message || "Submission failed. Please check your data.");
            }
        } catch (e: any) {
            console.error("Formation Submission Error:", e);
            toast.error(e.message || "An error occurred during submission.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header / Stepper */}
            <div className="mb-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    {FORM_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > idx + 1;
                        const isActive = currentStep === idx + 1;
                        
                        return (
                            <div key={idx} className="flex flex-col items-center flex-1 min-w-[70px]">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-110' : 'bg-slate-200 dark:bg-white/5 text-slate-500'}`}>
                                    {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                                </div>
                                <span className={`text-xs mt-3 font-bold uppercase tracking-widest ${isActive ? 'text-violet-600' : 'text-slate-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-violet-600 transition-all duration-500 rounded-full"
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                </div>
            </div>

            {/* Legal Disclaimer Card */}
            {currentStep === 2 && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="relative p-8 rounded-[2rem] border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-red-500/5 backdrop-blur-xl overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 animate-pulse" />
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-tighter">PERINGATAN HUKUM: MODAL INVESTOR</h4>
                                <p className="text-lg mode-aware-text font-bold leading-relaxed">
                                    Bagi Direktur/Komisaris WNA yang mengajukan <span className="text-primary italic">KITAS Investor</span>, wajib memiliki modal saham minimal <span className="text-red-500 underline underline-offset-4">Rp 10.000.000.000</span> (Sepuluh Miliar Rupiah) PER ORANG.
                                </p>
                                <p className="text-sm mode-aware-subtext mt-3 font-medium opacity-80 italic">
                                    *Nilai ini bersifat individual dan bukan akumulasi modal perusahaan. Pelanggaran aturan ini dapat berakibat pada penolakan visa atau deportasi.
                                </p>
                            </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute -inset-10 bg-amber-500/10 blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
            )}

            {/* Form Content */}
            <div className="glass-card p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden min-h-[500px]">
                
                {/* Step 1: Identity */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black mode-aware-text tracking-tight">Company Identity</h2>
                            <p className="mode-aware-subtext font-medium text-lg">Define your business name and commercial scope.</p>
                        </div>

                        <div className="grid gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Proposed Company Name (3 words minimum)</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. PT GLOBAL VISA INDONESIA"
                                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value.toUpperCase()})}
                                />
                                <p className="text-xs font-bold text-slate-400 italic">Example: "PT [Brand] [Activity] Indonesia"</p>
                            </div>

                            <div className="space-y-3 relative">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">KBLI Codes (Business Categories)</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. 62019, Trade, Property"
                                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary transition-all outline-none"
                                    value={formData.kbli}
                                    onChange={(e) => setFormData({...formData, kbli: e.target.value})}
                                />
                                <p className="text-xs font-bold text-slate-400 italic">Enter the KBLI 5-digit code or business sector.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Commercial Sublet Address / Virtual Office</label>
                                <textarea 
                                    placeholder="Complete address in Indonesia..."
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-lg font-bold min-h-[120px] focus:border-primary transition-all outline-none"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Capital */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black mode-aware-text tracking-tight">Capital Structure</h2>
                            <p className="mode-aware-subtext font-medium text-lg">Define authorized and paid-up capital of the PT PMA.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Modal Dasar (Authorized Capital)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">Rp</span>
                                    <input 
                                        type="number"
                                        className={`w-full h-16 bg-slate-50 dark:bg-white/5 border ${parseFloat(formData.equityCapital) < 10000000000 ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-white/10'} rounded-2xl pl-14 pr-6 text-xl font-black focus:border-primary transition-all outline-none`}
                                        value={formData.equityCapital}
                                        onChange={(e) => setFormData({...formData, equityCapital: e.target.value})}
                                    />
                                </div>
                                {parseFloat(formData.equityCapital) < 10000000000 && (
                                    <p className="text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-2">
                                        <AlertTriangle size={14} /> Min. Rp 10.000.000.000 required for PT PMA
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Modal Disetor (Paid-Up Capital)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">Rp</span>
                                    <input 
                                        type="number"
                                        className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-14 pr-6 text-xl font-black focus:border-primary transition-all outline-none"
                                        value={formData.depositedCapital}
                                        onChange={(e) => setFormData({...formData, depositedCapital: e.target.value})}
                                    />
                                </div>
                                <p className="text-xs font-bold mode-aware-subtext italic">Usually 25-100% of Authorized Capital.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                            <div className="flex gap-4 items-center mb-4">
                                <Info className="text-primary" size={24} />
                                <h5 className="font-black mode-aware-text">Capital Calculation Note</h5>
                            </div>
                            <p className="text-sm mode-aware-subtext leading-relaxed font-medium">
                                Total capital will determine your <span className="text-primary font-bold">Investment Class</span>. For mid-to-high scale PT PMA, a minimum of 10 Billion IDR authorized capital is strictly required by the Ministry of Investment (BKPM).
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: Structure */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black mode-aware-text tracking-tight">Governance & Stakeholders</h2>
                                <p className="mode-aware-subtext font-medium text-lg">Define Shareholders, Directors, and Commissioners.</p>
                            </div>
                            <button 
                                onClick={addStakeholder}
                                className="bg-primary text-black p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.stakeholders.map((s, idx) => (
                                <div key={s.id} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/10 relative group hover:border-primary/30 transition-all duration-300">
                                    <div className="grid md:grid-cols-4 gap-6 items-end">
                                        <div className="space-y-3 col-span-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name (As per Passport/KTP)</label>
                                            <input 
                                                type="text"
                                                className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 font-bold outline-none focus:border-primary transition-all"
                                                value={s.name}
                                                onChange={(e) => {
                                                    const updated = [...formData.stakeholders];
                                                    updated[idx].name = e.target.value;
                                                    setFormData({...formData, stakeholders: updated});
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nationality</label>
                                            <select 
                                                className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 font-bold outline-none focus:border-primary transition-all"
                                                value={s.nationality}
                                                onChange={(e) => {
                                                    const updated = [...formData.stakeholders];
                                                    updated[idx].nationality = e.target.value;
                                                    setFormData({...formData, stakeholders: updated});
                                                }}
                                            >
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Foreigner">Foreigner</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Role</label>
                                            <select 
                                                className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 font-bold outline-none focus:border-primary transition-all"
                                                value={s.role}
                                                onChange={(e) => {
                                                    const updated = [...formData.stakeholders];
                                                    updated[idx].role = e.target.value as any;
                                                    setFormData({...formData, stakeholders: updated});
                                                }}
                                            >
                                                <option value="Director">Director</option>
                                                <option value="Commissioner">Commissioner</option>
                                                <option value="Shareholder">Shareholder Only</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.stakeholders.length > 1 && (
                                        <button 
                                            onClick={() => removeStakeholder(s.id)}
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!formData.stakeholders.some(s => s.role === 'Director' && s.nationality === 'Indonesia') && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 font-bold text-sm">
                                <AlertTriangle size={18} />
                                <span>Wait! Professional PT PMA requires at least one <b>Indonesian Director</b> (Direktur Lokal).</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Contact & Tax */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black mode-aware-text tracking-tight">Applicant Details</h2>
                            <p className="mode-aware-subtext font-medium text-lg">Main contact and tax responsibility information.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Applicant Full Name</label>
                                <input 
                                    type="text"
                                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary transition-all outline-none"
                                    value={formData.applicantName}
                                    onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Official Email (For Invoice)</label>
                                <input 
                                    type="email"
                                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary transition-all outline-none"
                                    value={formData.applicantEmail}
                                    onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Phone / WhatsApp</label>
                                <input 
                                    type="tel"
                                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary transition-all outline-none"
                                    value={formData.applicantPhone}
                                    onChange={(e) => setFormData({...formData, applicantPhone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest mode-aware-subtext">Tax ID (NIK / NPWP Penanggung Jawab)</label>
                                <input 
                                    type="text"
                                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary transition-all outline-none"
                                    value={formData.taxDetails.npwp}
                                    onChange={(e) => setFormData({...formData, taxDetails: { npwp: e.target.value }})}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Upload */}
                {currentStep === 5 && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black mode-aware-text tracking-tight">Final Step: Documentation</h2>
                            <p className="mode-aware-subtext font-medium text-lg">Securely upload your valid identification documents.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { key: 'passport', label: 'Passport (WNA)', desc: 'Main bio page' },
                                { key: 'ktp', label: 'KTP (WNI)', desc: 'Valid Indonesian ID' },
                                { key: 'officeProof', label: 'Office Proof', desc: 'Lease or Title' }
                            ].map((doc) => (
                                <div key={doc.key} className="relative group">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        id={`file-${doc.key}`}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setFormData({...formData, files: {...formData.files, [doc.key]: file}});
                                            }
                                        }}
                                    />
                                    <label 
                                        htmlFor={`file-${doc.key}`}
                                        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-300 min-h-[220px] ${formData.files[doc.key as keyof typeof formData.files] ? 'border-green-500 bg-green-500/5' : 'border-slate-200 dark:border-white/10 hover:border-primary/50 bg-slate-50 dark:bg-white/5'}`}
                                    >
                                        {formData.files[doc.key as keyof typeof formData.files] ? (
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                                                    <CheckCircle size={32} />
                                                </div>
                                                <span className="font-black text-green-600 line-clamp-1 text-sm">{formData.files[doc.key as keyof typeof formData.files].name}</span>
                                                <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Click to Replace</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <UploadCloud size={32} />
                                                </div>
                                                <span className="font-black mode-aware-text">{doc.label}</span>
                                                <span className="text-xs font-bold mode-aware-subtext mt-2 opacity-60">{doc.desc}</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
                            <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                            <div className="text-sm font-medium mode-aware-subtext leading-relaxed">
                                <p className="font-black text-blue-600 dark:text-blue-400 mb-1">Encrypted Data Storage</p>
                                Your documents are encrypted and stored in Indonesian Tier-4 Data Centers to ensure compliance with Data Protection Laws (UU PDP).
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-12 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-white/10 pt-8">
                    <button 
                        onClick={handlePrev}
                        disabled={currentStep === 1 || submitting}
                        className="flex items-center gap-3 px-8 py-4 font-black mode-aware-text rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all disabled:opacity-30 active:scale-95"
                    >
                        <ArrowLeft size={20} /> Previous
                    </button>

                    {currentStep < 5 ? (
                        <button 
                            onClick={handleNext}
                            className="flex items-center gap-3 px-10 py-5 bg-violet-600 text-white font-black rounded-2xl shadow-xl shadow-violet-600/30 hover:opacity-90 transition-all active:scale-95"
                        >
                            Continue <ArrowRight size={20} className="text-white" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`flex items-center gap-3 px-10 py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-500/30 hover:opacity-90 transition-all active:scale-95 ${submitting ? 'animate-pulse' : ''}`}
                        >
                            {submitting ? (
                                <><Loader2 size={24} className="animate-spin text-white" /> Submitting Request...</>
                            ) : (
                                <><CheckCircle size={24} className="text-white" /> Submit Final Request</>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Support section */}
            <div className="mt-12 text-center space-y-4">
                <p className="mode-aware-subtext font-bold uppercase tracking-widest text-xs">Need Priority Assistance?</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <button className="flex items-center gap-2 font-black text-primary hover:underline underline-offset-4">
                        <FileText size={18} /> View Sample Documents
                    </button>
                    <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full" />
                    <button className="flex items-center gap-2 font-black text-primary hover:underline underline-offset-4">
                        <Search size={18} /> KBLI Search Assistant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CompanyFormationContent({ dict, products = [] }: { dict: any, products?: any[] }) {
    // Helper to format currency
    const formatIDR = (val: number) => {
        return "Rp " + new Intl.NumberFormat('id-ID').format(val);
    };

    return (
        <section className="bg-slate-50 dark:bg-black/20 pb-24">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Pricing Cards */}
                {products && products.length > 0 && (
                    <div className="mb-16 mt-[-4rem] relative z-20">
                        <div className="grid md:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                                    <div className="flex items-end gap-2 mb-6 tracking-tighter">
                                        <h3 className="text-4xl md:text-5xl font-black mode-aware-text">{formatIDR(product.price)}</h3>
                                        <span className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">/ COMPLETE</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 h-16 line-clamp-3">
                                        {product.description}
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        {product.features && product.features.map((feat: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle2 size={16} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-bold mode-aware-text">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <CompanyFormationWizard dict={dict} />
            </div>
        </section>
    );
}

// Simple internal ShieldCheck icon if lucide doesn't have it
function ShieldCheck({ size, className }: { size: number, className: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
