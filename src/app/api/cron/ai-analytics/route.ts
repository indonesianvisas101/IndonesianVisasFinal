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
        const expectedKey = process.env.CRON_KEY || 'ai-analytics-trigger-2026'; // Fallback

        if (!isInternal && cronKey !== expectedKey) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch Schedule State from AIMasterMemory
        let scheduleMemory = await prisma.aIMasterMemory.findUnique({
            where: { memoryKey: 'next_analytics_run' }
        });

        const now = new Date();
        let nextRun: Date;

        if (!scheduleMemory) {
            // Initialize first run now
            nextRun = now;
        } else {
            nextRun = new Date((scheduleMemory.memoryValue as any).timestamp);
        }

        // 2. Check execution rule
        if (now >= nextRun) {
            console.log("[CRON] Running AI Analytics Orchestration cycle...");
            await TOPIC_SCHEDULER.runDailyOrchestration();

            // 3. Calculate Next Random Run (Randomized interval: 36 to 96 hours)
            // 36 hours (~1.5 days) MIN | 96 hours (~4 days) MAX
            const randomHours = Math.floor(Math.random() * (96 - 36 + 1)) + 36;
            const nextRunTimestamp = new Date(now.getTime() + randomHours * 60 * 60 * 1000);

            // 4. Save to Memory
            await prisma.aIMasterMemory.upsert({
                where: { memoryKey: 'next_analytics_run' },
                create: {
                    memoryKey: 'next_analytics_run',
                    memoryValue: { timestamp: nextRunTimestamp.toISOString(), intervalHours: randomHours }
                },
                update: {
                    memoryValue: { timestamp: nextRunTimestamp.toISOString(), intervalHours: randomHours }
                }
            });

            return NextResponse.json({
                success: true,
                message: "AI Analytics Orchestration executed successfully.",
                nextRun: nextRunTimestamp.toISOString(),
                intervalHours: randomHours
            });
        } else {
            return NextResponse.json({
                success: true,
                message: `Skipped. Execution schedule not reached yet.`,
                nextRun: nextRun.toISOString(),
                now: now.toISOString()
            });
        }

    } catch (error: any) {
        console.error("AI Analytics Cron Error:", error);
        return NextResponse.json({ error: "Analytics trigger failed", details: error.message }, { status: 500 });
    }
}
