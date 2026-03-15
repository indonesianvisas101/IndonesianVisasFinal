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
    const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Approved"].includes(invoiceData.status);


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
            // Extract numeric amount
            const match = priceDisplay.match(/[\d,.]+/);
            const rawNumber = match ? parseFloat(match[0].replace(/,/g, '')) : 0;

            if (rawNumber <= 0) {
                alert("Cannot process checkout for an invalid or free amount.");
                setIsCheckingOut(false);
                return;
            }

            const res = await fetch('/api/payments/doku/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId: invoiceData.id,
                    amount: rawNumber,
                    customerDetails: {
                        name: invoiceData.guestName || invoiceData.user?.name || "Client",
                        email: invoiceData.guestEmail || invoiceData.user?.email || "info@indonesianvisas.com",
                        phone: invoiceData.guestPhone || invoiceData.user?.phone || ""
                    }
                })
            });

            const data = await res.json();

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert("Checkout initialization failed: " + (data.error || "Unknown Error"));
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
                            {(invoiceData.user?.address || invoiceData.guestAddress) && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {invoiceData.user?.address || invoiceData.guestAddress}
                                </Typography>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Payable To:</Typography>
                            <Typography variant="body1" fontWeight="600">PT Indonesian Visas Agency™</Typography>

                            {/* PAYMENT DETAILS */}
                            <Box sx={{ mt: 1, mb: 2 }}>
                                {isPaid ? (
                                    <Typography variant="body2" color="success.main" fontWeight="bold">
                                        Payment Completed
                                    </Typography>
                                ) : (
                                    <>
                                        <Typography variant="body2" color="text.secondary" fontWeight="bold">Bank Transfer (BCA)</Typography>
                                        <Typography variant="body2" fontFamily="monospace">611-590-3172</Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">Wahyudin Damopolii</Typography>

                                        <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mt: 1 }}>PayPal/Wise/stripe/apple pay</Typography>
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
                                            Visa Processing & Administration Fee
                                        </Typography>
                                        {invoiceData.invoice?.adminNotes && (
                                            <Typography variant="caption" display="block" sx={{ mt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary', fontStyle: 'italic', borderTop: '1px solid rgba(0,0,0,0.05)', pt: 1 }}>
                                                {invoiceData.invoice.adminNotes}
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
                        <Box sx={{ minWidth: 250 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                                <Typography variant="body2" fontWeight="600">{priceDisplay}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Tax (0%):</Typography>
                                <Typography variant="body2" fontWeight="600">IDR 0</Typography>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Total:</Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#9155FD' }}>
                                    {priceDisplay}
                                </Typography>
                            </Box>
                            
                            {/* Detailed breakdown if available */}
                            {invoiceData.invoice?.serviceFee > 0 && (
                                <Box sx={{ mt: 3, p: 2, bgcolor: '#F9FAFC', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase' }}>
                                        Fee Breakdown
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Visa Service Fee:</Typography>
                                        <Typography variant="caption" fontWeight="600">IDR {parseFloat(String(invoiceData.invoice.serviceFee)).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">PPh 23 Tax (2%):</Typography>
                                        <Typography variant="caption" fontWeight="600">IDR {parseFloat(String(invoiceData.invoice.pph23Amount)).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption">Gateway & Processing:</Typography>
                                        <Typography variant="caption" fontWeight="600">IDR {parseFloat(String(invoiceData.invoice.gatewayFee)).toLocaleString()}</Typography>
                                    </Box>
                                </Box>
                            )}
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
                            sx={{
                                bgcolor: '#00cc66',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                boxShadow: '0 4px 14px 0 rgba(0, 204, 102, 0.39)',
                                '&:hover': {
                                    bgcolor: '#00b359',
                                    boxShadow: '0 6px 20px 0 rgba(0, 204, 102, 0.23)'
                                }
                            }}
                        >
                            {isCheckingOut ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Pay Now Securely"
                            )}
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
