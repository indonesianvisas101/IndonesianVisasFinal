"use client";

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
    CircularProgress
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import Image from 'next/image';
import { VISA_DATABASE } from '@/constants/visas';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { QRCodeSVG } from 'qrcode.react';
import Script from 'next/script';
import { COUNTRY_DATA } from '@/constants/countries';
import { Zap } from 'lucide-react';



export default function InvoicePage() {
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);

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

    // --- Price Calculation Logic ---
    let priceDisplay = "Contact Support";

    // 1. Custom Amount (Priority: Hardened Invoice Amount)
    const activeAmount = invoiceData.invoice?.amount || invoiceData.customAmount;
    if (activeAmount) {
        priceDisplay = `IDR ${parseFloat(String(activeAmount)).toLocaleString()}`;
    }
    // 2. Lookup standard price from Database
    else {
        const visa = VISA_DATABASE.find(v => v.id === invoiceData.visaId);
        if (visa) {
            priceDisplay = typeof visa.price === 'string' ? (visa.price === 'IDR 0' ? 'Free' : visa.price) : "Variable";
        }
    }

    // --- PAYMENT DATA LOGIC ---
    // If unpaid, show all options or specific instruction.
    // If paid, maybe show payment method used if captured, or just PAID status.
    const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(invoiceData.status);


    const handleDownloadPDF = async () => {
        if (invoiceData) {
            const { generateInvoicePDF } = await import('@/utils/invoicePdfGenerator');
            await generateInvoicePDF(invoiceData);
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
        setIsCheckingOut(true);
        try {
            // v3.0 Hardened: Reconstruct the computed grand total to match the UI precisely
            const ADDON_PRICES: Record<string, number> = {
                idiv: 325000,
                idg: 162500,
                express: 800000,
                insurance: 500000,
                vip: 1500000,
                smartId: 1000000
            };

            const upsells = invoiceData.attribution?.upsells || {};
            const quantity = invoiceData.invoice?.quantity || invoiceData.quantity || 1;
            const totalServiceFee = Number(invoiceData.invoice?.serviceFee || 0);

            let totalAddonsAmount = 0;
            Object.entries(upsells)
                .filter(([_, v]) => v)
                .forEach(([k, _]) => {
                    totalAddonsAmount += (ADDON_PRICES[k] || 0) * (['idiv', 'idg', 'smartId'].includes(k) ? quantity : 1);
                });

            const baseProcessing = totalServiceFee > 0 ? (totalServiceFee - totalAddonsAmount) : totalServiceFee;
            const taxAmount = Number(invoiceData.invoice?.pph23Amount && Number(invoiceData.invoice.pph23Amount) > 0
                ? invoiceData.invoice.pph23Amount
                : Math.round(baseProcessing * 0.02));
            const subtotalForServiceFee = totalServiceFee + taxAmount;
            const gatewayFee = Number(invoiceData.invoice?.gatewayFee && Number(invoiceData.invoice.gatewayFee) > 0
                ? invoiceData.invoice.gatewayFee
                : Math.round(subtotalForServiceFee * 0.04));

            const numericAmount = subtotalForServiceFee + gatewayFee;

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
                        phone: invoiceData.guestPhone || invoiceData.user?.phone || ""
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
                            <Typography variant="subtitle1" sx={{ color: '#9155FD', fontWeight: 600 }}>
                                #{id.slice(-6).toUpperCase()}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Date Issued:</Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {new Date(invoiceData.appliedAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 6, borderColor: 'rgba(58, 53, 65, 0.08)' }} />

                    {/* BILL TO & STATUS */}
                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" sx={{ color: '#9155FD', fontWeight: 700, mb: 1 }}>BILL TO:</Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1F2937' }}>
                                {invoiceData.user?.name || invoiceData.guestName || "Valued Customer"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {invoiceData.user?.email || invoiceData.guestEmail || "-"}
                            </Typography>
                            {/* Passport & IDiv Code Visibility */}
                            {invoiceData.attribution?.passport && (
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937', mt: 1 }}>
                                    Passport: {invoiceData.attribution.passport}
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
                                        <Typography variant="body2" fontFamily="monospace">indonesianvisas.com/payment</Typography>
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
                                        <Typography variant="body1" fontWeight="600" sx={{ color: '#1F2937' }}>
                                            {invoiceData.visaName || invoiceData.visaId}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Official Visa Processing & Administration
                                        </Typography>

                                        {/* Show Multi-Traveler breakdown if metadata indicates it */}
                                        {invoiceData.attribution?.totalTravelers > 1 && (
                                            <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" color="primary" fontWeight="bold">
                                                    GROUP BOOKING (#{invoiceData.attribution.orderIndex} of {invoiceData.attribution.totalTravelers})
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Itemized Upsells with Badges (Identification Hardening) */}
                                        {invoiceData.attribution?.upsells && Object.entries(invoiceData.attribution.upsells).filter(([_, v]) => v).map(([k, _]) => (
                                            <Box key={k} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, mr: 1, px: 1, py: 0.25, bgcolor: 'rgba(145, 85, 253, 0.08)', borderRadius: 1, border: '1px solid rgba(145, 85, 253, 0.2)' }}>
                                                <Zap size={10} color="#9155FD" />
                                                <Typography variant="caption" sx={{ color: '#9155FD', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                    {k === 'idiv' ? 'IDIV ORDERED' : k === 'smartId' ? 'SMART ID' : k.toUpperCase()}
                                                </Typography>
                                            </Box>
                                        ))}

                                        {/* INVOICE DESCRIPTION (From Admin) */}
                                        {(invoiceData.invoice?.description || invoiceData.description) && (
                                            <Typography variant="body2" sx={{ mt: 1.5, color: '#4B5563', whiteSpace: 'pre-wrap', bgcolor: '#F9FAFB', p: 1.5, borderRadius: 1.5, border: '1px solid #E5E7EB' }}>
                                                {invoiceData.invoice?.description || invoiceData.description}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">{invoiceData.invoice?.quantity || invoiceData.quantity || 1}</TableCell>
                                    <TableCell align="right">{priceDisplay}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                        {invoiceData.invoice?.amount
                                            ? `IDR ${parseFloat(String(invoiceData.invoice.amount)).toLocaleString()}`
                                            : priceDisplay
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* TOTAL CALCULATION */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
                        <Box sx={{ minWidth: 280 }}>
                            {/* Centralized Hardened Calculation Block */}
                            {(() => {
                                // 1. Constants & Data Setup
                                const ADDON_PRICES: Record<string, number> = {
                                    idiv: 325000,
                                    idg: 162500,
                                    express: 800000,
                                    insurance: 500000,
                                    vip: 1500000,
                                    smartId: 1000000
                                };

                                const upsells = invoiceData.attribution?.upsells || {};
                                const quantity = invoiceData.invoice?.quantity || invoiceData.quantity || 1;
                                const totalServiceFee = Number(invoiceData.invoice?.serviceFee || 0);

                                // 2. Calculate Add-ons
                                let totalAddonsAmount = 0;
                                const activeAddons = Object.entries(upsells)
                                    .filter(([_, v]) => v)
                                    .map(([k, _]) => {
                                        const price = (ADDON_PRICES[k] || 0) * (['idiv', 'idg', 'smartId'].includes(k) ? quantity : 1);
                                        totalAddonsAmount += price;
                                        return { key: k, price };
                                    });

                                // 3. Reconstruct Breakdown
                                // If base processing is 0 (old data), we treat serviceFee as base
                                const baseProcessing = totalServiceFee > 0 ? (totalServiceFee - totalAddonsAmount) : totalServiceFee;

                                // Tax: 2% of Base Visa Price ONLY
                                const taxAmount = Number(invoiceData.invoice?.pph23Amount && Number(invoiceData.invoice.pph23Amount) > 0
                                    ? invoiceData.invoice.pph23Amount
                                    : Math.round(baseProcessing * 0.02));

                                // Subtotal for 4% calculation
                                const subtotalForServiceFee = totalServiceFee + taxAmount;

                                // Force 4% Service Fee calculation if it's 0 or missing
                                const gatewayFee = Number(invoiceData.invoice?.gatewayFee && Number(invoiceData.invoice.gatewayFee) > 0
                                    ? invoiceData.invoice.gatewayFee
                                    : Math.round(subtotalForServiceFee * 0.04));

                                // 4. Final Grand Total (Sum of all parts)
                                const computedGrandTotal = subtotalForServiceFee + gatewayFee;

                                return (
                                    <>
                                        <Box sx={{ mb: 2, pb: 1, borderBottom: '1px solid #E5E7EB' }}>
                                            <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase' }}>
                                                Order Details
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Base Processing:</Typography>
                                                <Typography variant="body2" fontWeight="600">IDR {baseProcessing.toLocaleString()}</Typography>
                                            </Box>

                                            {activeAddons.map(addon => (
                                                <Box key={addon.key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        + {addon.key === 'idiv' ? 'ID Indonesian Visa' : addon.key === 'idg' ? 'Indonesian ID Guide' : addon.key === 'smartId' ? 'Smart ID Premium' : addon.key.toUpperCase()} Add-on:
                                                    </Typography>
                                                    <Typography variant="caption" fontWeight="600">IDR {addon.price.toLocaleString()}</Typography>
                                                </Box>
                                            ))}

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Government Tax (2%):</Typography>
                                                <Typography variant="body2" fontWeight="600">IDR {taxAmount.toLocaleString()}</Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Service Fee (4%):</Typography>
                                                <Typography variant="body2" fontWeight="600">IDR {gatewayFee.toLocaleString()}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                            <Typography variant="h6" fontWeight="bold">Grand Total:</Typography>
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#9155FD' }}>
                                                IDR {computedGrandTotal.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </>
                                );
                            })()}
                        </Box>
                    </Box>

                    {/* v3.9 - APPLICATION STATUS BADGE */}
                    <Box sx={{ mt: 4, mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
                        <Box sx={{
                            px: 3,
                            py: 1,
                            bgcolor: 'rgba(3, 105, 161, 0.1)',
                            borderRadius: 2,
                            borderLeft: '4px solid #0369a1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#0369a1', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Application Status: {invoiceData.status || 'Processing'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* VERIFICATION QR CARD - LEFT BOTTOM */}
                    {(invoiceData.verification?.slug || invoiceData.verification?.qrCode) && (
                        <Box sx={{ mt: 4, mb: 6, display: 'flex', justifyContent: 'flex-start' }}>
                            <Box sx={{
                                textAlign: 'center',
                                border: '1px dashed rgba(145, 85, 253, 0.5)',
                                borderRadius: 2,
                                p: 3,
                                bgcolor: 'rgba(145, 85, 253, 0.02)',
                                minWidth: 200
                            }}>
                                <Typography variant="subtitle2" fontWeight="700" color="primary" sx={{ mb: 2 }}>
                                    OFFICIAL DOCUMENT VERIFICATION
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'white', padding: '8px', borderRadius: '8px', margin: '0 auto', width: 'fit-content' }}>
                                    <QRCodeSVG
                                        value={`https://indonesianvisas.com/verify/${invoiceData.verification.slug || 'error'}`}
                                        size={120}
                                        level="M"
                                    />
                                </div>

                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                    Scan to verify authenticity
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* FOOTER NOTES */}
                    <Box sx={{
                        p: 3,
                        bgcolor: 'rgba(145, 85, 253, 0.04)',
                        borderRadius: 2,
                        borderLeft: '4px solid #9155FD'
                    }}>
                        <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#9155FD', mb: 0.5 }}>
                            Thank You!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            If you have any questions concerning this invoice, use the following invoice ID for reference: <strong>#{id.slice(-6).toUpperCase()}</strong>.
                        </Typography>
                    </Box>
                </Paper>

                {/* ACTION BUTTONS */}
                <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, '@media print': { display: 'none' } }}>
                    {!isPaid && (
                        <Button
                            variant="contained"
                            onClick={handlePayNow}
                            disabled={isCheckingOut || priceDisplay === "Free" || priceDisplay === "Contact Support" || priceDisplay === "Variable"}
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
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                textTransform: 'none',
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
                                if (cData?.isSpecial || cData?.isUnregistered) return "Process Calling Visa Payment";
                                return isCheckingOut ? "Processing..." : "Pay Now Securely";
                            })()}
                        </Button>
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
