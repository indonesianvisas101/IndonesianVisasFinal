"use client";

import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepDocuments.module.css";
import { ArrowLeft, UploadCloud, FileText, CheckCircle, AlertCircle, ArrowRight, RefreshCcw, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "../common/Portal";

const GUIDE_LINKS = {
    passport: "https://thvdfcogdxmqipybqzot.supabase.co/storage/v1/object/public/quick_apply/Passport.webp",
    photo: "https://thvdfcogdxmqipybqzot.supabase.co/storage/v1/object/public/quick_apply/Recent%20Photo.webp"
};

const StepDocuments = () => {
    const { setStep, markStepComplete, documents, updateData, numPeople, updateTravelerDocument } = useApplication();
    const [processing, setProcessing] = useState<Record<string, boolean>>({});
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleFileChange = (index: number, type: 'passportPhoto'|'recentPhoto'|'proofOfAccommodation', e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const key = `${index}-${type}`;
            
            setProcessing(prev => ({ ...prev, [key]: true }));
            setError("");

            // Simulate the smart processing delay for UI feedback
            setTimeout(() => {
                updateTravelerDocument(index, type, file);
                setProcessing(prev => ({ ...prev, [key]: false }));
            }, 1200);
        }
    };

    const handleContinue = () => {
        // Validate all travelers have a passport
        const docsArray = Array.isArray(documents) ? documents : [documents];
        for (let i = 0; i < numPeople; i++) {
            if (!docsArray[i] || !docsArray[i].passportPhoto) {
                setError(`Passport Photo Page is strictly required for Traveler ${i + 1}.`);
                return;
            }
        }

        markStepComplete(3);
        setStep(4);
    };

    const docsArray = Array.isArray(documents) ? documents : [documents];

    return (
        <div className={styles.container}>
            <button onClick={() => setStep(2)} className={styles.backBtn}>
                <ArrowLeft size={16} className="mr-2" /> Back
            </button>

            <div className="flex justify-between items-end mb-6">
                <h3 className={styles.heading}>Step 3: Document Upload</h3>
                {numPeople > 1 && (
                    <div className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        {docsArray.filter(d => d?.passportPhoto).length} / {numPeople} Passports Uploaded
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm font-medium mb-6">
                    <AlertCircle size={18} className="mr-2 text-red-600" />
                    {error}
                </div>
            )}

            {Array.from({ length: numPeople }).map((_, i) => {
                const doc = docsArray[i] || {};
                const passportUploaded = !!doc.passportPhoto;

                return (
                    <div key={i} className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0 last:mb-0">
                        {numPeople > 1 && (
                            <h4 className="font-bold text-lg mb-4 text-primary">
                                {i === 0 ? "Traveler 1 (Primary Contact)" : `Traveler ${i + 1}`} Documents
                            </h4>
                        )}

                        <div className={styles.uploadGroup}>
                            {/* Passport - REQUIRED */}
                            <div className={`glass-card ${styles.uploadCard} ${passportUploaded ? styles.uploaded : ''}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center justify-between w-full">
                                        <label className={styles.label}>Passport Photo Page <span className="text-red-500">*Required</span></label>
                                        <button 
                                            type="button" 
                                            onClick={() => setPreviewImage(GUIDE_LINKS.passport)}
                                            className="p-1.5 bg-primary/5 text-primary rounded-full hover:bg-primary/20 transition-all flex items-center gap-1"
                                        >
                                            <Eye size={12} /> <span className="text-[10px] font-black uppercase">Guide</span>
                                        </button>
                                    </div>
                                    {passportUploaded && <CheckCircle size={18} className="text-green-500" />}
                                </div>
                                <div className={styles.dropZone}>
                                    {processing[`${i}-passportPhoto`] ? (
                                        <div className="flex flex-col items-center animate-pulse">
                                            <RefreshCcw size={32} className="text-amber-500 animate-spin mb-2" />
                                            <span className="text-xs font-bold text-amber-600 uppercase tracking-tighter">Smart Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} className={`${passportUploaded ? 'text-green-500' : 'text-primary'} mb-2`} />
                                            <span className={`text-sm mb-2 font-medium ${passportUploaded ? 'text-green-600' : 'text-gray-500'}`}>
                                                {doc.passportPhoto ? doc.passportPhoto.name : "Click to upload Passport Photo Page"}
                                            </span>
                                            {passportUploaded && (
                                                <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                    Optimized for WebP
                                                </span>
                                            )}
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className={styles.fileInput}
                                        accept="image/*,application/pdf"
                                        disabled={processing[`${i}-passportPhoto`]}
                                        onChange={(e) => handleFileChange(i, 'passportPhoto', e)}
                                    />
                                </div>
                            </div>

                            {/* Photo - Optional/Skippable */}
                            <div className={`glass-card ${styles.uploadCard}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center justify-between w-full">
                                        <label className={styles.label}>Recent Photo (White Background)</label>
                                        <button 
                                            type="button" 
                                            onClick={() => setPreviewImage(GUIDE_LINKS.photo)}
                                            className="p-1.5 bg-primary/5 text-primary rounded-full hover:bg-primary/20 transition-all flex items-center gap-1"
                                        >
                                            <Eye size={12} /> <span className="text-[10px] font-black uppercase">Guide</span>
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.dropZone}>
                                    <UploadCloud size={32} className="text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500 mb-2">
                                        {doc.recentPhoto ? doc.recentPhoto.name : "Click to upload (Optional)"}
                                    </span>
                                    <input
                                        type="file"
                                        className={styles.fileInput}
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(i, 'recentPhoto', e)}
                                    />
                                </div>
                            </div>

                            {/* Accommodation - Multi-file Support */}
                            {i === 0 && (() => {
                                const additionalFiles = Array.isArray(doc.proofOfAccommodation) 
                                    ? doc.proofOfAccommodation 
                                    : (doc.proofOfAccommodation ? [doc.proofOfAccommodation] : []);
                                
                                return (
                                    <div className={`glass-card ${styles.uploadCard} space-y-3`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={16} className="text-primary" />
                                            <label className={styles.label}>Ticket, Bank Statement & Proof of Accommodation</label>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {additionalFiles.map((file, idx) => (
                                                <div key={idx} className="relative bg-slate-50 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newFiles = additionalFiles.filter((_, fi) => fi !== idx);
                                                            updateTravelerDocument(i, 'proofOfAccommodation', newFiles.length > 0 ? newFiles as any : null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                    {file.type === "application/pdf" ? <FileText size={20} className="text-red-400" /> : <UploadCloud size={20} className="text-blue-400" />}
                                                    <div className="text-[10px] font-black truncate w-full text-center">{file.name}</div>
                                                </div>
                                            ))}
                                            
                                            {additionalFiles.length < 7 && (
                                                <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-3 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/50 dark:bg-black/20 min-h-[80px]">
                                                    <input 
                                                        type="file"
                                                        multiple
                                                        accept="image/*,application/pdf"
                                                        onChange={(e) => {
                                                            if (e.target.files) {
                                                                const newFiles = Array.from(e.target.files);
                                                                const combined = [...additionalFiles, ...newFiles].slice(0, 7);
                                                                updateTravelerDocument(i, 'proofOfAccommodation', combined as any);
                                                            }
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                    <UploadCloud size={16} className="text-slate-300" />
                                                    <div className="text-[10px] font-bold text-slate-400">Add File</div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium italic mt-2">* Max 7 files. PDF diutamakan (Bank Statement, Hotel, Flight).</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                );
            })}

            <div className={styles.checkboxWrapper}>
                <input type="checkbox" id="terms" className={styles.checkbox} defaultChecked />
                <label htmlFor="terms" className={styles.termsLabel}>
                    I agree to the <a href="#" className="underline text-primary">Privacy Policy</a> & <a href="#" className="underline text-primary">Terms</a>.
                </label>
            </div>

            <div className={styles.btnRow}>
                <button
                    type="button"
                    onClick={handleContinue}
                    className={`cta-accent ${styles.continueBtn} w-full justify-center`}
                >
                    Continue to Payment <ArrowRight size={18} className="ml-2" />
                </button>
            </div>

            {/* MINI PREVIEW POPUP (LIGHTBOX) */}
            <AnimatePresence>
                {previewImage && (
                    <Portal>
                        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0"
                                onClick={() => setPreviewImage(null)}
                            />
                            <motion.div 
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl p-2 border border-white/10"
                                onClick={e => e.stopPropagation()}
                            >
                                <img 
                                    src={previewImage} 
                                    alt="Guide Preview" 
                                    className="w-full h-auto max-h-[70vh] rounded-2xl object-contain"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setPreviewImage(null)}
                                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="p-6 text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Official Indonesian Visas Document Guide</p>
                                    <p className="text-sm font-bold mode-aware-text mt-2">Pastikan foto terlihat jelas, tidak terpotong, dan pencahayaan baik.</p>
                                </div>
                            </motion.div>
                        </div>
                    </Portal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StepDocuments;
