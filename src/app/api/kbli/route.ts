import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        if (query.length < 2) {
            return NextResponse.json([]);
        }

        const kbliResults = await prisma.kbli.findMany({
            where: {
                OR: [
                    { code: { contains: query } },
                    { name: { contains: query } }
                ]
            },
            take: 20,
            orderBy: {
                code: 'asc'
            }
        });

        return NextResponse.json(kbliResults);
    } catch (error) {
        console.error("[KBLI_API_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
