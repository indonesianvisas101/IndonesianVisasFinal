import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        const internalKey = process.env.OPENAI_API_KEY_INTERNAL;
        const isInternal = authHeader === `Bearer ${internalKey}`;

        if (!isInternal) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const profile = await prisma.user.findUnique({
                where: { id: authUser.id },
                select: { role: true }
            });
            if (!profile || profile.role !== 'admin') {
                return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
            }
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // 1. Weekly Revenue Summary
        const recentInvoices = await prisma.invoice.findMany({
            where: {
                status: 'PAID',
                paidAt: { gte: sevenDaysAgo }
            },
            select: { amount: true }
        });
        const weeklyRevenueCounter = recentInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

        // 2. Conversion Funnel & Drop-off Analysis
        const allApps = await prisma.visaApplication.findMany({ select: { status: true } });
        let total = 0, converted = 0, dropped = 0;
        allApps.forEach(app => {
            total++;
            const s = (app.status || "").toLowerCase();
            if (s === "paid" || s === "active") converted++;
            else if (s === "pending" || s === "expired" || s === "rejected") dropped++;
        });

        // 3. Expiry Forecast (next 30 days)
        const expiringVerifications = await prisma.verification.count({
            where: {
                expiresAt: { gte: now, lte: thirtyDaysFromNow }
            }
        });

        // 4. Risk Pattern Detection (Abnormal Spike)
        const recentRequests = await prisma.aIChangeRequest.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        });
        const riskSpikeAlert = recentRequests > 20 ? "ABNORMAL_SPIKE_DETECTED" : "NOMINAL";

        // 5. Price Sensitivity Analysis (Generic Readout)
        const sensitivity = total > 0 && converted / total < 0.3 ? "HIGH_DROP_OFF_REVIEW_PRICING" : "STABLE";

        return NextResponse.json({
            module: "STRATEGIC_INTELLIGENCE_ENGINE",
            mode: "READ_ONLY_ADVISORY",
            timestamp: now.toISOString(),
            metrics: {
                revenue_7d: weeklyRevenueCounter,
                funnel_conversion_rate: total > 0 ? ((converted / total) * 100).toFixed(2) + "%" : "0%",
                funnel_dropoff_rate: total > 0 ? ((dropped / total) * 100).toFixed(2) + "%" : "0%",
                expiry_forecast_30d: expiringVerifications,
                price_sensitivity_advisory: sensitivity,
                risk_pattern_status: riskSpikeAlert
            }
        });

    } catch (e: any) {
        console.error("Strategic Report Error:", e);
        return NextResponse.json({ error: "Intelligence Engine Fault" }, { status: 500 });
    }
}
