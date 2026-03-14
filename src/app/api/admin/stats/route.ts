import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET() {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const [userCount, appCount, activeVisas] = await Promise.all([
            prisma.user.count({ where: { role: 'user' } }),
            prisma.visaApplication.count(),
            prisma.visaApplication.count({ where: { status: 'Active' } })
        ]);

        return NextResponse.json({
            users: { value: userCount.toString(), change: "+0%" },
            applications: { value: appCount.toString(), change: "+0%" },
            activeVisas: { value: activeVisas.toString(), change: "+0%" },
            revenue: { value: "$0", change: "+0%" } // Placeholder until Payment model exists
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
