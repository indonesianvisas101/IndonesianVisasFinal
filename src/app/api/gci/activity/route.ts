import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // 1. Fetch Real-time High-Velocity Activities (Last 1h)
        const [recentVerifications, recentApplications] = await Promise.all([
            prisma.verification.findMany({
                where: { 
                    visaType: { contains: 'GCI' },
                    createdAt: { gte: oneHourAgo }
                },
                select: { nationality: true },
                take: 5
            }),
            prisma.visaApplication.findMany({
                where: {
                    visaName: { contains: 'GCI' },
                    appliedAt: { gte: oneHourAgo }
                },
                select: { userId: true },
                take: 5
            })
        ]);

        const realCount = recentVerifications.length + recentApplications.length;

        // 2. Real-Only Logic: If real activity is low, pull from 24h log
        if (realCount < 2) {
             const fallbackVerifications = await prisma.verification.findMany({
                where: { 
                    visaType: { contains: 'GCI' },
                    createdAt: { gte: twentyFourHoursAgo }
                },
                select: { nationality: true },
                take: 10
            });

            if (fallbackVerifications.length === 0) {
                // [MARKETING ALERT] Triggered when Zero GCI activity in 24h
                console.warn("[GCI AI Master] Zero Activity detected in last 24h. Marketing campaign suggested.");
                
                await prisma.notification.create({
                    data: {
                        title: "[MARKETING ALERT: ZERO GCI ACTIVITY]",
                        message: "Total GCI verifications and applications in the last 24 hours is zero. Strategic campaign trigger recommended.",
                        type: "warning",
                        actionLink: "/admin/analytics",
                        actionText: "Analyze Funnel"
                    }
                }).catch(() => {});

                return NextResponse.json({ data: [], type: 'zero-activity-alert' });
            }

            const displayData = fallbackVerifications.map(v => ({
                country: v.nationality || "Diaspora",
                action: "Just verified eligibility",
                count: 1
            }));

            return NextResponse.json({ data: displayData, type: '24h-fallback' });
        }

        // 3. Return Real-time Data
        const realData = recentVerifications.map(v => ({
            country: v.nationality || "Global",
            action: "Just secured GCI Verification",
            count: 1
        }));

        return NextResponse.json({ data: realData, type: 'real-time' });

    } catch (error) {
        console.error("[GCI Activity Error]:", error);
        return NextResponse.json({ data: [], status: 500 });
    }
}
