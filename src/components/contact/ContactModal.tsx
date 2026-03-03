"use client";

import React, { useState } from "react";
import { X, MessageCircle, Send, User, Mail, Phone, FileText } from "lucide-react";
import styles from "./ContactModal.module.css";
import { COMPANY_EMAILS } from "@/constants/contact";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://formspree.io/f/xbdlnjka", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", whatsapp: "", notes: "" });
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppRedirect = () => {
        window.open("https://wa.me/6285727041992", "_blank");
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X size={24} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className={styles.header}>
                            <h3 className={styles.title}>Contact Us</h3>
                            <p className={styles.subtitle}>Get in touch with our visa specialists.</p>
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
                                    aria-label="Your Name"
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
                                    aria-label="Email Address"
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
                                    aria-label="WhatsApp Number"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <FileText className={styles.icon} size={18} />
                                <textarea
                                    placeholder="Notes / Questions"
                                    className={`${styles.input} ${styles.textarea}`}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    aria-label="Notes or Questions"
                                />
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${styles.submitBtn}`}>
                                {isSubmitting ? "Sending..." : "Submit Inquiry"}
                                {!isSubmitting && <Send size={18} className="ml-2" />}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>OR</span>
                        </div>

                        <button onClick={handleWhatsAppRedirect} className={styles.whatsappBtn}>
                            <MessageCircle size={20} className="mr-2" />
                            Chat on WhatsApp
                        </button>

                        <button
                            onClick={() => window.location.href = `mailto:${COMPANY_EMAILS.public.contact}`}
                            className={`${styles.whatsappBtn}`}
                            style={{ marginTop: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626' }}
                        >
                            <Mail size={20} className="mr-2" />
                            Email: {COMPANY_EMAILS.public.contact}
                        </button>
                    </>
                ) : (
                    <div className={styles.successView}>
                        <div className={styles.successIcon}>✓</div>
                        <h3 className={styles.title}>Message Sent!</h3>
                        <p className={styles.subtitle}>We will get back to you shortly.</p>
                        <button onClick={onClose} className="btn btn-primary mt-4">Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactModal;
