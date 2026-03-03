import { default as prisma } from "@/lib/prisma"; // Adjust based on true import path

/**
 * Validates the core AI Organization Environment Keys.
 * Returns true if valid to enter Production Mode, false if stuck in Dev/Maintenance mode.
 */
export async function validateAIGovernanceEnv(): Promise<boolean> {
    const sellerKey = process.env.OPENAI_API_KEY_SELLER;
    const internalKey = process.env.OPENAI_API_KEY_INTERNAL;

    console.log("[AI GOVERNANCE] Checking AI Execution Environment Integrity...");

    // 1. Check Existence
    if (!sellerKey || !internalKey) {
        console.error("[CRITICAL FAILURE] Missing AI API Keys. Seller and Internal keys must be explicitly defined.");
        return false;
    }

    // 2. Check Strict Separation (They cannot be the same key)
    if (sellerKey === internalKey) {
        console.error("[CRITICAL FAILURE] Constitution Violation: OPENAI_API_KEY_SELLER and OPENAI_API_KEY_INTERNAL cannot be identical.");
        return false;
    }

    // 3. Check Placeholder Status
    if (sellerKey.includes("PLACEHOLDER") || internalKey.includes("PLACEHOLDER")) {
        console.warn("[WARNING] Running in Temporary Development Mode. AI Keys are placeholders.");
        return false; // Still returning false for "production ready" status
    }

    // If we pass all above, the keys are valid and separated.
    console.log("[AI GOVERNANCE] Environment keys verified successfully.");
    return true;
}

/**
 * Automatically triggers validation and flips the DB mode if compliant.
 * Run this on application boot or via a secure admin endpoint.
 */
export async function enforceProductionModeStatus() {
    const isCompliant = await validateAIGovernanceEnv();

    // Try to find the singleton system state (id: 'singleton' per schema)
    const currentState = await prisma.aISystemState.findUnique({
        where: { id: "singleton" }
    });

    if (!currentState) {
        // initialize if it somehow doesn't exist yet
        await prisma.aISystemState.create({
            data: {
                id: "singleton",
                mode: isCompliant ? "normal" : "maintenance", // Or emergency
                systemHealthStatus: isCompliant ? "healthy" : "ENV_VALIDATION_FAILED"
            }
        });
        return isCompliant;
    }

    // If already exists, update accordingly
    if (isCompliant && currentState.mode === "maintenance") {
        console.log("[AI SYSTEM STATE] Promoting to Production (Normal) Mode.");
        await prisma.aISystemState.update({
            where: { id: "singleton" },
            data: {
                mode: "normal",
                systemHealthStatus: "healthy"
            }
        });
    } else if (!isCompliant && currentState.mode === "normal") {
        console.error("[AI SYSTEM STATE] Demoting to Maintenance Mode. Environment is invalid.");
        await prisma.aISystemState.update({
            where: { id: "singleton" },
            data: {
                mode: "maintenance",
                systemHealthStatus: "ENV_VALIDATION_FAILED"
            }
        });
    }

    return isCompliant;
}
