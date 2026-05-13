import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';
import { nameSimilarity } from '@/utils/fuzzyName';

const FUZZY_THRESHOLD = 75; // Minimum similarity % to be considered a match

export async function GET(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
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
            // Fetch recent arrival cards (last 500) and filter client-side via fuzzy
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

            // Sort by highest similarity first
            fuzzyResults.sort((a, b) => b._fuzzyScore - a._fuzzyScore);
        }

        // --- STEP 3: Enrich payment status for all results ---
        const enrich = async (cards: any[]) =>
            Promise.all(cards.map(async (card) => {
                const cardEmail = card.formData?.email || card.user?.email;
                let paymentStatus = card.user?.invoices?.[0]?.status || 'UNKNOWN';

                if (paymentStatus === 'UNKNOWN' && cardEmail) {
                    const latestApp = await prisma.visaApplication.findFirst({
                        where: { guestEmail: cardEmail },
                        include: { invoices: { orderBy: { createdAt: 'desc' }, take: 1 } },
                        orderBy: { appliedAt: 'desc' }
                    });
                    paymentStatus = latestApp?.invoices?.[0]?.status || 'UNPAID';
                }

                return { ...card, paymentStatus };
            }));

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
                results: await enrich(all)
            });
        }

        if (arrivalCards.length > 0) {
            return NextResponse.json({
                mode: 'exact',
                results: await enrich(arrivalCards)
            });
        }

        if (fuzzyResults.length > 0) {
            return NextResponse.json({
                mode: 'fuzzy',
                results: await enrich(fuzzyResults)
            });
        }

        return NextResponse.json({ mode: 'none', results: [] });

    } catch (error: any) {
        console.error("Admin Fetch Arrival Cards Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
