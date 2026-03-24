"use client";

import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepDocuments.module.css";
import { ArrowLeft, UploadCloud, FileText, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const StepDocuments = () => {
    const { setStep, markStepComplete, documents, updateData, numPeople, updateTravelerDocument } = useApplication();
    const [error, setError] = useState("");

    const handleFileChange = (index: number, type: 'passportPhoto'|'recentPhoto'|'proofOfAccommodation', e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            updateTravelerDocument(index, type, file);
            setError("");
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

            <h3 className={styles.heading}>Step 3: Document Upload</h3>

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
                                    <label className={styles.label}>Passport Photo Page <span className="text-red-500">*Required</span></label>
                                    {passportUploaded && <CheckCircle size={18} className="text-green-500" />}
                                </div>
                                <div className={styles.dropZone}>
                                    <UploadCloud size={32} className={`${passportUploaded ? 'text-green-500' : 'text-gray-400'} mb-2`} />
                                    <span className="text-sm text-gray-500 mb-2">
                                        {doc.passportPhoto ? doc.passportPhoto.name : "Click to upload"}
                                    </span>
                                    <input
                                        type="file"
                                        className={styles.fileInput}
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileChange(i, 'passportPhoto', e)}
                                    />
                                </div>
                            </div>

                            {/* Photo - Optional/Skippable */}
                            <div className={`glass-card ${styles.uploadCard}`}>
                                <label className={styles.label}>Recent Photo (White Background)</label>
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

                            {/* Accommodation - Shared across travelers usually, but attach to Primary for now or separate? Let's just put it for Traveler 1 if it makes sense, or everyone. Actually, let's keep it for Traveler 1 only to avoid spam. */}
                            {i === 0 && (
                                <div className={`glass-card ${styles.uploadCard}`}>
                                    <label className={styles.label}>Bank Statement & Proof of Accommodation</label>
                                    <div className={styles.dropZone}>
                                        <FileText size={32} className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500 mb-2">
                                            {doc.proofOfAccommodation ? doc.proofOfAccommodation.name : "Click to upload (Optional)"}
                                        </span>
                                        <input
                                            type="file"
                                            className={styles.fileInput}
                                            accept="image/*,application/pdf"
                                            onChange={(e) => handleFileChange(i, 'proofOfAccommodation', e)}
                                        />
                                    </div>
                                </div>
                            )}
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
        </div>
    );
};

export default StepDocuments;
