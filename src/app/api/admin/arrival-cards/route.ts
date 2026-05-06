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
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(arrivalCards);

        return NextResponse.json(arrivalCards);

    } catch (error: any) {
        console.error("Admin Fetch Arrival Cards Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
