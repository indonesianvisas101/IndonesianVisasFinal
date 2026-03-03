import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const logs = await prisma.auditLog.findMany({
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.auditLog.count();

        return NextResponse.json({
            data: logs,
            total,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error: any) {
        console.error("Fetch audit logs error:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
