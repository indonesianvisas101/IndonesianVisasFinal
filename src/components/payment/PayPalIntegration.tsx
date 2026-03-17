
"use client";

import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CircularProgress, Box, Typography, Alert } from '@mui/material';

interface PayPalIntegrationProps {
    invoiceId: string;
    amount: number;
    currency?: string;
    onSuccess?: (details: any) => void;
    onError?: (error: any) => void;
}

export default function PayPalIntegration({ 
    invoiceId, 
    amount, 
    currency = 'USD',
    onSuccess,
    onError 
}: PayPalIntegrationProps) {
    const [{ isPending }] = usePayPalScriptReducer();
    const [error, setError] = useState<string | null>(null);

    return (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
            {isPending && (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress size={24} />
                </Box>
            )}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <PayPalButtons
                style={{ 
                    layout: "vertical",
                    shape: "rect",
                    color: "gold",
                    label: "pay"
                }}
                disabled={isPending}
                createOrder={async () => {
                    try {
                        const response = await fetch("/api/payments/paypal/create-order", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                invoiceId,
                                amount,
                                currency,
                            }),
                        });

                        const order = await response.json();
                        if (order.error) throw new Error(order.error);
                        return order.id;
                    } catch (err: any) {
                        setError(err.message || "Could not initiate PayPal checkout");
                        throw err;
                    }
                }}
                onApprove={async (data, actions) => {
                    try {
                        const response = await fetch("/api/payments/paypal/capture-order", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                orderID: data.orderID,
                                invoiceId: invoiceId, // Pass invoiceId to backend for email triggering if needed
                            }),
                        });

                        const captureData = await response.json();
                        
                        // Check for error from server-side capture
                        if (captureData.error) throw new Error(captureData.error);

                        const errorDetail = captureData?.details?.[0];

                        // If capture failed
                        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                            return actions.restart();
                        } else if (errorDetail) {
                            throw new Error(`${errorDetail.description} (${captureData.debug_id})`);
                        }

                        if (onSuccess) onSuccess(captureData);
                        
                        // Get current locale from URL or params if available
                        const pathParts = window.location.pathname.split('/');
                        const currentLocale = pathParts[1] || 'en';
                        
                        // Redirect to thanks page with locale
                        window.location.href = `/${currentLocale}/thanks?invoice=${invoiceId}&status=paid`;
                    } catch (err: any) {
                        setError(err.message || "Payment capture failed");
                        if (onError) onError(err);
                    }
                }}
                onCancel={() => {
                    // Optional: handle cancel
                    console.log("PayPal Payment Cancelled");
                }}
                onError={(err) => {
                    setError("PayPal SDK Error. Please try again or contact support.");
                    console.error("PayPal SDK Error:", err);
                    if (onError) onError(err);
                }}
            />
        </Box>
    );
}
