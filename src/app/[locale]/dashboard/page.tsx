"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

/**
 * PAGE: /dashboard
 * ACTION: Redirects to /:username
 */
export default function DashboardRedirect() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const params = useParams();

    useEffect(() => {
        if (isLoading) return; // Wait for session check

        if (!user) {
            const locale = params?.locale || "en";
            router.push(`/${locale}/login`);
            return;
        }

        const locale = params?.locale || "en";
        
        if (user.role === 'admin') {
            router.replace(`/${locale}/admin`);
            return;
        }

        const slug = user.name
            ? user.name.toLowerCase().replace(/\s+/g, '_')
            : "profile"; // Fallback to 'profile' if name is empty

        router.replace(`/${locale}/${slug}`);
    }, [user, isLoading, router, params]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to your dashboard...</p>
        </div>
    );
}
