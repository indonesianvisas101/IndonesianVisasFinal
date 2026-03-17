
"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";

export function PayPalProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
    const isPlaceholder = clientId.includes("YOUR_LIVE") || clientId === "" || clientId === "test";

    if (isPlaceholder) {
        console.warn("PayPal Client ID is missing or using a placeholder. PayPal functionality will be disabled.");
        return <>{children}</>;
    }

    return (
        <PayPalScriptProvider options={{ 
            clientId: clientId,
            currency: "USD",
            intent: "capture",
            "environment": (process.env.NEXT_PUBLIC_PAYPAL_ENV as any) || "sandbox"
        }}>
            {children}
        </PayPalScriptProvider>
    );
}
