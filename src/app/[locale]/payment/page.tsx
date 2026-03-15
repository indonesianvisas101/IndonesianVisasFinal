
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Box, Card, CardContent, Grid, Button, Divider, Stack, Alert, Skeleton, CircularProgress } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AppleIcon from '@mui/icons-material/Apple';
import PayPalIntegration from '@/components/payment/PayPalIntegration';

function PaymentContent() {
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get('invoice');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency') || 'USD';

    const isValid = invoiceId && amount && !isNaN(Number(amount));

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', py: 8, mt: 4 }}>
            <Container maxWidth="md">
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#1F2937' }}>
                        Payment Methods
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Secure payment options for your Indonesian Visas invoice.
                    </Typography>
                </Box>

                {!isValid && (
                    <Box sx={{ mb: 4 }}>
                        <Alert severity="warning" sx={{ borderRadius: 3 }}>
                            No invoice details found. Please use the link provided in your email or contact support.
                        </Alert>
                    </Box>
                )}

                {isValid && (
                    <Card sx={{ mb: 4, borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                        <Box sx={{ bgcolor: 'warning.light', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ bgcolor: 'warning.main', color: 'white', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                                <PaymentIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: 'warning.contrastText' }}>
                                Note: Prices shown include 2% Government Tax. 3rd-party payment gateway fees may apply at checkout.
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold">INVOICE REFERENCE</Typography>
                                <Typography variant="h6" fontWeight="bold">#{invoiceId}</Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption" color="text.secondary" fontWeight="bold">TOTAL DUE (RECALCULATED)</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    {currency} {Number(amount).toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                <Grid container spacing={3}>
                    {/* PAYPAL & CARD */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: isValid ? '2px solid #003087' : '1px solid transparent' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                    <PaymentIcon sx={{ color: '#003087', fontSize: 32 }} />
                                    <div>
                                        <Typography variant="h6" fontWeight="bold">PayPal & Credit/Debit Card</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Instant activation. Secure Checkout via PayPal API.
                                        </Typography>
                                    </div>
                                </Stack>
                                
                                {isValid ? (
                                    <Box sx={{ mt: 2, minHeight: 150, display: 'flex', justifyContent: 'center' }}>
                                        <PayPalIntegration 
                                            invoiceId={invoiceId!} 
                                            amount={Number(amount)} 
                                            currency={currency} 
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: 2 }}>
                                        <Typography color="text.secondary">PayPal checkout requires a valid invoice ID and amount.</Typography>
                                    </Box>
                                )}

                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 3, textAlign: 'center', bgcolor: '#f8f9fa', p: 1, borderRadius: 1 }}>
                                    Your data will be automatically synchronized upon successful payment.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* BANK TRANSFER */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3}>
                                    <Box
                                        sx={{
                                            width: 80, height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(145, 85, 253, 0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <AccountBalanceIcon sx={{ fontSize: 40, color: '#9155FD' }} />
                                    </Box>
                                    <Box flex={1} textAlign={{ xs: 'center', sm: 'left' }}>
                                        <Typography variant="h5" fontWeight="bold">Bank Transfer (BCA)</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                            Direct transfer for local accounts. Processing time: Instant.
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 3 }} />
                                <Box sx={{ bgcolor: '#F3F4F6', p: 3, borderRadius: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">BANK NAME</Typography>
                                            <Typography variant="subtitle1" fontWeight="bold">BCA (Bank Central Asia)</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">ACCOUNT NUMBER</Typography>
                                            <Typography variant="h6" fontWeight="bold" fontFamily="monospace" sx={{ color: '#9155FD' }}>
                                                611-590-3172
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">ACCOUNT HOLDER</Typography>
                                            <Typography variant="subtitle1" fontWeight="bold">Wahyudin Damopolii</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                    Please include your Invoice # in the transfer notes.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* STRIPE / APPLE PAY */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                    <Stack direction="row" spacing={1}>
                                        <CreditCardIcon color="secondary" fontSize="large" />
                                        <AppleIcon sx={{ fontSize: 32 }} />
                                    </Stack>
                                    <Typography variant="h6" fontWeight="bold">Stripe / Apple Pay</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Pay securely using your Credit Card, Debit Card, or Apple Pay wallet.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled
                                    sx={{ mt: 2, bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
                                >
                                    Pay with Card (Coming Soon)
                                </Button>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                    Contact support for a manual payment link.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box mt={6} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        Need help? Contact <strong style={{ color: '#9155FD' }}>support@indonesianvisas.agency</strong>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        }>
            <PaymentContent />
        </Suspense>
    );
}
