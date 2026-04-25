"use client";

import React, { useState, useEffect } from "react";
import { useApplication } from "./ApplicationContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./StepPayment.module.css";
import Script from "next/script";
import { Chip, Divider, CircularProgress, Alert, Box, Typography, Button } from "@mui/material";
import { ArrowLeft, CreditCard, Landmark, Smartphone, QrCode, Settings, CheckCircle, ShoppingCart, Send, Info, RefreshCcw, AlertCircle, Zap, ShieldCheck, ExternalLink } from "lucide-react";
import { parseCurrency } from "@/lib/utils";
import PayPalIntegration from "@/components/payment/PayPalIntegration";
import { COUNTRY_DATA } from "@/constants/countries";
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
        visaType, country, personalInfo, setStep, documents, markStepComplete, resetApplication, closePanel,
        visas, numPeople, travelers, upsells, toggleUpsell, addons,
        priceTier, arrivalDate, updateData, customPrice
    } = useApplication();
    const params = useParams();
    const locale = params?.locale || 'en';
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
    const [isConverting, setIsConverting] = useState(false);

    // Inline PayPal State
    const [showPayPalButtons, setShowPayPalButtons] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<{ invoiceId: string, amount: number, currency: string } | null>(null);

    // Identify Special Country for Calling Visa Flow
    const isSpecialCountry = React.useMemo(() => {
        const cData = COUNTRY_DATA.find(c => c.name === country);
        return cData?.isSpecial || cData?.isUnregistered || false;
    }, [country]);

    const handleMethodSelect = (method: string) => {
        setSelectedMethod(method);
        setShowPayPalButtons(false);
    };

    const handleCurrencyChange = (currency: typeof CURRENCIES[0]) => {
        setIsConverting(true);
        setSelectedCurrency(currency);
        // Simulate loading for price comparison
        setTimeout(() => setIsConverting(false), 800);
    };

    // Use current application amount
    const currentVisa = visas.find(v => v.name === visaType);
    let visaTotal = 0;
    let addonsTotal = 0;

    if (currentVisa) {
        let baseAmount = 0;
        let feeAmount = 0;

        try {
            if (typeof currentVisa.price === 'object' && currentVisa.price !== null) {
                // Prioritize priceTier from context, fallback to first key
                const tier = priceTier || Object.keys(currentVisa.price)[0];
                baseAmount = parseCurrency(String((currentVisa.price as any)[tier] || "0"));

                // Also sync fee if it's tier-based
                if (typeof currentVisa.fee === 'object' && currentVisa.fee !== null) {
                    feeAmount = parseCurrency(String((currentVisa.fee as any)[tier] || "0"));
                } else {
                    feeAmount = parseCurrency(String(currentVisa.fee));
                }
            } else {
                baseAmount = parseCurrency(String(currentVisa.price));
                feeAmount = parseCurrency(String(currentVisa.fee));
            }
        } catch (e) {
            console.error("[StepPayment] Price calculation error:", e);
            baseAmount = parseCurrency(String(currentVisa.price));
            feeAmount = parseCurrency(String(currentVisa.fee));
        }

        if (priceTier === 'Custom') {
            visaTotal = (customPrice || 0) * numPeople;
        } else {
            visaTotal = (baseAmount + feeAmount) * numPeople;
        }

        const getAddonPrice = (sku: string) => {
            const addon = addons?.find(a => a.sku === sku);
            return addon ? Number(addon.price) : 0;
        };

        if (upsells.express) addonsTotal += getAddonPrice('EXPRESS');
        if (upsells.insurance) addonsTotal += getAddonPrice('INSURANCE');
        if (upsells.vip) addonsTotal += getAddonPrice('VIP');
        if (upsells.idiv) addonsTotal += getAddonPrice('IDIV') * numPeople;
        if (upsells.idg) addonsTotal += getAddonPrice('IDG') * numPeople;
        if (upsells.smartId) addonsTotal += getAddonPrice('SMART_ID') || 1000000 * numPeople;
    }

    const totalAmount = visaTotal + addonsTotal; // Backward-compatible aggregate for processCheckout array division

    // Tax (PPh 23) calculated ONLY on Visa total
    const pph23Amount = Math.round(visaTotal * 0.02);
    // Platform Fee = 4% on everything including tax?
    const platformFeeAmount = Math.round((visaTotal + addonsTotal + pph23Amount) * 0.04);
    const grandTotal = visaTotal + addonsTotal + pph23Amount + platformFeeAmount;

    const processCheckout = async () => {
        setIsSubmitting(true);
        try {
            // 0. Upload Documents First - Map them by traveler index
            const travelerDocs: Record<number, Record<string, string>> = {};
            const docsArray = Array.isArray(documents) ? documents : [documents];
            const uploadPromises: Promise<void>[] = [];

            docsArray.forEach((docSet, index) => {
                if (!docSet) return;
                travelerDocs[index] = {};

                Object.entries(docSet).forEach(([key, fileObj]) => {
                    const typedFile = fileObj as File | null;
                    if (typedFile && typedFile.size > 0) {
                        const formData = new FormData();
                        formData.append('file', typedFile);
                        formData.append('bucket', 'documents');

                        uploadPromises.push(
                            fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.url) {
                                        travelerDocs[index][key] = data.url;
                                    }
                                })
                                .catch(e => console.error(`Failed to upload file for traveler ${index + 1}:`, key, e))
                        );
                    }
                });
            });

            await Promise.all(uploadPromises);

            // 1. Calculate Split Amounts
            const perPersonVisaAmount = visaTotal / numPeople;
            const perPersonAddonsAmount = addonsTotal / numPeople;
            const perPersonBaseAmount = totalAmount / numPeople; // Backward-compatible aggregate
            const applications = [];

            // 2. Aggregate Applications for each traveler
            console.log(`[CHECKOUT] Preparing ${numPeople} applications for consolidated submission...`);

            for (let i = 0; i < numPeople; i++) {
                const isPrimary = i === 0;
                const travelerData = isPrimary ? null : travelers[i - 1];

                const name = isPrimary
                    ? `${personalInfo.firstName} ${personalInfo.lastName}`
                    : `${travelerData?.firstName} ${travelerData?.lastName}`;

                const email = isPrimary ? (personalInfo.email || "") : (travelerData?.email || "");

                applications.push({
                    visaId: currentVisa?.id || "custom",
                    visaName: visaType,
                    status: "Apply to Agent",
                    guestName: name,
                    guestEmail: email,
                    paymentMethod: selectedMethod || 'Manual',
                    customAmount: perPersonBaseAmount.toFixed(0),
                    visaAmount: perPersonVisaAmount.toFixed(0), // Decoupled Visa weight
                    addonsAmount: perPersonAddonsAmount.toFixed(0), // Decoupled Addons weight
                    quantity: 1,
                    documents: travelerDocs[i] || {},
                    upsells: upsells,
                    attribution: {
                        country: country || "Unknown",
                        priceTier: priceTier || "Standard",
                        arrivalDate: arrivalDate || "Not specified",
                        phone: isPrimary ? personalInfo.phone : "See Primary",
                        dob: isPrimary ? personalInfo.dob : travelerData?.dob,
                        isSplitOrder: numPeople > 1,
                        orderIndex: i + 1,
                        totalTravelers: numPeople
                    },
                    adminNotes: (priceTier === 'Custom' ? `[NEGOTIATED RATE: ${perPersonVisaAmount}] ` : "") +
                               (isPrimary && numPeople > 1 
                                 ? `Primary Payer of Split Order (${numPeople} Travelers total)`
                                 : `Split Order Traveler #${i + 1}`)
                });
            }

            // 3. Consolidated API Call
            const checkoutRes = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applications })
            });

            const checkoutData = await checkoutRes.json();
            if (!checkoutRes.ok) throw new Error(checkoutData.error || "Failed to process checkout");

            const results = checkoutData.results || [checkoutData];
            if (!results || results.length === 0) throw new Error("No invoices generated.");

            // 4. Trigger Payment Gateway for the FIRST invoice
            const primaryResult = results[0];
            const invoiceId = primaryResult.invoice.id;
            const finalInvoiceAmount = primaryResult.invoice.amount;

            if (selectedMethod === 'PayPal') {
                const usdRate = CURRENCIES.find(c => c.code === 'USD')?.rate || 16250;
                const grandTotalUSD = Math.ceil(finalInvoiceAmount / usdRate);
                console.log("[CHECKOUT] Starting Inline PayPal for Primary Invoice:", invoiceId);

                // Store payment info for inline rendering
                setPaymentInfo({
                    invoiceId: invoiceId,
                    amount: grandTotalUSD,
                    currency: 'USD'
                });
                setShowPayPalButtons(true);
                return;
            }

            if (selectedMethod === 'DOKU') {
                const dokuRes = await fetch("/api/payments/doku/checkout", {
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

                if (!dokuRes.ok) {
                    const errorDetail = await dokuRes.json();
                    throw new Error(errorDetail.error || "Failed to fetch DOKU payment URL");
                }
                const { paymentUrl } = await dokuRes.json();
                window.location.href = paymentUrl;
                return;
            }

            if (selectedMethod === 'DOKU_CALLING_VISA') {
                console.log("[CHECKOUT] Redirecting to Calling Visa P-Link...");
                // Note: We still created the invoice in our DB via Step 3 above
                window.location.href = `https://pay.doku.com/p-link/p/CallingVIsa`;
                return;
            }

            if (selectedMethod === 'Manual' || !selectedMethod) {
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

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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

            <h3 className={styles.heading}>Fast Checkout</h3>

            {isSpecialCountry && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-4 animate-fade-in shadow-sm">
                    <Zap size={20} className="text-amber-600 mt-1 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Special Processing Required</p>
                        <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-500 mt-0.5">
                            Because you are from <strong>{country}</strong>, your application requires specialized manual clearing. Please use the <strong>recommended</strong> payment method below to prioritize your submission.
                        </p>
                    </div>
                </div>
            )}

            {/* 1. PREMIUM ADD-ONS */}
            <div className="mt-4 mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-primary" /> Premium Add-ons (Optional)
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
                            <p className="text-[10px] text-gray-500">Official verified sponsor ID & digital card.</p>
                        </div>
                        <span className="text-sm font-bold text-primary">
                            +IDR {(addons?.find(a => a.sku === 'IDIV')?.price || 325000).toLocaleString()}
                        </span>
                    </div>

                    <div
                        className={`${styles.upsellItem} ${upsells.idg ? styles.upsellActive : ''}`}
                        onClick={() => toggleUpsell('idg')}
                    >
                        <div className="flex-grow">
                            <p className="text-sm font-bold">💜 Indonesian ID Guide (IDg)</p>
                            <p className="text-[10px] text-gray-500">24/7 Digital companion & expert guidance.</p>
                        </div>
                        <span className="text-sm font-bold text-primary">
                            +IDR {(addons?.find(a => a.sku === 'IDG')?.price || 162500).toLocaleString()}
                        </span>
                    </div>

                    <div
                        className={`${styles.upsellItem} ${upsells.smartId ? styles.upsellActive : ''}`}
                        onClick={() => toggleUpsell('smartId')}
                    >
                        <div className="flex-grow">
                            <p className="text-sm font-bold">✨ Smart ID Premium (KTP-Style)</p>
                            <p className="text-[10px] text-gray-500">NFC-ready KTP equivalent for ITAP/GCI holders.</p>
                        </div>
                        <span className="text-sm font-bold text-primary">
                            +IDR {(addons?.find(a => a.sku === 'SMART_ID')?.price || 1000000).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* NEW: Custom Price Input (Visible only if Custom tier selected) */}
            {priceTier === 'Custom' && (
                <div className={`glass-card p-6 mb-6 border-primary/20 bg-primary/5 animate-fade-in`}>
                    <h4 className="text-sm font-black text-primary mb-4 flex items-center gap-2">
                        <Zap size={16} /> Enter Negotiated Price
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-black text-gray-400 mb-2 block">Agreed Price Per Person (IDR)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">IDR</div>
                                <input 
                                    type="number"
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-primary/20 rounded-2xl py-4 pl-14 pr-4 font-black text-xl text-primary outline-none focus:border-primary transition-all"
                                    placeholder="Enter amount..."
                                    value={customPrice || ""}
                                    onChange={(e) => updateData("customPrice", parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium">This price was agreed upon via WhatsApp or Support agent.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. PERSONAL INFORMATION */}
            <div className={`glass-card p-4 mb-6 border-slate-100 dark:border-white/5`}>
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary" /> Personal Information
                </h4>
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

            {/* 3. ORDER SUMMARY */}
            <div className={`glass-card ${styles.summaryCard} mb-6`}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className={styles.summaryTitle}>Order Summary</h4>
                    <Chip label="Final Step" size="small" color="primary" variant="outlined" />
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
                    {Object.entries(upsells).filter(([k, v]) => v).map(([k, v]) => (
                        <div key={k} className={styles.priceRow}>
                            <span className="text-xs text-gray-500 uppercase">{k === 'idiv' ? 'ID Indonesian Visa' : k === 'idg' ? 'Indonesian ID Guide' : k === 'smartId' ? 'Smart ID Premium' : k} Add-on</span>
                            <span className="text-xs font-bold text-primary">
                                + IDR {k === 'idiv' ? (parseCurrency(addons?.find(a => a.sku === 'IDIV')?.price || "325000") * numPeople).toLocaleString() :
                                    k === 'idg' ? (parseCurrency(addons?.find(a => a.sku === 'IDG')?.price || "162500") * numPeople).toLocaleString() :
                                        k === 'smartId' ? (parseCurrency(addons?.find(a => a.sku === 'SMART_ID')?.price || "1000000") * numPeople).toLocaleString() :
                                            k === 'express' ? parseCurrency(addons?.find(a => a.sku === 'EXPRESS')?.price || "800000").toLocaleString() :
                                                k === 'insurance' ? parseCurrency(addons?.find(a => a.sku === 'INSURANCE')?.price || "500000").toLocaleString() :
                                                    parseCurrency(addons?.find(a => a.sku === 'VIP')?.price || "1500000").toLocaleString()}
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

                    <div className={`${styles.priceRow} ${styles.totalRow} pt-4 mt-2 border-t border-slate-200 dark:border-white/10`}>
                        <div className="flex flex-col">
                            <span className="text-primary font-black uppercase text-[10px] tracking-widest">Grand Total</span>
                            <span className="text-[10px] text-gray-400 font-medium">All taxes & fees included</span>
                        </div>
                        <span className="text-3xl font-black text-amber-500">
                            IDR {grandTotal.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. CURRENCY CONVERTER */}
            <div className={`${styles.currencySection} mb-6`}>
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

            {/* 5. SELECT PAYMENT METHOD */}
            <div className={`glass-card ${styles.paymentMethodsCard} mb-6`}>
                <h4 className={styles.summaryTitle}>Select Payment Method</h4>
                <div className={styles.methodsList}>
                    <button
                        className={`${styles.methodOption} ${selectedMethod === 'PayPal' ? styles.selected : ''}`}
                        onClick={() => handleMethodSelect('PayPal')}
                    >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <CreditCard size={24} />
                        </div>
                        <div className={styles.methodInfo}>
                            <p className={styles.methodName}>PayPal or Visa/Master Card or Credit Card</p>
                            <p className={styles.methodDesc}>Instant confirmation • International Card</p>
                        </div>
                        {selectedMethod === 'PayPal' && <CheckCircle size={20} className="text-accent ml-auto" />}
                    </button>

                    <button
                        className={`${styles.methodOption} ${selectedMethod === 'DOKU' ? styles.selected : ''}`}
                        onClick={() => handleMethodSelect('DOKU')}
                    >
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <CreditCard size={24} />
                        </div>
                        <div className={styles.methodInfo}>
                            <p className={styles.methodName}>Local Bank, QRIS, Visa/Master Card, JCB & Amex</p>
                            <p className={styles.methodDesc}>Secure Local & Intl Payment gateway</p>
                        </div>
                        {selectedMethod === 'DOKU' && <CheckCircle size={20} className="text-accent ml-auto" />}
                    </button>

                    <button
                        className={`${styles.methodOption} ${selectedMethod === 'Manual' ? styles.selected : ''}`}
                        onClick={() => handleMethodSelect('Manual')}
                    >
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                            <Send size={24} />
                        </div>
                        <div className={styles.methodInfo}>
                            <p className={styles.methodName}>Consult with Expert (Pay Later)</p>
                            <p className={styles.methodDesc}>Submit data now & verify with our agent first</p>
                        </div>
                        {selectedMethod === 'Manual' && <CheckCircle size={20} className="text-accent ml-auto" />}
                    </button>
                </div>
            </div>

            {/* 6. AGREEMENT CHECKBOX */}
            <div className="mb-6 px-4 py-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-4">
                <Info size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400 font-medium">
                    By making this payment, you agree that you have read and accepted our <Link href="/terms-and-conditions" className="underline font-bold">Terms & Conditions</Link> and <Link href="/refund" className="underline font-bold">Refund Policy</Link>.
                </p>
            </div>

            {/* 7. CTA ORDER */}
            <div className={styles.actions}>
                {selectedMethod === 'PayPal' && !showPayPalButtons && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-500/30 flex items-center gap-3">
                        <Info size={18} className="text-blue-600" />
                        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Review your order details above then click to generate your secure PayPal checkout.</p>
                    </div>
                )}

                {showPayPalButtons && paymentInfo ? (
                    <Box sx={{ mt: 2, p: 3, bgcolor: '#f8fafc', borderRadius: 6, border: '2px solid #003087' }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, textAlign: 'center', color: '#003087' }}>
                            SECURE PAYPAL CHECKOUT READY
                        </Typography>
                        <PayPalIntegration
                            invoiceId={paymentInfo.invoiceId}
                            amount={paymentInfo.amount}
                            currency={paymentInfo.currency}
                        />
                        <Button
                            variant="text"
                            size="small"
                            fullWidth
                            onClick={() => setShowPayPalButtons(false)}
                            sx={{ mt: 2, color: 'text.secondary', textTransform: 'none' }}
                        >
                            Change Payment Method
                        </Button>
                    </Box>
                ) : (
                    <>
                        <button
                            onClick={processCheckout}
                            disabled={(!selectedMethod && !isSuccess) || isSubmitting}
                            className={`cta-accent ${styles.submitBtn} w-full justify-center gap-3 py-5 text-lg shadow-xl shadow-amber-500/20`}
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={24} color="inherit" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    {selectedMethod === 'Manual' ? <Send size={24} /> : (selectedMethod === 'PayPal' ? <CreditCard size={24} /> : <ShoppingCart size={24} />)}
                                    <span>{selectedMethod === 'Manual' ? 'SUBMIT APPLICATION' : (selectedMethod === 'PayPal' ? 'GENERATE PAYPAL LINK' : 'COMPLETE ORDER')}</span>
                                </>
                            )}
                        </button>

                        {!selectedMethod && (
                            <p className="text-sm text-center text-gray-500 mt-3 font-medium">Please select a payment method to proceed.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StepPayment;
