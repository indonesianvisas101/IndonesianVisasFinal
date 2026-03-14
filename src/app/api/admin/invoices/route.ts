import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logAdminAction } from '@/lib/auditLogger';
import { getAdminAuth } from '@/lib/auth-helpers';

// GET /api/admin/invoices
// Lists all invoices (Legacy Apps + Real Invoices)
export async function GET(request: Request) {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const search = searchParams.get('search') || '';

        // 1. Fetch Real Invoices with User details
        // We use Prisma query
        const invoices = await prisma.invoice.findMany({
            take: limit,
            skip: offset,
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Map to unified format
        const formatted = invoices.map(inv => ({
            id: inv.id,
            invoiceNumber: `INV-${inv.id.slice(-6).toUpperCase()}`,
            customerName: inv.user?.name || 'Unknown',
            customerEmail: inv.user?.email,
            amount: inv.amount,
            status: inv.status,
            createdAt: inv.createdAt,
            type: 'HARDENED'
        }));

        return NextResponse.json({
            data: formatted,
            total: await prisma.invoice.count()
        });

    } catch (error: any) {
        console.error("Admin Invoices Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
