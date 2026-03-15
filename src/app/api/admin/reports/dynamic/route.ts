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
        // 2. Log Access (Auditing)
        if (isSecretValid) {
            await prisma.auditLog.create({
                data: {
                    adminId: "DYNAMIC_REPORT_API",
                    action: "EXPORT_REPORT",
                    entityType: type || "manifest",
                    metadata: { 
                        method: "SECRET_KEY",
                        type: type || "all",
                        ip: req.headers.get('x-forwarded-for') || "unknown"
                    }
                }
            });
        }

        switch (type) {
            case 'users':
                return NextResponse.json(await prisma.user.findMany({ 
                    orderBy: { createdAt: 'desc' },
                    select: { 
                        id: true, 
                        email: true, 
                        name: true, 
                        whatsapp: true,
                        role: true, 
                        status: true, 
                        createdAt: true,
                        last_activity_at: true
                    }
                }));
            
            case 'visas':
                return NextResponse.json(await prisma.visa.findMany({ 
                    orderBy: { category: 'asc' },
                    select: {
                        id: true,
                        category: true,
                        name: true,
                        price: true,
                        fee: true,
                        validity: true,
                        extendable: true,
                        createdAt: true
                    }
                }));

            case 'popular_visas':
                return NextResponse.json(await prisma.visa.findMany({
                    where: { id: { in: POPULAR_VISA_IDS } },
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        price: true
                    }
                }));

            case 'arrival_cards':
                return NextResponse.json(await prisma.arrivalCard.findMany({
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        fullName: true,
                        passportNumber: true,
                        arrivalDate: true,
                        flightNumber: true,
                        status: true,
                        createdAt: true
                    }
                }));

            case 'orders':
                return NextResponse.json(await (prisma.visaApplication as any).findMany({
                    orderBy: { appliedAt: 'desc' },
                    select: {
                        id: true,
                        slug: true,
                        userId: true,
                        visaName: true,
                        status: true,
                        quantity: true,
                        appliedAt: true,
                        guestName: true,
                        guestEmail: true,
                        user: { 
                            select: { 
                                email: true, 
                                name: true 
                            } 
                        } 
                    }
                }));

            case 'verification':
                return NextResponse.json(await prisma.verification.findMany({
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        fullName: true,
                        passportNumber: true,
                        visaType: true,
                        issuedDate: true,
                        status: true,
                        expiresAt: true,
                        slug: true
                    }
                }));

            case 'invoicing':
                return NextResponse.json(await (prisma.invoice as any).findMany({
                    orderBy: { id: 'desc' },
                    select: {
                        id: true,
                        amount: true,
                        serviceFee: true,
                        gatewayFee: true,
                        pph23Amount: true,
                        currency: true,
                        status: true,
                        paymentMethod: true,
                        createdAt: true,
                        paidAt: true,
                        userId: true,
                        applicationId: true
                    }
                }));

            case 'logs':
                return NextResponse.json(await prisma.auditLog.findMany({
                    take: 500,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        adminId: true,
                        action: true,
                        entityType: true,
                        metadata: true,
                        createdAt: true
                    }
                }));

            default:
                return NextResponse.json({ 
                    status: "Production Active", 
                    synchronized: true,
                    available_types: ['users', 'visas', 'popular_visas', 'arrival_cards', 'orders', 'verification', 'invoicing', 'logs']
                });
        }
    } catch (error: any) {
        console.error(`[ReportAPI] Error:`, error);
        return NextResponse.json({ error: "Failed to process production report" }, { status: 500 });
    }
}
