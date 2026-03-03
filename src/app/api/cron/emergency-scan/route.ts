import { NextResponse } from "next/server";
import { default as prisma } from "@/lib/prisma";

/**
 * Hourly Emergency Scan
 * Checks for severe risk anomalies or continuous failure states.
 * Auto-triggers Emergency Mode to lock down the worker queue.
 */
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.OPENAI_API_KEY_INTERNAL}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[EMERGENCY SCAN] Analyzing system stability...");

        // 1. Check for recent SEVERE risk alerts in the last 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const criticalLogs = await prisma.aIRiskLog.count({
            where: {
                riskLevel: "severe",
                createdAt: { gte: oneHourAgo }
            }
        });

        // 2. Check for recent execution failures in the last 1 hour
        const executionFailures = await prisma.aIExecutionLog.count({
            where: {
                status: "FAILED",
                executionTimestamp: { gte: oneHourAgo }
            }
        });

        const isEmergency = criticalLogs > 0 || executionFailures >= 3;

        if (isEmergency) {
            console.warn(`[EMERGENCY TRIGGER] Stability compromised. Severe Risks: ${criticalLogs}, Failures: ${executionFailures}`);

            await prisma.aISystemState.update({
                where: { id: "singleton" },
                data: {
                    mode: "emergency",
                    systemHealthStatus: "CRITICAL_LOCKDOWN"
                }
            });

            if ((global as any).io) {
                (global as any).io.emit("system_state", { mode: "emergency", systemHealthStatus: "CRITICAL_LOCKDOWN" });
                (global as any).io.emit("emergency_alert", {
                    message: "System automatically entered Emergency Lockdown due to severe instability.",
                    triggers: { criticalLogs, executionFailures }
                });
            }

            return NextResponse.json({ emergency_triggered: true, criticalLogs, executionFailures });
        }

        console.log("[EMERGENCY SCAN] System stable. No action taken.");
        return NextResponse.json({ emergency_triggered: false, status: "stable" });

    } catch (error) {
        console.error("[EMERGENCY SCAN ERROR]", error);
        return NextResponse.json({ error: "Scan Failed" }, { status: 500 });
    }
}
