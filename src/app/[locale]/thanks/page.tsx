
import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export default function ThanksPage() {
    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="sm">
                <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                        <Box sx={{ mb: 3 }}>
                            <CheckCircleIcon sx={{ fontSize: 80, color: '#56CA00' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Thank You!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            Payment Confirmation
                        </Typography>

                        <Typography variant="body1" paragraph>
                            We will inform you by email or WhatsApp to confirm the payment.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Please allow up to 24 hours for us to process your transaction and update your invoice status.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <Link href="/" passHref style={{ textDecoration: 'none' }}>
                                <Button variant="contained" size="large" fullWidth sx={{ borderRadius: 2 }}>
                                    Return to Home
                                </Button>
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
