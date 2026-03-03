"use client";

import React, { useRef, useState } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepDocuments.module.css";
import { ArrowLeft, UploadCloud, FileText, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const StepDocuments = () => {
    const { setStep, markStepComplete, documents, updateData } = useApplication();
    const [passportUploaded, setPassportUploaded] = useState(!!documents.passportPhoto);
    const [error, setError] = useState("");

    const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            updateData("documents", {
                ...documents,
                [type]: file
            });

            if (type === 'passportPhoto') {
                setPassportUploaded(true);
                setError("");
            }
        }
    };

    const handleContinue = () => {
        if (!documents.passportPhoto) {
            setError("Passport Photo Page is strictly required.");
            return;
        }
        markStepComplete(3);
        setStep(4);
    };

    return (
        <div className={styles.container}>
            <button onClick={() => setStep(2)} className={styles.backBtn}>
                <ArrowLeft size={16} className="mr-2" /> Back
            </button>

            <h3 className={styles.heading}>Step 3: Document Upload</h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm font-medium">
                    <AlertCircle size={18} className="mr-2 text-red-600" />
                    {error}
                </div>
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
                            {documents.passportPhoto ? documents.passportPhoto.name : "Click to upload"}
                        </span>
                        <input
                            type="file"
                            className={styles.fileInput}
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileChange('passportPhoto', e)}
                        />
                    </div>
                </div>

                {/* Photo - Optional/Skippable */}
                <div className={`glass-card ${styles.uploadCard}`}>
                    <label className={styles.label}>Recent Photo (White Background)</label>
                    <div className={styles.dropZone}>
                        <UploadCloud size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 mb-2">
                            {documents.recentPhoto ? documents.recentPhoto.name : "Click to upload (Optional)"}
                        </span>
                        <input
                            type="file"
                            className={styles.fileInput}
                            accept="image/*"
                            onChange={(e) => handleFileChange('recentPhoto', e)}
                        />
                    </div>
                </div>

                {/* Accommodation - Optional/Skippable */}
                <div className={`glass-card ${styles.uploadCard}`}>
                    <label className={styles.label}>Proof of Accommodation</label>
                    <div className={styles.dropZone}>
                        <FileText size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 mb-2">
                            {documents.proofOfAccommodation ? documents.proofOfAccommodation.name : "Click to upload (Optional)"}
                        </span>
                        <input
                            type="file"
                            className={styles.fileInput}
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileChange('proofOfAccommodation', e)}
                        />
                    </div>
                </div>
            </div>

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
