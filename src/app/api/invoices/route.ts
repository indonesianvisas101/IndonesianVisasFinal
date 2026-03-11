import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Use Prisma for consistency with applications

// GET: Fetch all "invoices" (Derived from Visa Applications)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('isAdmin') === 'true';
        const userId = searchParams.get('userId');

        // Build Query
        // We query 'visa_applications' acts as our Revenue Source
        let whereClause = '';
        const params: any[] = [];

        if (!isAdmin && userId) {
            const userMatch = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            if (userMatch?.email) {
                whereClause = 'WHERE "user_id" = $1::uuid OR "guestEmail" = $2';
                params.push(userId, userMatch.email);
            } else {
                whereClause = 'WHERE "user_id" = $1::uuid';
                params.push(userId);
            }
        }

        // We want Paid/Active items mostly for revenue, but let's return all and let frontend filter 'PAID' status.
        // In our case, 'Approved', 'Active', 'Valid' might be considered Paid.
        // Or strictly 'PAID' isn't a status?
        // Let's return raw status and let frontend handle logic? 
        // Frontend expects 'PAID' or similar status.
        // Let's map 'Approved'/'Active' -> 'PAID' for the chart?
        // Or just Keep Original Status. 
        // Admin Page RevenueChart filters by `i.status === 'PAID'`.
        // Wait, RevenueChart filters `i.status === 'PAID'`.
        // So I MUST map the status or update the chart.
        // If I update chart, I might break other things.
        // Better: Return status as 'PAID' if application is Approved/Active.

        const query = `
            SELECT * FROM "visa_applications" 
            ${whereClause}
            ORDER BY "appliedAt" DESC
        `;

        const applications: any[] = await prisma.$queryRawUnsafe(query, ...params);

        const formatted = applications.map(app => {
            // Determine if "Paid"
            // If status is 'Approved', 'Active', 'Valid' -> likely paid.
            // If 'Pending' -> not paid.
            let derivedStatus = 'PENDING';
            const s = (app.status || '').toUpperCase();
            if (['APPROVED', 'ACTIVE', 'VALID', 'COMPLETED', 'PAID'].includes(s)) {
                derivedStatus = 'PAID';
            } else if (s === 'REJECTED' || s === 'CANCELLED') {
                derivedStatus = 'FAILED';
            }

            return {
                id: app.id,
                invoiceNumber: `INV-${(app.slug || app.id).slice(0, 8).toUpperCase()}`,
                customerName: app.guestName || 'Customer',
                amount: parseFloat(app.customAmount || '0'),
                status: derivedStatus, // Mapped for RevenueChart compatibility
                originalStatus: app.status,
                createdAt: app.applied_at || app.appliedAt || new Date().toISOString()
            };
        });

        return NextResponse.json(formatted);

    } catch (error: any) {
        console.error("Fetch invoices error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create Invoice (Legacy/Fallback)
// If needed, we can keep it, but mostly we use applications/route.ts
export async function POST(request: Request) {
    return NextResponse.json({ error: "Use /api/applications to create invoices" }, { status: 400 });
}
