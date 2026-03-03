import { NextResponse } from "next/server";
import { default as prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.OPENAI_API_KEY_INTERNAL}`) {
            return NextResponse.json({ error: "Unauthorized AI Execution" }, { status: 401 });
        }

        console.log("[AI RISK] Starting compliance deep scan...");

        const findings: { category: string; level: string; note: string }[] = [];

        // 1. Scan visa DB for data integrity issues
        const visas = await prisma.visa.findMany();
        let missingPriceCount = 0;
        for (const visa of visas) {
            if (!visa.price || visa.price === '{}' || visa.price === 'null' || visa.price === '') {
                findings.push({ category: "data_integrity", level: "medium", note: `Visa "${visa.id}" (${visa.name}) has no price.` });
                missingPriceCount++;
            }
            if (!visa.fee || visa.fee === '{}') {
                findings.push({ category: "data_integrity", level: "low", note: `Visa "${visa.id}" has no fee.` });
            }
        }

        // 2. Check for stale change requests (stuck in draft > 48h)
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const staleRequests = await prisma.aIChangeRequest.findMany({
            where: { currentState: { in: ['draft', 'boss_pending'] }, createdAt: { lt: twoDaysAgo } }
        });
        if (staleRequests.length > 0) {
            findings.push({ category: "governance", level: "low", note: `${staleRequests.length} change request(s) stuck in draft/pending for >48 hours.` });
        }

        // 3. Scan recent seller conversations for complaints (keyword check)
        const recentChats = await (prisma as any).chatConversation.findMany({
            where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            take: 50,
        });
        const complaintKeywords = ['wrong price', 'expensive', 'scam', 'guarantee', 'refund problem', 'error'];
        let complaintCount = 0;
        for (const chat of recentChats) {
            const msgs = Array.isArray(chat.messages) ? chat.messages : [];
            for (const msg of msgs) {
                const content = String(msg.content || '').toLowerCase();
                if (complaintKeywords.some(kw => content.includes(kw))) {
                    complaintCount++;
                    break;
                }
            }
        }
        if (complaintCount > 0) {
            findings.push({ category: "customer_sentiment", level: complaintCount > 3 ? "high" : "medium", note: `${complaintCount} customer conversation(s) contain complaint keywords in the last 24 hours.` });
        }

        // 4. Check for recent execution failures
        const recentFailures = await prisma.aIExecutionLog.count({
            where: {
                status: 'FAILED',
                executionTimestamp: { gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }
            }
        });
        if (recentFailures > 0) {
            findings.push({ category: "execution", level: recentFailures > 2 ? "high" : "medium", note: `${recentFailures} execution failure(s) in the last 6 hours.` });
        }

        // Determine risk level
        const hasHigh = findings.some(f => f.level === 'high');
        const hasMedium = findings.some(f => f.level === 'medium');
        const riskLevel = hasHigh ? 'high' : hasMedium ? 'medium' : findings.length > 0 ? 'low' : 'nominal';

        // Persist to AIRiskLog
        const riskLog = await prisma.aIRiskLog.create({
            data: {
                scanType: "scheduled",
                findings: findings.length > 0 ? findings : [{ category: "general", level: "nominal", note: "No issues detected. All systems nominal." }],
                riskLevel
            }
        });

        // Update System State
        await prisma.aISystemState.update({
            where: { id: "singleton" },
            data: { lastRiskScan: new Date() }
        });

        return NextResponse.json({
            success: true,
            riskLevel,
            findingsCount: findings.length,
            logId: riskLog.id
        });

    } catch (error: any) {
        console.error("[AI RISK SCAN] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
