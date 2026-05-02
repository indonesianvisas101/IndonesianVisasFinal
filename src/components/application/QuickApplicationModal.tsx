import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Zap, ShieldCheck, Globe, User, Mail, MessageSquare, Phone, Calendar, Camera, FileText, Eye, Upload, Trash2, Loader2, Info } from "lucide-react";
import { useApplication } from "./ApplicationContext";
import { calculateVisaTotal } from "@/lib/utils";
import { addWorkingDays, formatDateForInput, getDaysForTier } from "@/lib/dateUtils";
import Portal from "../common/Portal";
import { supabase } from "@/lib/supabase";

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

const GUIDE_LINKS = {
    passport: "https://thvdfcogdxmqipybqzot.supabase.co/storage/v1/object/public/quick_apply/Passport.webp",
    photo: "https://thvdfcogdxmqipybqzot.supabase.co/storage/v1/object/public/quick_apply/Recent%20Photo.webp"
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

    // File States
    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isOptimizingPassport, setIsOptimizingPassport] = useState(false);
    const [isOptimizingPhoto, setIsOptimizingPhoto] = useState(false);

    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    // Helper: Convert Image to WebP
    const convertToWebP = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject("Canvas context failed");
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (!blob) return reject("Conversion failed");
                        const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        resolve(new File([blob], webpFileName, { type: "image/webp" }));
                    }, "image/webp", 0.85);
                };
            };
            reader.onerror = (err) => reject(err);
        });
    };

    // Real-Time Pre-Processing Handlers
    const handlePassportSelection = async (file: File | null) => {
        if (!file) {
            setPassportFile(null);
            return;
        }
        setIsOptimizingPassport(true);
        try {
            const optimized = await convertToWebP(file);
            setPassportFile(optimized);
        } catch (e) {
            console.error("Passport optimization failed", e);
            setPassportFile(file); // Fallback to original if conversion fails
        } finally {
            setIsOptimizingPassport(false);
        }
    };

    const handlePhotoSelection = async (file: File | null) => {
        if (!file) {
            setPhotoFile(null);
            return;
        }
        setIsOptimizingPhoto(true);
        try {
            const optimized = await convertToWebP(file);
            setPhotoFile(optimized);
        } catch (e) {
            console.error("Photo optimization failed", e);
            setPhotoFile(file);
        } finally {
            setIsOptimizingPhoto(false);
        }
    };

    // Helper: Upload to Supabase
    const uploadFile = async (file: File, folder: string) => {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from("quick_apply")
            .upload(`${folder}/${fileName}`, file);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
            .from("quick_apply")
            .getPublicUrl(`${folder}/${fileName}`);
            
        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passportFile || !photoFile) {
            alert("Please upload mandatory documents (Passport & Photo)");
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);

        try {
            // 1. Upload Passport (Already Optimized)
            const passportUrl = await uploadFile(passportFile, "passports");
            setUploadProgress(40);

            // 2. Upload Photo (Already Optimized)
            const photoUrl = await uploadFile(photoFile, "photos");
            setUploadProgress(70);

            // 3. Process & Upload Additional
            const additionalUrls = await Promise.all(additionalFiles.map(async (file) => {
                let fileToUpload = file;
                if (file.type.startsWith("image/")) {
                    fileToUpload = await convertToWebP(file);
                }
                return await uploadFile(fileToUpload, "additional");
            }));
            setUploadProgress(90);

            // 4. Final Submission
            const submissionData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                country: formData.country,
                visaId: detectedVisa?.id || formData.visaInput,
                notes: formData.notes,
                priceTier: isManualPrice ? 'Custom' : selectedTier,
                customPrice: isManualPrice ? customPrice : undefined,
                arrivalDate: formData.arrivalDate,
                isLocked: isLocked,
                documents: {
                    passport: passportUrl,
                    photo: photoUrl,
                    additional: additionalUrls
                }
            };

            await quickApply(submissionData);

            setUploadProgress(100);
            onClose();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please check your connection and try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 60 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                >
                    {/* Header */}
                    <div className="bg-primary/5 px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-1">
                            <div>
                                <h2 className="text-2xl font-black mode-aware-text tracking-tighter">Quick Application</h2>
                                <p className="text-xs font-bold mode-aware-subtext uppercase tracking-widest opacity-60">Expedited Submission</p>
                            </div>
                            
                            <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-white/10" />
                            
                            <div className="max-w-xs">
                                <p className="text-[10px] leading-tight text-slate-500 dark:text-slate-400 font-medium">
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-amber-600 bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 rounded mr-1">Note</span>
                                    Use this form for <span className="text-primary font-bold">Express Submission</span> or if you have pre-vetted data. For full legal sponsorship, we recommend the <span className="italic font-bold text-slate-700 dark:text-slate-200">"Select Your Country"</span> flow.
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                            <X size={24} className="mode-aware-text" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
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

                        {/* File Upload Section */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Mandatory Documents</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Passport Upload */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <FileText size={12} /> Passport Main Page
                                        </label>
                                        <button type="button" onClick={() => setPreviewImage(GUIDE_LINKS.passport)} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-primary transition-colors">
                                            <Eye size={10} /> View Guide
                                        </button>
                                    </div>
                                    <div className={`relative border-2 border-dashed rounded-3xl p-4 transition-all ${passportFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-200 dark:border-white/10 hover:border-primary/50'} ${isOptimizingPassport ? 'animate-pulse' : ''}`}>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => handlePassportSelection(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            {isOptimizingPassport ? (
                                                <>
                                                    <Loader2 size={24} className="animate-spin text-primary" />
                                                    <div className="text-[10px] font-black uppercase text-primary">Optimizing...</div>
                                                </>
                                            ) : passportFile ? (
                                                <>
                                                    <ShieldCheck className="text-emerald-500" size={24} />
                                                    <div className="text-[10px] font-black truncate max-w-full px-4">{passportFile.name}</div>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={20} className="text-slate-300" />
                                                    <div className="text-[10px] font-bold text-slate-400">Click to upload Passport</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-medium italic">* Gambar harus jelas, fokus, dan landscape.</p>
                                </div>

                                {/* Photo Upload */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Camera size={12} /> Recent Photo
                                        </label>
                                        <button type="button" onClick={() => setPreviewImage(GUIDE_LINKS.photo)} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-primary transition-colors">
                                            <Eye size={10} /> View Guide
                                        </button>
                                    </div>
                                    <div className={`relative border-2 border-dashed rounded-3xl p-4 transition-all ${photoFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-200 dark:border-white/10 hover:border-primary/50'} ${isOptimizingPhoto ? 'animate-pulse' : ''}`}>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => handlePhotoSelection(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            {isOptimizingPhoto ? (
                                                <>
                                                    <Loader2 size={24} className="animate-spin text-primary" />
                                                    <div className="text-[10px] font-black uppercase text-primary">Optimizing...</div>
                                                </>
                                            ) : photoFile ? (
                                                <>
                                                    <ShieldCheck className="text-emerald-500" size={24} />
                                                    <div className="text-[10px] font-black truncate max-w-full px-4">{photoFile.name}</div>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={20} className="text-slate-300" />
                                                    <div className="text-[10px] font-bold text-slate-400">Click to upload Photo</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-medium italic">* Min 400x600px, komposisi wajah harus pas.</p>
                                </div>
                            </div>

                            {/* Additional Files */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Info size={12} /> Additional Documents
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {additionalFiles.map((file, idx) => (
                                        <div key={idx} className="relative bg-slate-50 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => setAdditionalFiles(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                            >
                                                <X size={10} />
                                            </button>
                                            {file.type === "application/pdf" ? <FileText size={20} className="text-red-400" /> : <Camera size={20} className="text-blue-400" />}
                                            <div className="text-[8px] font-black truncate w-full text-center">{file.name}</div>
                                        </div>
                                    ))}
                                    
                                    {additionalFiles.length < 7 && (
                                        <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-3 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
                                            <input 
                                                type="file"
                                                multiple
                                                accept="image/*,.pdf"
                                                onChange={e => {
                                                    const files = Array.from(e.target.files || []);
                                                    setAdditionalFiles(prev => [...prev, ...files].slice(0, 7));
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <Upload size={16} className="text-slate-300" />
                                            <div className="text-[8px] font-bold text-slate-400">Add File</div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[8px] text-slate-400 font-medium italic">* Max 7 files. PDF diutamakan (Bank Statement, Hotel, Flight).</p>
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

                        {/* CTA / Progress */}
                        <div className="space-y-4">
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-primary uppercase">
                                        <span>Uploading & Optimizing...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                type="submit"
                                disabled={isUploading}
                                className={`w-full bg-[#4B0082] text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isUploading ? (
                                    <>Processing... <Loader2 size={20} className="animate-spin" /></>
                                ) : (
                                    <>Apply Now <Send size={20} /></>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* MINI PREVIEW POPUP (LIGHTBOX) */}
                    <AnimatePresence>
                        {previewImage && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md"
                                onClick={() => setPreviewImage(null)}
                            >
                                <motion.div 
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="relative max-w-full max-h-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <img 
                                        src={previewImage} 
                                        alt="Guide Preview" 
                                        className="max-h-[60vh] md:max-h-[70vh] rounded-2xl object-contain"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setPreviewImage(null)}
                                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Official Document Guide</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </Portal>
    );
};

export default QuickApplicationModal;
