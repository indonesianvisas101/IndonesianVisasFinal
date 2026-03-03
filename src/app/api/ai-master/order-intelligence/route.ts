import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Enforce Master Key or Admin context
        const authHeader = request.headers.get("Authorization");
        const internalKey = process.env.OPENAI_API_KEY_INTERNAL;
        const isAdminRequest = authHeader === `Bearer ${internalKey}`;

        if (!isAdminRequest) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Check role via Prisma for consistency with profile sync
            const userProfile = await prisma.user.findUnique({
                where: { id: authUser.id },
                select: { role: true }
            });

            if (!userProfile || userProfile.role !== 'admin') {
                return NextResponse.json({ error: "Unauthorized. AI Master or Admin only." }, { status: 403 });
            }
        }

        // Section 6 - Read Only Aggregations
        // 1. Order Counts
        const applications = await prisma.visaApplication.findMany({
            select: { status: true }
        });

        let total = 0, pending = 0, paid = 0, active = 0, expired = 0, rejected = 0;

        applications.forEach(app => {
            total++;
            const s = (app.status || "").toLowerCase();
            if (s === "pending") pending++;
            else if (s === "paid") paid++;
            else if (s === "active") active++;
            else if (s === "expired") expired++;
            else if (s === "rejected") rejected++;
            else pending++; // Default unknown to pending
        });

        // 2. Revenue Summary
        const invoices = await prisma.invoice.findMany({
            where: { status: 'PAID' },
            select: { amount: true }
        });

        const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

        return NextResponse.json({
            intelligence_type: "ORDER_FUNNEL_ANALYSIS",
            permission: "READ_ONLY",
            metrics: {
                total_orders: total,
                pending_count: pending,
                paid_count: paid,
                active_count: active,
                expired_count: expired,
                rejected_count: rejected,
                total_revenue_idr: totalRevenue
            },
            funnel_breakdown: {
                conversion_rate: total > 0 ? (((paid + active) / total) * 100).toFixed(2) + "%" : "0%",
                drop_off_rate: total > 0 ? (((pending + expired + rejected) / total) * 100).toFixed(2) + "%" : "0%"
            }
        });

    } catch (error: any) {
        console.error("AI Master Intelligence Error:", error);
        return NextResponse.json({ error: "Failed to generate intelligence report" }, { status: 500 });
    }
}
