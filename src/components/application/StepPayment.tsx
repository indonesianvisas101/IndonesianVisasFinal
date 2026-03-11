"use client";

import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepPayment.module.css";
import Script from "next/script";
import { ArrowLeft, CreditCard, Landmark, Smartphone, QrCode, Settings, CheckCircle, ShoppingCart, Send } from "lucide-react";

const StepPayment = () => {
    const { setStep, country, visaType, personalInfo, completedSteps, markStepComplete, resetApplication, closePanel, documents, visas, numPeople, travelers } = useApplication();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleMethodSelect = (method: string) => {
        setSelectedMethod(method);
    };

    const handlePayPal = () => {
        markStepComplete(4);
        window.open('https://www.paypal.com/ncp/payment/QU83M852K9A3U', '_blank');
    };

    // Use current application amount
    const currentVisa = visas.find(v => v.name === visaType);
    let totalAmount = 0;
    if (currentVisa) {
        // Quick base price parser for Midtrans (very simplified)
        let parsedPrice = 0;
        try {
            if (typeof currentVisa.price === 'number') {
                parsedPrice = currentVisa.price;
            } else if (typeof currentVisa.price === 'object') {
                parsedPrice = (currentVisa.price as any)[Object.keys(currentVisa.price)[0]] || 0;
            } else {
                const pObj = JSON.parse(currentVisa.price);
                parsedPrice = pObj[Object.keys(pObj)[0]] || 0;
            }
        } catch {
            parsedPrice = parseFloat(String(currentVisa.price).replace(/[^0-9.]/g, '')) || 0;
        }
        totalAmount = parsedPrice * numPeople;
    }

    const processCheckout = async () => {
        setIsSubmitting(true);
        try {
            // 0. Upload Documents First
            const uploadedDocs: Record<string, string> = {};

            const docsArray = Array.isArray(documents) ? documents : [documents];
            const uploadPromises: Promise<void>[] = [];

            docsArray.forEach((docSet, index) => {
                if (!docSet) return;
                
                Object.entries(docSet).forEach(([key, fileObj]) => {
                    const typedFile = fileObj as File | null;
                    if (typedFile && typedFile.size > 0) {
                        const formData = new FormData();
                        formData.append('file', typedFile);
                        formData.append('bucket', 'documents');

                        // Unique key per traveler
                        const uniqueKey = index === 0 ? key : `Traveler_${index + 1}_${key}`;

                        uploadPromises.push(
                            fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.url) {
                                    uploadedDocs[uniqueKey] = data.url;
                                }
                            })
                            .catch(e => console.error("Failed to upload file:", uniqueKey, e))
                        );
                    }
                });
            });

            await Promise.all(uploadPromises);

            // 1. Submit to API to create DB Application & Invoice
            const appRes = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visaId: currentVisa?.id || "custom",
                    visaName: visaType,
                    status: "Pending",
                    guestName: `${personalInfo.firstName} ${personalInfo.lastName}`,
                    guestEmail: personalInfo.email,
                    paymentMethod: selectedMethod,
                    customAmount: totalAmount.toString(),
                    documents: uploadedDocs, // Add the synced document urls here!
                    adminNotes: travelers && travelers.length > 0 
                        ? `Additional Travelers:\n${travelers.map(t => `- ${t.firstName} ${t.lastName} (Passport: ${t.passport}, DOB: ${t.dob})`).join('\n')}`
                        : "No additional travelers."
                })
            });

            if (!appRes.ok) throw new Error("Failed to create application");
            const appData = await appRes.json();
            const invoiceId = appData.invoice?.id;

            // Optional: Background sync to Formspree
            fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ORDER_ID || 'mqeawejv'}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    OrderType: "Visa Application",
                    VisaType: visaType,
                    TotalAmount: totalAmount,
                    Destination: country,
                    PaymentMethod: selectedMethod || 'Pending',
                    ApplicantName: `${personalInfo.firstName} ${personalInfo.lastName}`,
                    ApplicantEmail: personalInfo.email,
                    ApplicantPhone: personalInfo.phone,
                    AdditionalTravelers: travelers && travelers.length > 0 
                        ? travelers.map(t => `${t.firstName} ${t.lastName} (Passport: ${t.passport})`).join(', ')
                        : "None",
                    AttachedDocuments: Object.keys(uploadedDocs).length > 0 ? uploadedDocs : "None"
                })
            }).catch(e => console.error("Formspree sync failed", e));

            // 2. Trigger Payment Gateway
            if (selectedMethod === 'DOKU' && invoiceId) {
                const checkoutRes = await fetch("/api/payments/doku/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        invoiceId,
                        amount: totalAmount,
                        customerDetails: {
                            first_name: personalInfo.firstName,
                            last_name: personalInfo.lastName,
                            email: personalInfo.email,
                            phone: personalInfo.phone
                        }
                    })
                });

                if (!checkoutRes.ok) {
                    const errorDetail = await checkoutRes.json();
                    throw new Error(errorDetail.error || "Failed to fetch DOKU payment URL");
                }
                const { paymentUrl } = await checkoutRes.json();

                // Redirect to DOKU Checkout
                window.location.href = paymentUrl;
                
            } else if (selectedMethod === 'PayPal') {
                handlePayPal();
            } else {
                // Manual Submit
                markStepComplete(4);
                setIsSuccess(true);
            }

        } catch (error: any) {
            console.error("Payment Process Error:", error);
            alert(`Submission failed: ${error.message || "Please try again."}`);
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleCloseFinal = () => {
        resetApplication();
        closePanel();
    };

    // Environment checks for DOKU removed as they are handled server-side in /api/payments/doku/checkout

    if (isSuccess) {
        return (
            <div className={styles.container}>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Application Submitted!</h3>
                    <p className="text-gray-600 mb-8 max-w-md">
                        Thank you for submitting your application. Our team will review your documents and contact you shortly via WhatsApp or Email.
                    </p>
                    <button onClick={handleCloseFinal} className="btn btn-primary">
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={() => setStep(3)} className={styles.backBtn}>
                <ArrowLeft size={16} className="mr-2" /> Back
            </button>

            <h3 className={styles.heading}>Make a Payment</h3>

            {/* Application Summary */}
            <div className={`glass-card ${styles.summaryCard}`}>
                <h4 className={styles.summaryTitle}>Application Review</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Visa For:</span>
                        <span className={styles.summaryValue}>{country || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Full Name:</span>
                        <span className={styles.summaryValue}>
                            {personalInfo.firstName} {personalInfo.lastName}
                        </span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Date of Birth:</span>
                        <span className={styles.summaryValue}>{personalInfo.dob || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Passport No:</span>
                        <span className={styles.summaryValue}>{personalInfo.passport || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Email:</span>
                        <span className={styles.summaryValue}>{personalInfo.email || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Phone:</span>
                        <span className={styles.summaryValue}>{personalInfo.phone || "-"}</span>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className={`glass-card ${styles.paymentMethodsCard}`}>
                <h4 className={styles.summaryTitle}>Select Payment Method</h4>
                <div className={styles.methodsList}>

                    <button
                        className={`${styles.methodOption} ${selectedMethod === 'PayPal' ? styles.selected : ''}`}
                        onClick={() => handleMethodSelect('PayPal')}
                    >
                        <CreditCard size={24} className="text-primary" />
                        <div className={styles.methodInfo}>
                            <p className={styles.methodName}>PayPal / Credit Card</p>
                            <p className={styles.methodDesc}>Secure international payment</p>
                            <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-wider italic">
                                * Confirmation takes 3 days to start application
                            </p>
                        </div>
                        {selectedMethod === 'PayPal' && <CheckCircle size={20} className="text-accent ml-auto" />}
                    </button>

                    <button
                        className={`${styles.methodOption} ${selectedMethod === 'Manual' ? styles.selected : ''}`}
                        onClick={() => handleMethodSelect('Manual')}
                    >
                        <Send size={24} className="text-primary" />
                        <div className={styles.methodInfo}>
                            <p className={styles.methodName}>Submit Application Only</p>
                            <p className={styles.methodDesc}>Consult with agent first</p>
                        </div>
                        {selectedMethod === 'Manual' && <CheckCircle size={20} className="text-accent ml-auto" />}
                    </button>

                    <button
                        className={`${styles.methodOption} ${selectedMethod === 'DOKU' ? styles.selected : ''}`}
                        onClick={() => handleMethodSelect('DOKU')}
                    >
                        <ShoppingCart size={24} className="text-primary" />
                        <div className={styles.methodInfo}>
                            <p className={styles.methodName}>Order Now (DOKU)</p>
                            <p className={styles.methodDesc}>Secure Local & Intl Payment</p>
                        </div>
                        {selectedMethod === 'DOKU' && <CheckCircle size={20} className="text-accent ml-auto" />}
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <button
                    onClick={processCheckout}
                    disabled={!selectedMethod || isSubmitting}
                    className={`cta-accent ${styles.submitBtn} w-full justify-center`}
                >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                </button>

                {!selectedMethod && (
                    <p className="text-sm text-center text-gray-500 mt-2">Please select a payment method to proceed.</p>
                )}
            </div>
        </div>
    );
};

export default StepPayment;
