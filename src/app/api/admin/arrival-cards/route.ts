import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        console.log("Admin Fetch Arrival Cards - Email:", email);

        const where: any = {};
        if (email && email !== 'undefined' && email !== 'null') {
            where.OR = [
                { formData: { path: ['email'], equals: email } },
                { user: { email: email } }
            ];
        }

        const arrivalCards = await prisma.arrivalCard.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        invoices: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        });

        // Manual cross-reference by email if user link is missing
        const enrichedCards = await Promise.all(arrivalCards.map(async (card: any) => {
            const email = card.formData?.email || card.user?.email;
            
            // If user link doesn't have invoice, search by email in VisaApplication -> Invoice
            let paymentStatus = card.user?.invoices?.[0]?.status || 'UNKNOWN';
            
            if (paymentStatus === 'UNKNOWN' && email) {
                const latestApp = await prisma.visaApplication.findFirst({
                    where: { guestEmail: email },
                    include: { invoices: { orderBy: { createdAt: 'desc' }, take: 1 } },
                    orderBy: { appliedAt: 'desc' }
                });
                paymentStatus = latestApp?.invoices?.[0]?.status || 'UNPAID';
            }

            return {
                ...card,
                paymentStatus
            };
        }));

        return NextResponse.json(enrichedCards);

        return NextResponse.json(arrivalCards);

    } catch (error: any) {
        console.error("Admin Fetch Arrival Cards Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
