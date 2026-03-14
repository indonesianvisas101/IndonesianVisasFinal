
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const p = prisma as any;
        // 1. Fetch Funnel Metrics
        const totalLeads = await p.marketingLead.count();
        const convertedLeadsCount = await p.marketingLead.count({ where: { status: 'CONVERTED' } });
        
        // 2. Fetch Applications with Attribution
        const applications = await p.visaApplication.findMany({
            where: { attribution: { not: Prisma.JsonNull } },
            select: { attribution: true, status: true, customAmount: true }
        });

        // 3. Process Attribution Data
        const sourceMap: Record<string, { leads: number, conversions: number, revenue: number }> = {};
        
        applications.forEach((app: any) => {
            const attr = app.attribution;
            const source = attr?.utm_source || 'Organic/Direct';
            
            if (!sourceMap[source]) {
                sourceMap[source] = { leads: 0, conversions: 0, revenue: 0 };
            }
            
            sourceMap[source].leads++;
            if (app.status === 'Paid' || app.status === 'Approved' || app.status === 'Active') {
                sourceMap[source].conversions++;
                sourceMap[source].revenue += parseFloat(app.customAmount || '0') || 0;
            }
        });

        // 4. Fetch Recent Leads
        const recentLeads = await p.marketingLead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return NextResponse.json({
            funnel: {
                totalLeads,
                converted: convertedLeadsCount,
                abandoned: totalLeads - convertedLeadsCount
            },
            sources: Object.entries(sourceMap).map(([name, data]) => ({ name, ...data })),
            recentLeads
        });

    } catch (error) {
        console.error('Marketing API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
