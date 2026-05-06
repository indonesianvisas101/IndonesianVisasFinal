import { NextResponse } from 'next/server';
import { TOPIC_SCHEDULER } from '@/ai/topic-discovery/topicScheduler';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    return handleTrigger(request);
}

export async function POST(request: Request) {
    return handleTrigger(request);
}

async function handleTrigger(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const internalKey = process.env.OPENAI_API_KEY_INTERNAL;
        const isInternal = authHeader === `Bearer ${internalKey}`;

        // Add internal validation or basic security if needed
        // For simplicity with a cron service, we might just allow it or use a secret key match.
        // Let's use internalKey verification for safety if they have it set up.
        // However, standard cron endpoints often use a fixed token.
        // To allow public crons without breaking security:
        const urlParams = new URL(request.url).searchParams;
        const cronKey = urlParams.get('key');
        const force = urlParams.get('force') === 'true';
        const expectedKey = process.env.CRON_KEY || 'ai-analytics-trigger-2026';

        if (!isInternal && cronKey !== expectedKey) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. ALWAYS Run Orchestration (Heartbeat)
        // This will process VVIP topics immediately if they exist.
        console.log("[CRON] AI Master Heartbeat Initiated...");
        await TOPIC_SCHEDULER.runDailyOrchestration(force);

        return NextResponse.json({
            success: true,
            message: "AI Master Heartbeat successful. VVIP checked and Orchestration handled.",
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("AI Analytics Cron Error:", error);
        return NextResponse.json({ error: "Analytics trigger failed", details: error.message }, { status: 500 });
    }
}
