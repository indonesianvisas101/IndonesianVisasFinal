import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getWorkerOrAdminAuth } from '@/lib/auth-helpers';
import { nameSimilarity } from '@/utils/fuzzyName';

export const dynamic = 'force-dynamic';

const FUZZY_THRESHOLD = 75;

export async function GET(request: Request) {
    try {
        const { authorized, error, status } = await getWorkerOrAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const name  = searchParams.get('name');

        console.log("Admin Fetch Arrival Cards - Email:", email, "| Name:", name);

        // --- STEP 1: Exact email match (fast path) ---
        let arrivalCards: any[] = [];

        if (email && email !== 'undefined' && email !== 'null') {
            const where: any = {
                OR: [
                    { formData: { path: ['email'], equals: email } },
                    { user: { email: email } }
                ]
            };

            arrivalCards = await prisma.arrivalCard.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        include: {
                            invoices: { orderBy: { createdAt: 'desc' }, take: 1 }
                        }
                    }
                }
            });
        }

        // --- STEP 2: Fuzzy name fallback if email lookup returns nothing ---
        let fuzzyResults: any[] = [];

        if (arrivalCards.length === 0 && name && name.trim().length > 2) {
            const allCards = await prisma.arrivalCard.findMany({
                orderBy: { createdAt: 'desc' },
                take: 500,
                include: {
                    user: {
                        include: {
                            invoices: { orderBy: { createdAt: 'desc' }, take: 1 }
                        }
                    }
                }
            });

            for (const card of allCards) {
                const fd = card.formData as any;
                const cardName: string =
                    fd?.fullName ||
                    fd?.name ||
                    card.user?.name ||
                    '';

                if (!cardName) continue;

                const score = nameSimilarity(name, cardName);
                if (score >= FUZZY_THRESHOLD) {
                    fuzzyResults.push({ ...card, _fuzzyScore: score, _matchedName: cardName });
                }
            }

            fuzzyResults.sort((a, b) => b._fuzzyScore - a._fuzzyScore);
        }

        // --- STEP 3: Batch enrich payment status (NO N+1) ---
        const batchEnrich = async (cards: any[]) => {
            if (cards.length === 0) return cards;

            // Collect all unique emails from cards (from formData or linked user)
            const emails = [...new Set(
                cards.map(c => c.formData?.email || c.user?.email).filter(Boolean)
            )] as string[];

            // Single batch query: get the latest invoice per email across all apps
            const latestInvoicesByEmail = await prisma.visaApplication.findMany({
                where: { guestEmail: { in: emails } },
                include: { invoices: { orderBy: { createdAt: 'desc' }, take: 1 } },
                orderBy: { appliedAt: 'desc' },
                distinct: ['guestEmail']
            });

            // Build email → paymentStatus map
            const paymentMap = new Map<string, string>();
            for (const app of latestInvoicesByEmail) {
                const appEmail = app.guestEmail;
                const invStatus = app.invoices?.[0]?.status;
                if (appEmail && invStatus) {
                    paymentMap.set(appEmail, invStatus);
                }
            }

            return cards.map(card => {
                const cardEmail = card.formData?.email || card.user?.email;
                // Use user's inline invoice first, then batch-fetched payment status
                const paymentStatus =
                    card.user?.invoices?.[0]?.status ||
                    (cardEmail ? paymentMap.get(cardEmail) : undefined) ||
                    'UNPAID';
                return { ...card, paymentStatus };
            });
        };

        // --- STEP 2.5: No filters? Return all (List mode) ---
        if (!email && !name) {
            const all = await prisma.arrivalCard.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
                include: {
                    user: {
                        include: {
                            invoices: { orderBy: { createdAt: 'desc' }, take: 1 }
                        }
                    }
                }
            });
            return NextResponse.json({
                mode: 'all',
                results: await batchEnrich(all)
            }, { headers: { 'Cache-Control': 'no-store' } });
        }

        if (arrivalCards.length > 0) {
            return NextResponse.json({
                mode: 'exact',
                results: await batchEnrich(arrivalCards)
            }, { headers: { 'Cache-Control': 'no-store' } });
        }

        if (fuzzyResults.length > 0) {
            return NextResponse.json({
                mode: 'fuzzy',
                results: await batchEnrich(fuzzyResults)
            }, { headers: { 'Cache-Control': 'no-store' } });
        }

        return NextResponse.json({ mode: 'none', results: [] }, {
            headers: { 'Cache-Control': 'no-store' }
        });

    } catch (error: any) {
        console.error("Admin Fetch Arrival Cards Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

