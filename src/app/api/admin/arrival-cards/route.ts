import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const arrivalCards = await prisma.arrivalCard.findMany({
            where: {
                OR: [
                    { formData: { path: ['email'], equals: email } },
                    { user: { email: email } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(arrivalCards);

    } catch (error: any) {
        console.error("Admin Fetch Arrival Cards Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
