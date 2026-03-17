"use client";

import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import { useParams } from "next/navigation";
import styles from "./StepPayment.module.css";
import Script from "next/script";
import { Chip, Divider, CircularProgress } from "@mui/material";
import { ArrowLeft, CreditCard, Landmark, Smartphone, QrCode, Settings, CheckCircle, ShoppingCart, Send, Info, RefreshCcw, AlertCircle } from "lucide-react";
import { parseCurrency } from "@/lib/utils";
// 10 Major Currencies for conversion
const CURRENCIES = [
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', icon: '🇮🇩', rate: 1 },
    { code: 'USD', name: 'US Dollar', symbol: '$', icon: '🇺🇸', rate: 16250 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: '🇦🇺', rate: 10600 },
    { code: 'EUR', name: 'Euro', symbol: '€', icon: '🇪🇺', rate: 17650 },
    { code: 'GBP', name: 'British Pound', symbol: '£', icon: '🇬🇧', rate: 20750 },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', icon: '🇸🇬', rate: 12050 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: '🇯🇵', rate: 108 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', icon: '🇨🇳', rate: 2240 },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', icon: '🇲🇾', rate: 3420 },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', icon: '🇰🇷', rate: 12.1 },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', icon: '🇹🇭', rate: 445 },
];

const StepPayment = () => {
    const { 
        setStep, country, visaType, personalInfo, completedSteps, 
        markStepComplete, resetApplication, closePanel, documents, 
        visas, numPeople, travelers, upsells, toggleUpsell, addons
    } = useApplication();
    const params = useParams();
    const locale = params?.locale || 'en';
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
    const [isConverting, setIsConverting] = useState(false);

    const handleMethodSelect = (method: string) => {
        setSelectedMethod(method);
    };

    const handleCurrencyChange = (currency: typeof CURRENCIES[0]) => {
        setIsConverting(true);
        setSelectedCurrency(currency);
        // Simulate loading for price comparison
        setTimeout(() => setIsConverting(false), 800);
    };

    // Use current application amount
    const currentVisa = visas.find(v => v.name === visaType);
    let totalAmount = 0;
    if (currentVisa) {
        let baseAmount = 0;
        let feeAmount = 0;

        try {
            if (typeof currentVisa.price === 'object' && currentVisa.price !== null) {
                baseAmount = parseCurrency(String((currentVisa.price as any)[Object.keys(currentVisa.price)[0]] || "0"));
            } else {
                baseAmount = parseCurrency(String(currentVisa.price));
            }

            if (typeof currentVisa.fee === 'object' && currentVisa.fee !== null) {
                feeAmount = parseCurrency(String((currentVisa.fee as any)[Object.keys(currentVisa.fee)[0]] || "0"));
            } else {
                feeAmount = parseCurrency(String(currentVisa.fee));
            }
        } catch {
            baseAmount = parseCurrency(String(currentVisa.price));
            feeAmount = parseCurrency(String(currentVisa.fee));
        }

        totalAmount = (baseAmount + feeAmount) * numPeople;

        const getAddonPrice = (sku: string) => {
            const addon = addons?.find(a => a.sku === sku);
            return addon ? Number(addon.price) : 0;
        };

        if (upsells.express) totalAmount += getAddonPrice('EXPRESS');
        if (upsells.insurance) totalAmount += getAddonPrice('INSURANCE');
        if (upsells.vip) totalAmount += getAddonPrice('VIP');
        if (upsells.idiv) totalAmount += getAddonPrice('IDIV') * numPeople;
    }

    const pph23Amount = Math.round(totalAmount * 0.02);
    // 3rd Party Payment Fee (4%)
    const platformFeeAmount = Math.round((totalAmount + pph23Amount) * 0.04);
    const grandTotal = totalAmount + pph23Amount + platformFeeAmount;

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
            console.log("[CHECKOUT] Creating Application & Invoice...");
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
                    customAmount: totalAmount.toString(), // Base + Upsells
                    quantity: numPeople,
                    documents: uploadedDocs,
                    upsells: upsells, 
                    adminNotes: (travelers && travelers.length > 0 
                        ? `Additional Travelers:\n${travelers.map(t => `- ${t.firstName} ${t.lastName} (Passport: ${t.passport}, DOB: ${t.dob})`).join('\n')}`
                        : "") + (Object.values(upsells).some(v => v) ? `\n\nAdd-ons Selected: ${Object.entries(upsells).filter(([k,v]) => v).map(([k,v]) => k.toUpperCase()).join(', ')}` : "")
                })
            });
 
            const appData = await appRes.json();
            if (!appRes.ok) throw new Error(appData.error || "Failed to create application");
            
            const invoiceId = appData.invoice?.id;
            const finalInvoiceAmount = appData.invoice?.amount || grandTotal; // Use verified server amount
            console.log("[CHECKOUT] Invoice Created:", invoiceId, "Amount:", finalInvoiceAmount);
 
            // 2. Trigger Payment Gateway
            if (selectedMethod === 'PayPal') {
                if (!invoiceId) {
                    console.error("[CHECKOUT] PayPal missing Invoice ID in response:", appData);
                    throw new Error("Invoice ID missing for PayPal.");
                }
                const usdRate = CURRENCIES.find(c => c.code === 'USD')?.rate || 16250;
                const grandTotalUSD = Math.ceil(finalInvoiceAmount / usdRate);
                console.log("[CHECKOUT] Redirecting to PayPal flow:", invoiceId, "USD:", grandTotalUSD);
                window.location.href = `/${locale}/payment?invoice=${invoiceId}&amount=${grandTotalUSD}&currency=USD`;
                return;
            } 
            
            if (selectedMethod === 'DOKU') {
                if (!invoiceId) throw new Error("Invoice ID missing for DOKU.");
                
                const checkoutRes = await fetch("/api/payments/doku/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        invoiceId,
                        amount: finalInvoiceAmount, 
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
                return;
            } 
            
            if (selectedMethod === 'Manual') {
                // Manual Submit - No gateway needed
                markStepComplete(4);
                setIsSuccess(true);
            } else {
                // Fallback for unidentified methods or missing invoiceId
                if (!invoiceId) {
                    throw new Error("System error: Invoice could not be generated. Please try again.");
                }
                console.warn("[CHECKOUT] Unidentified method or flow, falling back to success screen.");
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

            {(selectedMethod === 'PayPal' || selectedMethod === 'DOKU') && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex items-start gap-3">
                    <div className="mt-1"><AlertCircle size={18} className="text-amber-600" /></div>
                    <div>
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Transaction Fee Info</p>
                        <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed">
                            A <strong>2% Tax (PPh 23)</strong> and <strong>4% Platform Fee</strong> are applied to 3rd party payments ({selectedMethod}). The total in the Order Summary below is the final amount to be charged.
                        </p>
                    </div>
                </div>
            )}

            {/* Application Summary */}
            <div className={`glass-card ${styles.summaryCard}`}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className={styles.summaryTitle}>Order Summary</h4>
                    <Chip label="Step 4 of 4" size="small" color="primary" variant="outlined" />
                </div>
                
                <div className={styles.priceSummary}>
                    <div className={styles.priceRow}>
                        <span>{visaType}</span>
                        <span className="font-bold">IDR {(totalAmount / numPeople).toLocaleString()}</span>
                    </div>
                    <div className={styles.priceRow}>
                        <span>Number of People</span>
                        <span className="font-bold">x {numPeople}</span>
                    </div>

                    {/* Upsells List */}
                    {Object.entries(upsells).filter(([k,v]) => v).map(([k,v]) => (
                        <div key={k} className={styles.priceRow}>
                            <span className="text-xs text-gray-500 uppercase">{k === 'idiv' ? 'ID Indonesian Visa' : k} Add-on</span>
                            <span className="text-xs font-bold text-primary">
                               + IDR {k === 'idiv' ? ((20 * 16250) * numPeople).toLocaleString() : 
                                      k === 'express' ? (800000).toLocaleString() : 
                                      k === 'insurance' ? (500000).toLocaleString() : 
                                      (1500000).toLocaleString()}
                            </span>
                        </div>
                    ))}

                    <div className={styles.priceRow}>
                        <span>Tax (PPh 23 - 2%)</span>
                        <span className="font-bold">IDR {pph23Amount.toLocaleString()}</span>
                    </div>
                    
                    <div className={styles.priceRow}>
                        <div className="flex items-center gap-1">
                            <span>Processing Fee</span>
                            <span className="text-[8px] bg-slate-100 px-1 rounded text-gray-500 uppercase">4%</span>
                        </div>
                        <span className="font-bold">IDR {platformFeeAmount.toLocaleString()}</span>
                    </div>

                    <div className={`${styles.priceRow} ${styles.totalRow}`}>
                        <span className="text-primary font-bold">Grand Total</span>
                        <span className="text-xl font-extrabold text-[#F59E0B]">
                            IDR {grandTotal.toLocaleString()}
                        </span>
                    </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Send size={16} className="text-primary" /> Premium Add-ons (Optional)
                    </h4>
                    <div className="space-y-3">
                        <div 
                            className={`${styles.upsellItem} ${upsells.express ? styles.upsellActive : ''}`}
                            onClick={() => toggleUpsell('express')}
                        >
                            <div className="flex-grow">
                                <p className="text-sm font-bold">🚀 Express Processing</p>
                                <p className="text-[10px] text-gray-500">Legal review in 4 hours & priority queue.</p>
                            </div>
                            <span className="text-sm font-bold text-primary">
                                +IDR {(addons?.find(a => a.sku === 'EXPRESS')?.price || 800000).toLocaleString()}
                            </span>
                        </div>

                        <div 
                            className={`${styles.upsellItem} ${upsells.insurance ? styles.upsellActive : ''}`}
                            onClick={() => toggleUpsell('insurance')}
                        >
                            <div className="flex-grow">
                                <p className="text-sm font-bold">🛡️ Medical Insurance</p>
                                <p className="text-[10px] text-gray-500">Full Bali nomad health coverage (30 days).</p>
                            </div>
                            <span className="text-sm font-bold text-primary">
                                +IDR {(addons?.find(a => a.sku === 'INSURANCE')?.price || 500000).toLocaleString()}
                            </span>
                        </div>

                        <div 
                            className={`${styles.upsellItem} ${upsells.vip ? styles.upsellActive : ''}`}
                            onClick={() => toggleUpsell('vip')}
                        >
                            <div className="flex-grow">
                                <p className="text-sm font-bold">💎 VIP Airport Transfer</p>
                                <p className="text-[10px] text-gray-500">Private luxury pickup from DPS Airport.</p>
                            </div>
                            <span className="text-sm font-bold text-primary">
                                +IDR {(addons?.find(a => a.sku === 'VIP')?.price || 1500000).toLocaleString()}
                            </span>
                        </div>

                        <div 
                            className={`${styles.upsellItem} ${upsells.idiv ? styles.upsellActive : ''}`}
                            onClick={() => toggleUpsell('idiv')}
                        >
                            <div className="flex-grow">
                                <p className="text-sm font-bold">💳 IDIV Digital Processing</p>
                                <p className="text-[10px] text-gray-500">Mandatory digital verification & processing.</p>
                            </div>
                            <span className="text-sm font-bold text-primary">
                                +IDR {(addons?.find(a => a.sku === 'IDIV')?.price || 325000).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.currencySection}>
                    <div className="flex items-center gap-2 mb-3">
                        <RefreshCcw size={16} className="text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Currency Converter</span>
                    </div>
                    
                    <div className={styles.currencyGrid}>
                        {CURRENCIES.map((curr) => (
                            <button
                                key={curr.code}
                                onClick={() => handleCurrencyChange(curr)}
                                className={`${styles.currBtn} ${selectedCurrency.code === curr.code ? styles.currActive : ''}`}
                            >
                                <span className="text-lg">{curr.icon}</span>
                                <span className="text-[10px] font-bold">{curr.code}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.convertedDisplay}>
                        {isConverting ? (
                            <div className="flex items-center justify-center py-2 gap-2">
                                <CircularProgress size={16} thickness={6} />
                                <span className="text-xs text-gray-400 animate-pulse">Calculating fair rates...</span>
                            </div>
                        ) : (
                            <div className="text-center py-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter mb-1">Estimated Cost in {selectedCurrency.name}</p>
                                <p className="text-lg font-black text-primary">
                                    {selectedCurrency.symbol} {Math.ceil(grandTotal / selectedCurrency.rate).toLocaleString()}
                                </p>
                                <p className="text-[8px] text-gray-300 italic">* Estimated rate for comparison only</p>
                            </div>
                        )}
                    </div>
                </div>

                <Divider sx={{ my: 3 }} />

                <h4 className={styles.summaryTitle}>Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
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
                    {/* ... rest of personal info ... */}
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Email:</span>
                        <span className={styles.summaryValue}>{personalInfo.email || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Phone:</span>
                        <span className={styles.summaryValue}>{personalInfo.phone || "-"}</span>
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

            {/* Action Disclaimer */}
            <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-start gap-3">
                <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400 font-medium">
                    By making this payment, you agree that you have read and accepted our <span className="underline cursor-pointer">Terms & Conditions</span> and <span className="underline cursor-pointer">Refund Policy</span>.
                </p>
            </div>

            {/* Action Buttons */}
             <div className={styles.actions}>
                {selectedMethod === 'PayPal' ? (
                    <div className="w-full space-y-4">
                         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-500/30 flex items-center gap-3">
                            <Info size={18} className="text-blue-600" />
                            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Click the PayPal button below to complete your order securely.</p>
                        </div>
                        <div className="relative z-10">
                            {/* We need to ensure the application is created before PayPal buttons can work effectively if we want them here */}
                            {/* For simplicity in this complex flow, we keep the redirect but make it CLEAR */}
                            <button
                                onClick={processCheckout}
                                disabled={isSubmitting}
                                className={`cta-primary w-full justify-center gap-3 py-4 text-base`}
                            >
                                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : <><CreditCard size={20} /> Pay with PayPal / Card</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={processCheckout}
                        disabled={!selectedMethod || isSubmitting}
                        className={`cta-accent ${styles.submitBtn} w-full justify-center gap-3 py-4`}
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                {selectedMethod === 'Manual' ? <Send size={20} /> : <ShoppingCart size={20} />}
                                <span>{selectedMethod === 'Manual' ? 'Submit Application' : 'Complete Order'}</span>
                            </>
                        )}
                    </button>
                )}

                {!selectedMethod && (
                    <p className="text-sm text-center text-gray-500 mt-2">Please select a payment method to proceed.</p>
                )}
            </div>
        </div>
    );
};

export default StepPayment;
