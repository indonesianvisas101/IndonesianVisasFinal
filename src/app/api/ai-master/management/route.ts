import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const internalKey = process.env.OPENAI_API_KEY_INTERNAL;
        const isInternal = authHeader === `Bearer ${internalKey}`;

        if (!isInternal) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const profile = await prisma.user.findUnique({
                where: { id: authUser.id },
                select: { role: true }
            });
            if (!profile || profile.role !== 'admin') {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Fetch System State
        let systemState = await prisma.aISystemState.findUnique({ where: { id: 'singleton' } });
        if (!systemState) {
            systemState = await prisma.aISystemState.create({
                data: { id: 'singleton', mode: 'normal' }
            });
        }

        // Fetch Pending Requests
        const pendingRequests = await prisma.aIChangeRequest.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Fetch Recent Risk Logs
        const riskLogs = await prisma.aIRiskLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Fetch Recent Execution Logs
        const executionLogs = await prisma.aIExecutionLog.findMany({
            orderBy: { executionTimestamp: 'desc' },
            take: 5
        });

        return NextResponse.json({
            systemState,
            pendingRequests,
            riskLogs,
            executionLogs
        });

    } catch (error: any) {
        console.error("AI Master Management Error:", error);
        return NextResponse.json({ error: "Failed to fetch management data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const profile = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true }
        });
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { action, data } = body;

        if (action === 'TOGGLE_MODE') {
            const newState = await prisma.aISystemState.update({
                where: { id: 'singleton' },
                data: { mode: data.mode }
            });
            return NextResponse.json(newState);
        }

        if (action === 'APPROVE_REQUEST') {
            const requestId = data.requestId;
            // 1. Mark as approved in DB
            await prisma.aIChangeRequest.update({
                where: { requestId },
                data: { currentState: 'approved' }
            });

            // 2. Trigger the AI Worker
            // Note: Since this is an admin action, we trigger the worker instantly
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const workerRes = await fetch(`${appUrl}/api/ai-worker/execute`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY_INTERNAL}`
                },
                body: JSON.stringify({ requestId })
            });

            const workerResult = await workerRes.json();
            return NextResponse.json({ success: workerRes.ok, ...workerResult });
        }

        if (action === 'REJECT_REQUEST') {
            const requestId = data.requestId;
            await prisma.aIChangeRequest.update({
                where: { requestId },
                data: { currentState: 'rejected' }
            });
            return NextResponse.json({ success: true, message: "Request rejected" });
        }

        if (action === 'RUN_ANALYTICS') {
            const { TOPIC_SCHEDULER } = await import('@/ai/topic-discovery/topicScheduler');
            await TOPIC_SCHEDULER.runDailyOrchestration();
            return NextResponse.json({ success: true, message: "AI Analytics Orchestration triggered successfully." });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("AI Master Management POST Error:", error);
        return NextResponse.json({ error: "Management action failed" }, { status: 500 });
    }
}
