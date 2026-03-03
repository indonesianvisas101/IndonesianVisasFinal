import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

// Combined activity feed: execution logs + risk logs
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const profile = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true }
        });
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [executionLogs, riskLogs, systemState, sellerStats] = await Promise.all([
            prisma.aIExecutionLog.findMany({
                orderBy: { executionTimestamp: 'desc' },
                take: 25,
            }),
            prisma.aIRiskLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            prisma.aISystemState.findUnique({ where: { id: 'singleton' } }),
            (prisma as any).chatConversation.count({
                where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            })
        ]);

        // Merge and sort all activity
        const activityFeed = [
            ...executionLogs.map(log => ({
                id: log.id,
                type: 'execution' as const,
                agent: log.agentName,
                action: log.actionType,
                status: log.status,
                notes: log.notes,
                timestamp: log.executionTimestamp,
            })),
            ...riskLogs.map(log => ({
                id: log.id,
                type: 'risk' as const,
                agent: 'risk_guard',
                action: `Risk Scan (${log.scanType})`,
                status: log.riskLevel,
                notes: JSON.stringify(log.findings),
                timestamp: log.createdAt,
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 30);

        return NextResponse.json({
            activityFeed,
            summary: {
                systemMode: systemState?.mode || 'normal',
                systemHealth: systemState?.systemHealthStatus || 'healthy',
                lastRiskScan: systemState?.lastRiskScan || null,
                sellerChatsToday: sellerStats,
                pendingChanges: await prisma.aIChangeRequest.count({ where: { currentState: { in: ['draft', 'boss_pending', 'approved'] } } }),
            }
        });
    } catch (error: any) {
        console.error('Activity log error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
