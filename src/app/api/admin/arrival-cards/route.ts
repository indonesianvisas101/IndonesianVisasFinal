import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET() {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const cards = await prisma.arrivalCard.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(cards);
    } catch (error: any) {
        console.error("Failed to fetch arrival cards:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
