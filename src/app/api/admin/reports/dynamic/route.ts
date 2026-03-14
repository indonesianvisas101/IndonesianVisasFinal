import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';
import { POPULAR_VISA_IDS } from '@/constants/visas';

/**
 * Dynamic Reporting API
 * Provides real-time data for Google Sheets integration.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const secret = req.headers.get('x-dynamic-report-secret');

    // 1. Auth Check (Admin Session OR Secret Header)
    const isSecretValid = secret && secret === process.env.DYNAMIC_REPORT_SECRET;
    
    if (!isSecretValid) {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: "Unauthorized access to report data" }, { status: 401 });
        }
    }

    try {
        switch (type) {
            case 'users':
                return NextResponse.json(await prisma.user.findMany({ 
                    orderBy: { createdAt: 'desc' },
                    select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
                }));
            
            case 'visas':
                return NextResponse.json(await prisma.visa.findMany({ 
                    orderBy: { category: 'asc' }
                }));

            case 'popular_visas':
                return NextResponse.json(await prisma.visa.findMany({
                    where: { id: { in: POPULAR_VISA_IDS } }
                }));

            case 'arrival_cards':
                return NextResponse.json(await prisma.arrivalCard.findMany({
                    orderBy: { createdAt: 'desc' }
                }));

            case 'orders':
                return NextResponse.json(await prisma.visaApplication.findMany({
                    orderBy: { appliedAt: 'desc' },
                    include: { user: { select: { email: true, name: true } } }
                }));

            case 'verification':
                return NextResponse.json(await prisma.verification.findMany({
                    orderBy: { createdAt: 'desc' }
                }));

            case 'invoicing':
                return NextResponse.json(await prisma.invoice.findMany({
                    orderBy: { id: 'desc' }
                }));

            case 'logs':
                return NextResponse.json(await prisma.auditLog.findMany({
                    take: 500,
                    orderBy: { createdAt: 'desc' }
                }));

            default:
                // Return overview/manifest if no type
                return NextResponse.json({ 
                    message: "Dynamic Report API Active", 
                    available_types: ['users', 'visas', 'popular_visas', 'arrival_cards', 'orders', 'verification', 'invoicing', 'logs']
                });
        }
    } catch (error: any) {
        console.error(`[ReportAPI] Error fetching ${type}:`, error);
        return NextResponse.json({ error: "Failed to aggregate report data", details: error.message }, { status: 500 });
    }
}
