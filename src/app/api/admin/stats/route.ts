import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET() {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const [userCount, appCount, activeVisas, revenueAggregate] = await Promise.all([
            prisma.user.count({ where: { role: 'user' } }),
            prisma.visaApplication.count(),
            prisma.visaApplication.count({ where: { status: 'Active' } }),
            prisma.invoice.aggregate({
                _sum: { amount: true },
                where: { status: 'PAID' }
            })
        ]);

        const totalRevenue = revenueAggregate._sum.amount ? Number(revenueAggregate._sum.amount) : 0;

        return NextResponse.json({
            users: { value: userCount.toString(), change: "+0%" },
            applications: { value: appCount.toString(), change: "+0%" },
            activeVisas: { value: activeVisas.toString(), change: "+0%" },
            revenue: { value: `IDR ${totalRevenue.toLocaleString()}`, change: "+0%" }
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
