"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send, User, Mail, Phone, Globe, Calendar, FileText } from "lucide-react";
import styles from "../contact/ContactModal.module.css";

interface VisaInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    visaName: string;
}

const VisaInquiryModal = ({ isOpen, onClose, visaName }: VisaInquiryModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        country: "",
        arrivalDate: "",
        passport: null as File | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Hydration check for Portal
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("whatsapp", formData.whatsapp);
        data.append("country", formData.country);
        data.append("arrival_date", formData.arrivalDate);
        data.append("subject", `Inquiry for ${visaName}`);
        if (formData.passport) {
            data.append("passport", formData.passport);
        }

        try {
            const response = await fetch("https://formspree.io/f/xykprlbk", {
                method: "POST",
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", whatsapp: "", country: "", arrivalDate: "", passport: null });
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Error submitting form. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className={styles.overlay} style={{ zIndex: 9999 }}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className={styles.header}>
                            <h3 className={styles.title}>Request Information</h3>
                            <p className={styles.subtitle}>{visaName}</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <User className={styles.icon} size={18} />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <Mail className={styles.icon} size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <Phone className={styles.icon} size={18} />
                                <input
                                    type="text"
                                    placeholder="WhatsApp Number"
                                    className={styles.input}
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <Globe className={styles.icon} size={18} />
                                <input
                                    type="text"
                                    placeholder="Country of Citizenship"
                                    className={styles.input}
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <Calendar className={styles.icon} size={18} />
                                <input
                                    type="date"
                                    placeholder="Arrival Date"
                                    className={styles.input}
                                    value={formData.arrivalDate}
                                    onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <FileText className={styles.icon} size={18} />
                                <div className="flex flex-col w-full">
                                    <label className="text-xs text-gray-500 mb-1 ml-1">Upload Passport (Optional)</label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setFormData({ ...formData, passport: e.target.files ? e.target.files[0] : null })}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${styles.submitBtn}`}>
                                {isSubmitting ? "Sending..." : "Submit Inquiry"}
                                {!isSubmitting && <Send size={18} className="ml-2" />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={styles.successView}>
                        <div className={styles.successIcon}>✓</div>
                        <h3 className={styles.title}>Request Sent!</h3>
                        <p className={styles.subtitle}>We will review your information and contact you shortly.</p>
                        <button onClick={onClose} className="btn btn-primary mt-4">Close</button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default VisaInquiryModal;
