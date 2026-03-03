import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Simple DB Check
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok', database: 'connected' }, { status: 200 });
    } catch (e: any) {
        console.error("Health Check Failed", e);
        return NextResponse.json({ status: 'error', database: 'disconnected', error: e.message }, { status: 500 });
    }
}

export async function HEAD() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return new NextResponse(null, { status: 200 });
    } catch (e) {
        return new NextResponse(null, { status: 500 });
    }
}
