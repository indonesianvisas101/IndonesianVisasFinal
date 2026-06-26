"use client";

/**
 * INDONESIAN VISAS - HARDENED INVOICE ECOSYSTEM v10.9.5 (2026-2027)
 * Status: Production Ready | Locked Baseline: Commit d3f090c
 * Mandate: Line Total + Tax (PPh 23) + Gateway Fee Parity
 * LOCK POLICY: COORDINATES ARE STABLE. DO NOT MODIFY WITHOUT CROSS-PLATFORM AUDIT.
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Stack,
    IconButton,
    Alert
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import Image from 'next/image';
import { VISA_DATABASE } from '@/constants/visas';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { QRCodeSVG } from 'qrcode.react';
import Script from 'next/script';
import { COUNTRY_DATA } from '@/constants/countries';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PayPalProvider } from "@/components/payment/PayPalProvider";
import PayPalIntegration from "@/components/payment/PayPalIntegration";
// Removed problematic lucide-react import to fix Turbopack HMR bug
const Zap = ({ size = 24, color = "currentColor", fill = "none", ...props }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const FileText = ({ size = 24, color = "currentColor", ...props }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);



export default function InvoicePage() {
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [formattedDate, setFormattedDate] = useState("");

    // Payment Methods State
    const [selectedMethod, setSelectedMethod] = useState<'DOKU' | 'PayPal' | 'Manual' | null>(null);
    const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
    const [uploadingProof, setUploadingProof] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isSubmittingProof, setIsSubmittingProof] = useState<boolean>(false);

    const [checkingStatus, setCheckingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ text: string, severity: 'success' | 'error' | 'info' | null }>({ text: "", severity: null });

    const handleCheckDokuStatus = async () => {
        setCheckingStatus(true);
        setStatusMessage({ text: "", severity: null });
        try {
            const res = await fetch('/api/payments/doku/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: invoiceData.invoice?.id || invoiceData.id })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatusMessage({
                    text: data.message || "Payment verified successfully!",
                    severity: 'success'
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setStatusMessage({
                    text: data.message || data.error || "No completed payment found on DOKU for this invoice yet.",
                    severity: 'info'
                });
            }
        } catch (err) {
            console.error("Status check error:", err);
            setStatusMessage({
                text: "Failed to connect to verification server. Please try again later.",
                severity: 'error'
            });
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadingProof(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', 'quick_apply');
            
            const res = await fetch('/api/upload/smart', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Upload failed");
            }
            const data = await res.json();
            if (data.url) setPaymentProofUrl(data.url);
        } catch (err: any) {
            console.error("Proof upload error:", err);
            setUploadError(err.message || "Failed to upload proof. Please try again.");
        } finally {
            setUploadingProof(false);
            e.target.value = '';
        }
    };

    const handleSubmitProof = async () => {
        if (!paymentProofUrl || !invoiceData) return;
        setIsSubmittingProof(true);
        try {
            const res = await fetch('/api/applications/submit-proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: invoiceData.invoice?.id || invoiceData.id, 
                    paymentProofUrl: paymentProofUrl,
                    status: 'PENDING VERIFICATION'
                })
            });
            if (res.ok) {
                alert("Payment Proof Submitted! Our team will verify your transaction shortly.");
                window.location.reload();
            } else {
                const data = await res.json();
                throw new Error(data.error || "Failed to update invoice");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmittingProof(false);
        }
    };

    useEffect(() => {
        if (invoiceData?.appliedAt) {
            setFormattedDate(new Date(invoiceData.appliedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }));
        }
    }, [invoiceData]);

    useEffect(() => {
        if (!id) return;

        const fetchInvoice = async () => {
            try {
                // Detect if it is a UUID
                let url = `/api/applications?id=${id}`;
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                if (!isUUID) {
                    url = `/api/applications?slug=${id}`;
                }

                const res = await fetch(url);

                if (res.ok) {
                    const data = await res.json();
                    setInvoiceData(data);
                } else {
                    const err = await res.json();
                    setError(err.error || "Failed to load invoice");
                }
            } catch (err) {
                console.error(err);
                setError("Error loading invoice");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    useEffect(() => {
        if (invoiceData) {
            const method = (invoiceData.invoice?.paymentMethod || invoiceData.paymentMethod || '').toUpperCase();
            if (method.includes('PAYPAL')) {
                setSelectedMethod('PayPal');
            } else if (method.includes('DOKU')) {
                setSelectedMethod('DOKU');
            } else if (method.includes('MANUAL') || method.includes('WISE') || method.includes('STRIPE') || method.includes('REVOLUT')) {
                setSelectedMethod('Manual');
            } else {
                setSelectedMethod('DOKU'); // Default fallback so payment buttons are immediately visible
            }
        }
    }, [invoiceData]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h5" color="error">{error}</Typography>
        </Container>
    );

    if (!invoiceData) return null;
 
    // --- v6.1 - GRANULAR DATABASE SYNC (NO RE-CALCULATION) ---
    const quantity = invoiceData.invoice?.quantity || invoiceData.quantity || 1;
    const visa = VISA_DATABASE.find(v => v.id === invoiceData.visaId);
    
    // Direct Database Mappings (From Step 4 Payment Flow)
    // visaAmount = Base Processing
    // addonsAmount = Total Addons
    const baseProcessing = Number(invoiceData.invoice?.visaAmount || invoiceData.invoice?.serviceFee || 0);
    const addonsTotal = Number(invoiceData.invoice?.addonsAmount || 0);
    
    const taxAmount = Number(invoiceData.invoice?.pph23Amount || 0);
    const gatewayFee = Number(invoiceData.invoice?.gatewayFee || 0);
    const computedGrandTotal = Number(invoiceData.invoice?.amount || 0);
    
    // v11.0 - Discount & Addon Breakdown (stored in attribution, no re-calculation)
    const discountPct = Number(invoiceData.attribution?.discountPct || 0);
    const discountAmount = Number(invoiceData.attribution?.discountAmount || 0);
    const addonBreakdown: Record<string, number> = invoiceData.attribution?.addonBreakdown || {};

    // v11.0 - Consistent human-readable Invoice Number
    const rawInvoiceId = invoiceData.invoice?.id || invoiceData.id || id || '';
    const formatInvoiceNumber = (raw: string): string => {
        const clean = raw.replace(/-/g, '').toUpperCase().slice(0, 8);
        return `INV-${clean}`;
    };
    const invoiceNumber = formatInvoiceNumber(rawInvoiceId);

    // Upsells are purely for display badges now, amount is already in Grand Total
    const upsells = invoiceData.attribution?.upsells || {};


    // v10.8 - Hardened isPaid Logic (Case-Insensitive & Comprehensive)
    const normalizedInvoiceStatus = (invoiceData.invoice?.status || '').toLowerCase();
    const normalizedStatus = (invoiceData.status || '').toLowerCase();
    const isPaid = normalizedInvoiceStatus === 'paid' || [
        "paid", "active", "review by agent", "on going", 
        "preparing for submission", "submited", "process by immigration", 
        "approved", "completed"
    ].includes(normalizedStatus);

    // v10.1 - Sanitize Passport (Prevent URLs from appearing as numbers)
    const displayPassport = invoiceData.passportNumber || 
        (invoiceData.attribution?.passport && !invoiceData.attribution.passport.startsWith('http') ? invoiceData.attribution.passport : null);

    // v10.10 - Corrected QR Logic: Invoice QR always leads to /verify/ portal first
    const getQrValue = () => {
        // 1. Always prefer the internal verification portal (client's "front door")
        if (invoiceData.verification?.slug) {
            return `https://indonesianvisas.com/verify/${invoiceData.verification.slug}`;
        }

        // 2. Official Government QR String (if no verify portal exists)
        if (invoiceData.verification?.qrCode) return invoiceData.verification.qrCode;

        // 3. No QR — return null (visaLink is NOT used here; it belongs inside /verify/)
        return null;
    };
    const qrValue = getQrValue();


    const handleDownloadPDF = async () => {
        if (invoiceData) {
            const { generateInvoicePDF } = await import('@/utils/invoicePdfGenerator');
            await generateInvoicePDF(invoiceData);
        }
    };


    const handleAddAddon = async (sku: string) => {
        try {
            const res = await fetch('/api/applications/add-addon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId: invoiceData.invoice?.id || invoiceData.id, addonSku: sku })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`✅ ${data.message}`);
                window.location.reload(); // Reload to show new total
            } else {
                alert(`❌ ${data.error}`);
            }
        } catch (e) {
            console.error("Failed to add addon", e);
            alert("An error occurred. Please try again.");
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Invoice #${id}`,
                    text: `Invoice for ${invoiceData.visaName || 'Service'}`,
                    url
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            } catch (err) {
                alert("Failed to copy link");
            }
        }
    };

    const handlePayNow = async () => {
        const manualLink = invoiceData.attribution?.paymentLink;
        if (manualLink) {
            window.location.href = manualLink.startsWith('http') ? manualLink : `https://${manualLink}`;
            return;
        }

        setIsCheckingOut(true);
        try {
            // v3.0 Hardened: Reconstruct the computed grand total to match the UI precisely
            // v5.1 - USE CENTRALIZED numericAmount
            const numericAmount = computedGrandTotal;

            if (numericAmount <= 0) {
                alert("Cannot process checkout for an invalid or free amount. Please contact support.");
                setIsCheckingOut(false);
                return;
            }

            // Generate a unique reference for this specific payment attempt
            const baseId = invoiceData.invoice?.id || invoiceData.id;
            const paymentReference = `${baseId}-${Date.now()}`;

            const res = await fetch('/api/payments/doku/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId: paymentReference,
                    amount: numericAmount,
                    customerDetails: {
                        name: invoiceData.guestName || invoiceData.user?.name || "Client",
                        email: invoiceData.guestEmail || invoiceData.user?.email || "support@indonesianvisas.com",
                        phone: invoiceData.attribution?.phone || invoiceData.user?.whatsapp || invoiceData.user?.phone || ""
                    }
                })
            });

            const data = await res.json();

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                console.error("DOKU Error:", data);
                alert("Checkout initialization failed: " + (data.error || "Payment Gateway unreachable. Please try again or use Bank Transfer."));
            }
        } catch (err) {
            console.error("Checkout Request Error:", err);
            alert("A network error occurred while contacting the payment gateway.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#F4F5FA', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 6 },
                        borderRadius: 3,
                        boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.05)'
                    }}
                    id="invoice-content"
                >
                    {/* HEADER */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
                        <Box sx={{ mb: { xs: 3, sm: 0 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Image
                                    src="/Favicon.webp"
                                    alt="Indonesian Visas"
                                    width={48}
                                    height={48}
                                    style={{ borderRadius: '8px' }}
                                />
                                <Typography variant="h5" fontWeight="700" sx={{ color: '#1F2937' }}>
                                    Indonesian Visas
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                PT Indonesian Visas Agency™<br />
                                Jl. Tibungsari No.11C, Padangsambian Kaja<br />
                                Denpasar, Bali, Indonesia<br />
                                support@indonesianvisas.agency<br />
                                indonesianvisas.com
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: '#9155FD', letterSpacing: 1, textTransform: 'uppercase' }}>
                                INVOICE
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: '#9155FD', fontWeight: 700, letterSpacing: 0.5 }}>
                                {invoiceNumber}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Date Issued:</Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {formattedDate || '...'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 6, borderColor: 'rgba(58, 53, 65, 0.08)' }} />

                    {/* BILL TO & STATUS */}
                    <Grid container spacing={4} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" sx={{ color: '#9155FD', fontWeight: 700, mb: 1 }}>BILL TO:</Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1F2937' }}>
                                {invoiceData.user?.name || invoiceData.guestName || "Valued Customer"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {invoiceData.user?.email || invoiceData.guestEmail || "-"}
                            </Typography>
                            {/* Passport & IDiv Code Visibility */}
                            {displayPassport && (
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937', mt: 1 }}>
                                    Passport: {displayPassport}
                                </Typography>
                            )}
                            {invoiceData.verification?.id && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                    IDiv Code: #{invoiceData.verification.id.slice(0, 8).toUpperCase()}
                                </Typography>
                            )}

                            {/* Phone & Country from attribution */}
                            {invoiceData.attribution?.phone && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {invoiceData.attribution.phone}
                                </Typography>
                            )}
                            {invoiceData.attribution?.country && (
                                <Typography variant="body2" color="text.secondary">
                                    {invoiceData.attribution.country}
                                </Typography>
                            )}
                            {(invoiceData.user?.address || invoiceData.guestAddress) && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {invoiceData.user?.address || invoiceData.guestAddress}
                                </Typography>
                            )}

                            {/* Indonesian Address Display (Hardened for Production View) */}
                            {(invoiceData.verification?.address || invoiceData.guestAddress) && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="overline" sx={{ color: '#9155FD', fontWeight: 700 }}>RESIDENTIAL ADDRESS (IDIV):</Typography>
                                    <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500, whiteSpace: 'pre-line' }}>
                                        {(() => {
                                            const raw = invoiceData.verification?.address || invoiceData.guestAddress;
                                            if (!raw || raw === "{}" || raw.includes('{"street":"","birthPlaceDate":"","gender":"","occupation":""}')) return null;
                                            
                                            try {
                                                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                                                if (typeof parsed === 'object' && parsed !== null) {
                                                    const lines = [];
                                                    if (parsed.street) lines.push(parsed.street);
                                                    if (parsed.birthPlaceDate) lines.push(`Birth Info: ${parsed.birthPlaceDate}`);
                                                    if (parsed.gender) lines.push(`Gender: ${parsed.gender}`);
                                                    if (parsed.occupation) lines.push(`Occupation: ${parsed.occupation}`);
                                                    return lines.length > 0 ? lines.join('\n') : null;
                                                }
                                            } catch (e) {
                                                // Not JSON or parsing failed, return original if not empty
                                                return raw && raw.length > 2 ? raw : null;
                                            }
                                            return raw;
                                        })()}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Payable To:</Typography>
                            <Typography variant="body1" fontWeight="600">PT Indonesian Visas Agency™</Typography>

                            {/* PAYMENT DETAILS */}
                            <Box sx={{ mt: 1, mb: 2 }}>
                                {isPaid ? (
                                    <Box>
                                        <Typography variant="body2" color="success.main" fontWeight="bold">
                                            Payment Completed
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Via: {invoiceData.paymentMethod?.toUpperCase() || "Captured Merchant"}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Typography variant="body2" color="text.secondary" fontWeight="bold">Bank Transfer (BCA Corporate)</Typography>
                                        <Typography variant="body2" fontFamily="monospace" fontWeight="bold" sx={{ color: '#9155FD' }}>6116-017850</Typography>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic' }}>Account: Indonesian Visas Agency</Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">SWIFT: CENAIDJA</Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">Address: Jl. Tibung Sari No 11, Bali</Typography>

                                        <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mt: 1.5 }}>Online Checkout</Typography>
                                        <Typography variant="body2" fontFamily="monospace" sx={{ color: '#9155FD', wordBreak: 'break-all' }}>
                                            {invoiceData.attribution?.paymentLink || "indonesianvisas.com/payment"}
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 2,
                                        bgcolor: isPaid ? 'rgba(86, 202, 0, 0.12)' : 'rgba(255, 180, 0, 0.12)',
                                        color: isPaid ? '#56CA00' : '#FFB400',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {invoiceData.invoice?.status || invoiceData.status?.toUpperCase() || "PENDING"}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* ITEMS TABLE */}
                    <TableContainer sx={{ mb: 4, borderRadius: 2, border: '1px solid rgba(58, 53, 65, 0.08)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#F9FAFC' }}>
                                <TableRow>
                                    <TableCell sx={{ py: 2, fontWeight: 700, color: '#3A3541' }}>ITEM DESCRIPTION</TableCell>
                                    <TableCell align="center" sx={{ py: 2, fontWeight: 700, color: '#3A3541' }}>QTY</TableCell>
                                    <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#3A3541' }}>PRICE</TableCell>
                                    <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#3A3541' }}>TOTAL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ py: 3 }}>
                                        <Typography variant="subtitle2" fontWeight="700" color="primary.main">
                                            {visa?.name || invoiceData.visaName || invoiceData.visaId || 'Visa Application'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                            Application for {invoiceData.applicantName || 'Applicant'} • {displayPassport || 'Passport Holder'}
                                        </Typography>

                                        {/* Upsell Badges (v10.9.5 Hardened - No Duplicates) */}
                                        {(() => {
                                            const visaName = (visa?.name || invoiceData.visaName || "").toUpperCase();
                                            const upsells = invoiceData.attribution?.upsells || {};
                                            
                                            // 1. Get entries that are active (true)
                                            let entries = Object.entries(upsells).filter(([_, v]) => v);
                                            
                                            // 2. Filter out items that are already the main visa product
                                            entries = entries.filter(([k, _]) => {
                                                const key = k.toUpperCase();
                                                if (visaName.includes('ARRIVAL CARD') && (key.includes('ARRIVAL') || key === 'AC' || key === 'ECD')) return false;
                                                if (visaName.includes('IDIV') && key === 'IDIV') return false;
                                                return true;
                                            });

                                            // 3. De-duplicate similar items (e.g. arrival_card and ecd)
                                            const seen = new Set();
                                            return entries.filter(([k, _]) => {
                                                const key = k.toUpperCase();
                                                let normalized = key;
                                                if (key.includes('ARRIVAL') || key === 'AC' || key === 'ECD') normalized = 'ARRIVAL_CARD';
                                                if (seen.has(normalized)) return false;
                                                seen.add(normalized);
                                                return true;
                                            }).map(([k, _]) => (
                                                <Box key={k} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, mr: 1, px: 1, py: 0.25, bgcolor: 'rgba(145, 85, 253, 0.08)', borderRadius: 1, border: '1px solid rgba(145, 85, 253, 0.2)' }}>
                                                    <Zap size={10} color="#9155FD" />
                                                    <Typography variant="caption" sx={{ color: '#9155FD', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                        {k === 'idiv' ? 'IDIV ORDERED' : k === 'arrivalCard' ? 'ARRIVAL CARD' : k === 'smartId' ? 'SMART ID' : k.replace(/_/g, ' ').toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            ));
                                        })()}

                                        {/* v5.1 - PURELY DESCRIPTIVE NOTES (No Fallback) */}
                                        {invoiceData.attribution?.internalNotes && (
                                            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, border: '1px dashed #9155FD', bgcolor: 'rgba(145, 85, 253, 0.02)' }}>
                                                <Typography variant="caption" sx={{ color: '#9155FD', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                                                    Payment Details & Notes:
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#4B5563', whiteSpace: 'pre-wrap', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                                    {invoiceData.attribution.internalNotes}
                                                </Typography>
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">{quantity}</TableCell>
                                    <TableCell align="right">IDR {baseProcessing.toLocaleString()}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>IDR {(baseProcessing * quantity).toLocaleString()}</TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* v4.6 - MASTER'S CUSTOM LAYOUT (PHOTO 4 MATCH + MOBILE OPTIMIZED) */}
                    <Grid container spacing={4} sx={{ mb: 6, flexDirection: { xs: 'column-reverse', md: 'row' } }}>
                        {/* Left Side: Notes & Custom Fields (CONDITIONAL) */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={2}>
                                {invoiceData.invoice?.adminNotes && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>Admin Notes</Typography>
                                        <Typography variant="body2">:</Typography>
                                        <Typography variant="body2" sx={{ color: '#4B5563', whiteSpace: 'pre-wrap' }}>
                                            {invoiceData.invoice.adminNotes}
                                        </Typography>
                                    </Box>
                                )}

                                {/* v10.9.8 - GATEKEEPER MOVED ENTIRELY TO VISA LINK COLUMN */}
                                {invoiceData.attribution?.registrationNumber && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>No. Reg Immigration</Typography>
                                        <Typography variant="body2">:</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                            {invoiceData.attribution.registrationNumber}
                                        </Typography>
                                    </Box>
                                )}

                                {invoiceData.attribution?.visaLink && (
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>Your Link Visa</Typography>
                                        <Typography variant="body2">:</Typography>
                                        
                                        {/* GATEKEEPER: Lock Visa Link if Agreement is Pending */}
                                        {(() => {
                                            const n = (visa?.name || invoiceData.visaName || invoiceData.visaId || "").toUpperCase();
                                            const isForced = n.includes('E23A') || n.includes('E33G') || /\bD\d+/.test(n) || /\bC\d+/.test(n);
                                            const isB1VOA = n.includes('B1 VOA') || n.includes('B1 - VOA') || n === 'B1';
                                            const isVerifReq = invoiceData.verification?.isAgreementRequired === true;
                                            const requiresAgreement = (isForced || isVerifReq || invoiceData.verification?.agreementStatus === 'PENDING') && !isB1VOA;
                                            const isSigned = invoiceData.verification?.agreementStatus === 'SIGNED';
                                            const shouldLock = requiresAgreement && !isSigned;
                                            
                                            if (shouldLock) {
                                                const lockHref = invoiceData.verification?.slug ? `/verify/agreement/${invoiceData.verification.slug}` : "#";
                                                const lockOnClick = !invoiceData.verification?.slug ? (e: any) => { e.preventDefault(); alert("Verification record not found. Please contact Admin to generate your secure agreement link."); } : undefined;
                                                
                                                return (
                                                    <a 
                                                        href={lockHref}
                                                        onClick={lockOnClick}
                                                        style={{ 
                                                            color: '#fff', 
                                                            backgroundColor: '#9155FD',
                                                            padding: '6px 16px',
                                                            borderRadius: '6px',
                                                            textDecoration: 'none',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.85rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            boxShadow: '0 4px 10px rgba(145, 85, 253, 0.3)'
                                                        }}
                                                    >
                                                        ⚠️ SIGN AGREEMENT TO UNLOCK
                                                    </a>
                                                );
                                            }
                                            
                                            return (
                                                <a 
                                                    href={invoiceData.attribution.visaLink.startsWith('http') ? invoiceData.attribution.visaLink : `https://${invoiceData.attribution.visaLink}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#9155FD', fontWeight: 800, textDecoration: 'underline' }}
                                                >
                                                    Click here to download
                                                </a>
                                            );
                                        })()}
                                    </Box>
                                )}

                                {invoiceData.attribution?.arrivalCardLink && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>Arrival Card Link</Typography>
                                        <Typography variant="body2">:</Typography>
                                        <a 
                                            href={invoiceData.attribution.arrivalCardLink.startsWith('http') ? invoiceData.attribution.arrivalCardLink : `https://${invoiceData.attribution.arrivalCardLink}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: '#9155FD', fontWeight: 600, textDecoration: 'none' }}
                                        >
                                            Click here to download
                                        </a>
                                    </Box>
                                )}

                                {invoiceData.attribution?.arrivalCardQr && (
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>Arrival Card QR</Typography>
                                        <Typography variant="body2">:</Typography>
                                        <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #E5E7EB' }}>
                                            <QRCodeSVG
                                                value={invoiceData.attribution.arrivalCardQr}
                                                size={80}
                                                level="M"
                                            />
                                        </Box>
                                    </Box>
                                )}
                                 <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>Digital ID Status</Typography>
                                    <Typography variant="body2">:</Typography>
                                    <a 
                                        href={upsells.idiv || invoiceData.visaId === 'IDIV' 
                                            ? (invoiceData.verification?.slug ? `/verify/${invoiceData.verification.slug}` : "#") 
                                            : "https://indonesianvisas.com/id-indonesian-visas"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Box sx={{ 
                                            px: 1, 
                                            py: 0.2, 
                                            borderRadius: 1, 
                                            bgcolor: upsells.idiv || invoiceData.visaId === 'IDIV' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(145, 85, 253, 0.1)',
                                            border: `1px solid ${upsells.idiv || invoiceData.visaId === 'IDIV' ? '#059669' : '#9155FD'}`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            cursor: 'pointer'
                                        }}>
                                            <Typography variant="caption" sx={{ 
                                                fontWeight: 800, 
                                                color: upsells.idiv || invoiceData.visaId === 'IDIV' ? '#059669' : '#9155FD',
                                                textTransform: 'uppercase',
                                                fontSize: '0.65rem'
                                            }}>
                                                {upsells.idiv || invoiceData.visaId === 'IDIV' ? 'Verified IDiv' : 'IDiv Card (Sample / Contoh)'}
                                            </Typography>
                                        </Box>
                                    </a>
                                </Box>

                                 {/* --- SPONSOR AGREEMENT INTEGRATED WIDGET --- */}
                                 {(() => {
                                     const widgetN = (visa?.name || invoiceData.visaName || invoiceData.visaId || invoiceData.verification?.visaType || "").toUpperCase();
                                     const isWidgetB1VOA = widgetN.includes('B1 VOA') || widgetN.includes('B1 - VOA') || widgetN === 'B1';
                                     if (isWidgetB1VOA) return null;
                                     return invoiceData.verification ? (
                                     <Box sx={{ 
                                         mt: 3, 
                                         p: 2.5, 
                                         borderRadius: 2.5, 
                                         border: '1.5px solid rgba(145, 85, 253, 0.2)', 
                                         bgcolor: 'rgba(145, 85, 253, 0.02)',
                                         boxShadow: '0 2px 10px rgba(145, 85, 253, 0.03)'
                                     }}>
                                         <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9155FD', textTransform: 'uppercase', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                             <FileText size={16} color="#9155FD" /> Sponsor Agreement Status
                                         </Typography>
                                         
                                         <Stack spacing={1.5}>
                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Verification Target:</Typography>
                                                 <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.8rem' }}>
                                                     {invoiceData.verification.fullName}
                                                 </Typography>
                                             </Box>

                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Requirement:</Typography>
                                                 <Typography variant="body2" sx={{ fontWeight: 800, color: invoiceData.verification.isAgreementRequired ? '#FF9F43' : '#6B7280', fontSize: '0.8rem' }}>
                                                     {invoiceData.verification.isAgreementRequired ? 'MANDATORY / WAJIB' : 'OPTIONAL'}
                                                 </Typography>
                                             </Box>
                                             
                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Status:</Typography>
                                                 <Box sx={{ 
                                                     px: 1.5, 
                                                     py: 0.3, 
                                                     borderRadius: 1, 
                                                     bgcolor: invoiceData.verification.agreementStatus === 'SIGNED' ? 'rgba(86, 202, 0, 0.12)' : 'rgba(255, 180, 0, 0.12)',
                                                     color: invoiceData.verification.agreementStatus === 'SIGNED' ? '#56CA00' : '#FFB400',
                                                     fontWeight: 900,
                                                     fontSize: '0.7rem',
                                                     textTransform: 'uppercase',
                                                     letterSpacing: 0.5
                                                 }}>
                                                     {invoiceData.verification.agreementStatus || 'PENDING'}
                                                 </Box>
                                             </Box>
                                             
                                             {invoiceData.verification.agreementStatus === 'SIGNED' ? (
                                                 <>
                                                     <Divider sx={{ my: 0.5, borderColor: 'rgba(145, 85, 253, 0.1)' }} />
                                                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                         <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Signed Date:</Typography>
                                                         <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 600 }}>
                                                             {invoiceData.verification.agreementSignedAt 
                                                                 ? new Date(invoiceData.verification.agreementSignedAt).toLocaleDateString('en-GB', {
                                                                     day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                 }) 
                                                                 : '-'}
                                                         </Typography>
                                                     </Box>
                                                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                         <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Sign IP:</Typography>
                                                         <Typography variant="caption" sx={{ color: '#4B5563', fontFamily: 'monospace' }}>
                                                             {invoiceData.verification.ipAddress || '-'}
                                                         </Typography>
                                                     </Box>
                                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                         <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 60 }}>Signature:</Typography>
                                                         <Typography variant="caption" sx={{ color: '#4B5563', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'right', fontSize: '0.65rem', maxWidth: 160 }}>
                                                             {invoiceData.verification.agreementHash ? `${invoiceData.verification.agreementHash.slice(0, 24)}...` : '-'}
                                                         </Typography>
                                                     </Box>
                                                     
                                                     <Button 
                                                         variant="outlined" 
                                                         size="small" 
                                                         fullWidth
                                                         onClick={() => window.open(`/verify/agreement/${invoiceData.verification.slug}`, '_blank')}
                                                         sx={{ 
                                                             mt: 1,
                                                             borderColor: '#56CA00', 
                                                             color: '#56CA00',
                                                             textTransform: 'none',
                                                             fontWeight: 'bold',
                                                             fontSize: '0.75rem',
                                                             borderRadius: 1.5,
                                                             '&:hover': { bgcolor: 'rgba(86, 202, 0, 0.05)', borderColor: '#48B200' }
                                                         }}
                                                     >
                                                         🔎 Review Signed Document (PDF)
                                                     </Button>
                                                 </>
                                             ) : (
                                                 <>
                                                     <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', fontSize: '0.7rem', lineHeight: 1.4 }}>
                                                         ⚠️ Indonesian immigration regulation requires all sponsored travelers to digitally sign the Sponsorship and Responsibility Agreement before visa files can be released.
                                                     </Typography>
                                                     
                                                     <Button 
                                                         variant="contained" 
                                                         size="medium" 
                                                         fullWidth
                                                         onClick={() => window.location.href = `/verify/agreement/${invoiceData.verification.slug}`}
                                                         sx={{ 
                                                             mt: 1,
                                                             bgcolor: '#9155FD', 
                                                             color: 'white',
                                                             textTransform: 'none',
                                                             fontWeight: 'bold',
                                                             fontSize: '0.8rem',
                                                             borderRadius: 1.5,
                                                             boxShadow: '0 4px 12px rgba(145, 85, 253, 0.3)',
                                                             '&:hover': { bgcolor: '#804BDF' }
                                                         }}
                                                     >
                                                         ✍️ Read & Sign Agreement Now
                                                     </Button>
                                                 </>
                                             )}
                                         </Stack>
                                     </Box>
                                 ) : null;
                                 })()}

                                {(invoiceData.invoice?.adminNotes || invoiceData.attribution?.registrationNumber || invoiceData.attribution?.visaLink) && (
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1F2937', textTransform: 'uppercase' }}>
                                            Details is Above
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Grid>

                        {/* Right Side: Order Details (Pricing) */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Box sx={{ bgcolor: 'white', borderRadius: 2 }}>
                                        <>
                                            <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ display: 'block', mb: 2, textTransform: 'uppercase' }}>
                                                ORDER DETAILS
                                            </Typography>

                                        <Stack spacing={1.5} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Base Processing:</Typography>
                                                    <Typography variant="body2" fontWeight="700">IDR {baseProcessing.toLocaleString()}</Typography>
                                                </Box>

                                                {/* Per-item addon breakdown */}
                                                {addonBreakdown.idiv > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">↳ IDiv Card (Smart ID):</Typography>
                                                        <Typography variant="body2" fontWeight="600" color="text.secondary">IDR {addonBreakdown.idiv.toLocaleString()}</Typography>
                                                    </Box>
                                                )}
                                                {addonBreakdown.arrivalCard > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">↳ Arrival Card (e-CD):</Typography>
                                                        <Typography variant="body2" fontWeight="600" color="text.secondary">IDR {addonBreakdown.arrivalCard.toLocaleString()}</Typography>
                                                    </Box>
                                                )}
                                                {addonBreakdown.express > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">↳ Express Processing:</Typography>
                                                        <Typography variant="body2" fontWeight="600" color="text.secondary">IDR {addonBreakdown.express.toLocaleString()}</Typography>
                                                    </Box>
                                                )}
                                                {addonBreakdown.insurance > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">↳ Travel Insurance:</Typography>
                                                        <Typography variant="body2" fontWeight="600" color="text.secondary">IDR {addonBreakdown.insurance.toLocaleString()}</Typography>
                                                    </Box>
                                                )}
                                                {addonBreakdown.vip > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">↳ VIP Service:</Typography>
                                                        <Typography variant="body2" fontWeight="600" color="text.secondary">IDR {addonBreakdown.vip.toLocaleString()}</Typography>
                                                    </Box>
                                                )}
                                                {/* Fallback: Show total add-ons if no itemized breakdown */}
                                                {addonsTotal > 0 && Object.keys(addonBreakdown).length === 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2">Add-On Services:</Typography>
                                                        <Typography variant="body2" fontWeight="700">IDR {addonsTotal.toLocaleString()}</Typography>
                                                    </Box>
                                                )}

                                                {/* v6.1 - TAXES DIRECTLY FROM DB */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Government Tax (PPh 23) 2%:</Typography>
                                                    <Typography variant="body2" fontWeight="700">IDR {taxAmount.toLocaleString()}</Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Payment Fee:</Typography>
                                                    <Typography variant="body2" fontWeight="700">IDR {gatewayFee.toLocaleString()}</Typography>
                                                </Box>

                                                {/* Discount row — only shown if discount > 0 */}
                                                {discountAmount > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#f0fdf4', px: 1.5, py: 0.75, borderRadius: 1.5, border: '1px solid #bbf7d0' }}>
                                                        <Typography variant="body2" sx={{ color: '#166534', fontWeight: 700 }}>
                                                            🏷️ Discount ({discountPct}%):
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="800" sx={{ color: '#16a34a' }}>
                                                            - IDR {discountAmount.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Stack>

                                            <Box sx={{ textAlign: 'right', mt: 0.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="h5" fontWeight="800">Grand Total:</Typography>
                                                    <Typography variant="h5" fontWeight="800" sx={{ color: '#9155FD' }}>
                                                        IDR {computedGrandTotal.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                                                    Equivalent to approx. ${ (computedGrandTotal / 15900).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } USD
                                                </Typography>

                                                {/* v10.9.6 - PERSISTENT STATUS STAMP (PAID/UNPAID) */}
                                                <Box sx={{
                                                    mt: 2,
                                                    px: 4,
                                                    py: 0.5,
                                                    mr: 10,
                                                    border: `5px solid ${isPaid ? '#56CA00' : '#FF4C51'}`,
                                                    borderRadius: 1.5,
                                                    transform: 'rotate(-5deg)',
                                                    display: 'inline-block',
                                                    opacity: 0.9,
                                                    zIndex: 1
                                                }}>
                                                    <Typography variant="h5" fontWeight="900" sx={{ color: isPaid ? '#56CA00' : '#FF4C51', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                                        {isPaid ? 'PAID' : 'UNPAID'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    </Box>
                                </Grid>
                    </Grid>

                    {/* FOOTER NOTES */}

                    {/* FOOTER NOTES */}


                        {/* v4.5 - BOTTOM LAYOUT (QR LEFT, CONFIRMATION RIGHT) */}
                        <Grid container spacing={4} sx={{ mt: 2, alignItems: 'flex-end' }}>
                            {/* QR Code & Status Left */}
                            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pr: { sm: 4 } }}>
                                
                                {/* 1. VERIFICATION QR CODE (TOP) - Only if PAID */}
                                {isPaid && qrValue && (
                                    <Box sx={{ mt: -4, mb: 7, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'white', padding: '6px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <QRCodeSVG
                                                value={qrValue}
                                                size={95} 
                                                level="M"
                                            />
                                        </div>
                                    </Box>
                                )}

                                {/* 2. HIGHLIGHTED APPLICATION STATUS (BOTTOM) */}
                                <Box sx={{ textAlign: 'center', mt: -0 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', mb: 1.5, letterSpacing: 0.5 }}>
                                        BELLOW IS YOUR APPLICATION UPDATE
                                    </Typography>
                                    <Box sx={{
                                        px: 3,
                                        py: 1,
                                        bgcolor: 'rgba(3, 105, 161, 0.06)',
                                        borderRadius: 2,
                                        border: '2.5px solid #0369a1',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        boxShadow: '0 4px 12px rgba(3, 105, 161, 0.1)',
                                    }}>
                                        <Box sx={{ width: 10, height: 10, bgcolor: '#0369a1', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                        <Typography variant="body1" fontWeight="900" sx={{ color: '#0369a1', textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Status: {invoiceData.status || 'Processing'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                        {/* Confirmation Right */}
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'flex-end', textAlign: 'right' }}>
                            <Box sx={{ position: 'relative', width: 'fit-content', pt: 6 }}>
                                {/* Stamp & Signature - Hardened Images v10.5 */}
                                {isPaid && (
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: 30, 
                                        left: 40, 
                                        width: 180, 
                                        height: 180, 
                                        zIndex: 2, 
                                        pointerEvents: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                            {/* Company Stamp */}
                                            <Image 
                                                src="/Stempel.png" 
                                                alt="Official Stamp" 
                                                width={140} 
                                                height={140} 
                                                style={{ 
                                                    opacity: 0.8,
                                                    position: 'absolute',
                                                    top: 10,
                                                    left: 0,
                                                    rotate: '-5deg',
                                                }} 
                                            />
                                            {/* Official Signature Overlay */}
                                            <Image 
                                                src="/signature.png" 
                                                alt="Authorized Signature" 
                                                width={160} 
                                                height={120} 
                                                style={{ 
                                                    position: 'absolute',
                                                    top: 30,
                                                    left: 80,
                                                    transform: 'rotate(-0deg)',
                                                    filter: 'contrast(1.2) brightness(0.9)'
                                                }} 
                                            />
                                        </Box>
                                    </Box>
                                )}

                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 11 }}>
                                    Confirm Payment to:
                                </Typography>
                                <Typography variant="h6" fontWeight="800" sx={{ color: '#1F2937' }}>
                                    PT Indonesian Visas Agency™
                                </Typography>
                                <Divider sx={{ my: 1, width: '100%', borderColor: 'rgba(58, 53, 65, 0.2)' }} />
                                <Typography variant="caption" color="text.secondary">
                                    Authorized Official Invoice
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* v7.0 - DYNAMIC ARRIVAL CARD CTA (UPSALE) */}

                {/* v7.0 - DYNAMIC ARRIVAL CARD CTA (UPSALE) */}
                {(!invoiceData.attribution?.arrivalCardLink && !invoiceData.attribution?.arrivalCardQr && invoiceData.visaName !== 'ARRIVAL CARD' && !upsells.arrival_card && !upsells.arrivalCard) && (
                    <Box 
                        sx={{ 
                            mt: 4, 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: 'white',
                            border: '2px solid #9155FD',
                            boxShadow: '0 8px 24px rgba(145, 85, 253, 0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative Background Icon */}
                        <Box sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, transform: 'rotate(-15deg)' }}>
                            <Image src="/Favicon.webp" alt="" width={150} height={150} />
                        </Box>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="800" sx={{ color: '#1F2937', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Zap size={20} color="#9155FD" fill="#9155FD" />
                                    Mandatory Arrival Card (e-CD) Required!
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#4B5563', maxWidth: 500 }}>
                                    All international travelers entering Indonesia must submit a Customs Declaration. 
                                    Order yours now for a frictionless arrival and total document readiness.
                                </Typography>
                            </Box>
                            {isPaid ? (
                                <Button 
                                    variant="contained"
                                    href={`/${params.locale}/arrival-card`}
                                    sx={{ 
                                        bgcolor: '#9155FD', 
                                        px: 4, 
                                        py: 1.5, 
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 4px 12px rgba(145, 85, 253, 0.4)',
                                        '&:hover': { bgcolor: '#804BDF' }
                                    }}
                                >
                                    Secure Arrival Card Now →
                                </Button>
                            ) : (
                                <Button 
                                    variant="outlined"
                                    onClick={() => handleAddAddon('ARRIVAL_CARD')}
                                    sx={{ 
                                        borderColor: '#9155FD',
                                        color: '#9155FD',
                                        px: 4, 
                                        py: 1.5, 
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:hover': { bgcolor: 'rgba(145, 85, 253, 0.05)', borderColor: '#804BDF' }
                                    }}
                                >
                                    + Add to This Order
                                </Button>
                            )}
                        </Stack>
                    </Box>
                )}

                {/* v7.1 - IDIV CARD RECOMMENDATION (UPSALE) - Refined v7.5 */}
                {(!upsells.idiv && invoiceData.visaId !== 'IDIV' && (invoiceData.attribution?.arrivalCardLink || invoiceData.attribution?.arrivalCardQr || upsells.arrival_card || upsells.arrivalCard)) && (
                    <Box 
                        sx={{ 
                            mt: 2, 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: '#F9FAFC',
                            border: '1px solid #9155FD',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#1E1B4B', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Elevate Your Mobility in Indonesia
                                    <Box sx={{ px: 1, py: 0.2, borderRadius: 1, bgcolor: 'rgba(145, 85, 253, 0.1)', border: '1px solid #9155FD' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#9155FD', fontSize: '0.6rem' }}>SAMPLE BADGE</Typography>
                                    </Box>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 550 }}>
                                    We highly recommend the <strong>IDiv Verified Smart ID</strong> for your stay. 
                                    It digitalizes your local sponsorship and provides official, verified identification 
                                    to simplify your nomad lifestyle throughout the country.
                                </Typography>
                            </Box>
                            {isPaid ? (
                                <Button 
                                    variant="text"
                                    href={`/${params.locale}/smart-id`}
                                    sx={{ 
                                        color: '#9155FD', 
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Learn More →
                                </Button>
                            ) : (
                                <Button 
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleAddAddon('IDIV')}
                                    sx={{ 
                                        borderColor: '#9155FD',
                                        color: '#9155FD',
                                        px: 3, 
                                        py: 1, 
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: 'rgba(145, 85, 253, 0.05)' }
                                    }}
                                >
                                    + Add IDiv Upgrade
                                </Button>
                            )}
                        </Stack>
                    </Box>
                )}

                {/* ACTION BUTTONS */}
                <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, '@media print': { display: 'none' } }}>
                    {!isPaid && (
                        <PayPalProvider>
                            <Box sx={{ width: '100%', maxWidth: '500px' }}>
                                {/* Doku Payment Reconciliation Widget */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1.5px dashed rgba(145, 85, 253, 0.3)',
                                        bgcolor: 'rgba(145, 85, 253, 0.02)',
                                        mb: 4,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#9155FD', mb: 1, textTransform: 'uppercase' }}>
                                        Sudah membayar via DOKU? / Already Paid?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
                                        Jika Anda sudah menyelesaikan pembayaran di halaman DOKU tetapi status invoice belum berubah, silakan klik tombol di bawah untuk verifikasi pembayaran Anda secara langsung.
                                    </Typography>
                                    
                                    {statusMessage.severity && (
                                        <Alert severity={statusMessage.severity} sx={{ mb: 2, borderRadius: 2, textAlign: 'left', fontSize: '0.85rem' }}>
                                            {statusMessage.text}
                                        </Alert>
                                    )}

                                    <Button
                                        variant="outlined"
                                        onClick={handleCheckDokuStatus}
                                        disabled={checkingStatus}
                                        fullWidth
                                        startIcon={<RefreshIcon className={checkingStatus ? "animate-spin" : ""} />}
                                        sx={{
                                            borderColor: '#9155FD',
                                            color: '#9155FD',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            borderRadius: 2,
                                            '&:hover': {
                                                borderColor: '#804BDF',
                                                bgcolor: 'rgba(145, 85, 253, 0.04)'
                                            }
                                        }}
                                    >
                                        {checkingStatus ? "Memverifikasi..." : "Verifikasi Status Pembayaran DOKU"}
                                    </Button>
                                </Paper>

                                {/* Payment Method Selector */}
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
                                    Select Payment Method
                                </Typography>
                                <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
                                    {/* DOKU Method */}
                                    <Paper 
                                        elevation={selectedMethod === 'DOKU' ? 3 : 0}
                                        onClick={() => setSelectedMethod('DOKU')}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 3, 
                                            border: selectedMethod === 'DOKU' ? '2px solid #00cc66' : '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            bgcolor: selectedMethod === 'DOKU' ? '#f0fdf4' : 'transparent'
                                        }}
                                    >
                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                            <CreditCardIcon />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">Credit Card & Local Payments</Typography>
                                            <Typography variant="caption" color="text.secondary">Visa, Mastercard, JCB, Amex, Local Bank</Typography>
                                        </Box>
                                        {selectedMethod === 'DOKU' && <CheckCircleOutlineIcon color="success" />}
                                    </Paper>

                                    {/* PayPal Method */}
                                    <Paper 
                                        elevation={selectedMethod === 'PayPal' ? 3 : 0}
                                        onClick={() => setSelectedMethod('PayPal')}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 3, 
                                            border: selectedMethod === 'PayPal' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            bgcolor: selectedMethod === 'PayPal' ? '#eff6ff' : 'transparent'
                                        }}
                                    >
                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                                            <CreditCardIcon />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">PayPal</Typography>
                                            <Typography variant="caption" color="text.secondary">Secure International Payment</Typography>
                                        </Box>
                                        {selectedMethod === 'PayPal' && <CheckCircleOutlineIcon color="primary" />}
                                    </Paper>

                                    {/* Manual Method */}
                                    <Paper 
                                        elevation={selectedMethod === 'Manual' ? 3 : 0}
                                        onClick={() => setSelectedMethod('Manual')}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 3, 
                                            border: selectedMethod === 'Manual' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            bgcolor: selectedMethod === 'Manual' ? '#f5f3ff' : 'transparent'
                                        }}
                                    >
                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                                            <AccountBalanceIcon />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">Manual Transfer (Wise/Revolut)</Typography>
                                            <Typography variant="caption" color="text.secondary">Transfer directly & upload proof</Typography>
                                        </Box>
                                        {selectedMethod === 'Manual' && <CheckCircleOutlineIcon sx={{ color: '#8b5cf6' }} />}
                                    </Paper>
                                </Stack>

                                {/* Action Area Based on Selection */}
                                {selectedMethod === 'DOKU' && (
                                    <Button
                                        variant="contained"
                                        onClick={handlePayNow}
                                        fullWidth
                                        disabled={isCheckingOut || computedGrandTotal <= 0}
                                        startIcon={(() => {
                                            const cData = COUNTRY_DATA.find(c => c.name === invoiceData.attribution?.country || c.name === invoiceData.country);
                                            return (cData?.isSpecial || cData?.isUnregistered) ? <Zap /> : null;
                                        })()}
                                        sx={{
                                            bgcolor: (() => {
                                                const cData = COUNTRY_DATA.find(c => c.name === invoiceData.attribution?.country || c.name === invoiceData.country);
                                                return (cData?.isSpecial || cData?.isUnregistered) ? '#f59e0b' : '#00cc66';
                                            })(),
                                            px: 4,
                                            py: 2,
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            borderRadius: 3,
                                            boxShadow: (() => {
                                                const cData = COUNTRY_DATA.find(c => c.name === invoiceData.attribution?.country || c.name === invoiceData.country);
                                                return (cData?.isSpecial || cData?.isUnregistered) ? '0 4px 14px 0 rgba(245, 158, 11, 0.39)' : '0 4px 14px 0 rgba(0, 204, 102, 0.39)';
                                            })(),
                                            '&:hover': {
                                                bgcolor: (() => {
                                                    const cData = COUNTRY_DATA.find(c => c.name === invoiceData.attribution?.country || c.name === invoiceData.country);
                                                    return (cData?.isSpecial || cData?.isUnregistered) ? '#d97706' : '#00b359';
                                                })(),
                                            }
                                        }}
                                    >
                                        {(() => {
                                            const cData = COUNTRY_DATA.find(c => c.name === invoiceData.attribution?.country || c.name === invoiceData.country);
                                            if (cData?.isSpecial || cData?.isUnregistered) return "Process Payment";
                                            return isCheckingOut ? "Processing..." : "Pay Now Securely";
                                        })()}
                                    </Button>
                                )}

                                {selectedMethod === 'PayPal' && (
                                    <Box sx={{ mt: 2, p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '2px solid #003087', textAlign: 'center' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: '#003087' }}>
                                            SECURE PAYPAL CHECKOUT READY
                                        </Typography>
                                        <PayPalIntegration
                                            invoiceId={invoiceData.invoice?.id || invoiceData.id}
                                            amount={Math.ceil(computedGrandTotal / 16250)}
                                            currency="USD"
                                        />
                                    </Box>
                                )}

                                {selectedMethod === 'Manual' && (
                                    <Box sx={{ mt: 2, p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '2px solid #e2e8f0', textAlign: 'center' }}>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#334155' }}>
                                            Secure Manual Transfer
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                                            Please pay directly to our Corporate Bank Account at <a href="https://indonesianvisas.com/payment" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: 'bold' }}>indonesianvisas.com/payment</a>. 
                                            Once paid, you <strong>MUST</strong> upload the proof of transaction below.
                                        </Typography>

                                        {uploadError && (
                                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{uploadError}</Alert>
                                        )}

                                        <Box 
                                            sx={{ 
                                                border: '2px dashed #cbd5e1', 
                                                borderRadius: 3, 
                                                p: 4, 
                                                bgcolor: '#f1f5f9',
                                                position: 'relative',
                                                transition: 'all 0.2s ease',
                                                '&:hover': { borderColor: '#3b82f6' }
                                            }}
                                        >
                                            {uploadingProof ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <RefreshIcon sx={{ fontSize: 32, color: '#3b82f6', animation: 'spin 2s linear infinite', mb: 1 }} />
                                                    <Typography variant="body2" fontWeight="bold" color="primary">Uploading Securely...</Typography>
                                                </Box>
                                            ) : paymentProofUrl ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#dcfce3', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                                        <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                                    </Box>
                                                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#15803d' }}>Payment Proof Attached ✓</Typography>
                                                    <Button size="small" sx={{ mt: 1, textTransform: 'none' }} color="error" onClick={() => setPaymentProofUrl(null)}>
                                                        Remove & Re-upload
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <>
                                                    <input 
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        onChange={handleProofUpload}
                                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10, width: '100%' }}
                                                        disabled={uploadingProof}
                                                    />
                                                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2, boxShadow: 1, color: '#3b82f6' }}>
                                                        <UploadFileIcon />
                                                    </Box>
                                                    <Typography variant="body2" fontWeight="bold" color="text.primary">Click or drag receipt here to upload</Typography>
                                                    <Typography variant="caption" color="text.secondary">Supports JPG, PNG, WEBP, HEIC, PDF (Max 5MB)</Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={!paymentProofUrl || isSubmittingProof}
                                            onClick={handleSubmitProof}
                                            sx={{ mt: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 'bold', bgcolor: '#8b5cf6', '&:hover': { bgcolor: '#7c3aed' } }}
                                        >
                                            {isSubmittingProof ? "Submitting..." : (paymentProofUrl ? "Submit Payment Proof" : "Upload Proof to Continue")}
                                        </Button>
                                    </Box>
                                )}

                                {!selectedMethod && (
                                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontWeight: 'medium' }}>
                                        Please select a payment method above to proceed.
                                    </Typography>
                                )}
                            </Box>
                        </PayPalProvider>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        sx={{
                            px: 3,
                            py: 1.5,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderColor: '#9155FD',
                            color: '#9155FD',
                            '&:hover': {
                                borderColor: '#804BDF',
                                bgcolor: 'rgba(145, 85, 253, 0.04)'
                            }
                        }}
                    >
                        Print
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        onClick={handleShare}
                        sx={{
                            px: 3,
                            py: 1.5,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderColor: '#9155FD',
                            color: '#9155FD',
                            '&:hover': {
                                borderColor: '#804BDF',
                                bgcolor: 'rgba(145, 85, 253, 0.04)'
                            }
                        }}
                    >
                        Share
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadPDF}
                        sx={{
                            bgcolor: '#9155FD',
                            px: 3,
                            py: 1.5,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 14px 0 rgba(145, 85, 253, 0.39)',
                            '&:hover': {
                                bgcolor: '#804BDF',
                                boxShadow: '0 6px 20px 0 rgba(145, 85, 253, 0.23)'
                            }
                        }}
                    >
                        Download PDF
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
