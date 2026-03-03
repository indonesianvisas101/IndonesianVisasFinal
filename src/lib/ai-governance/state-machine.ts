import { NextResponse } from "next/server";

export type AIChangeState =
    | "draft"
    | "risk_review"
    | "master_review"
    | "boss_pending"
    | "approved"
    | "executed"
    | "reverted"
    | "rejected";

export type RiskScore = "low" | "medium" | "high" | "severe";

// Allowed transitions definition
const allowedTransitions: Record<AIChangeState, AIChangeState[]> = {
    draft: ["risk_review", "rejected"],
    risk_review: ["master_review", "rejected"],
    master_review: ["boss_pending", "rejected", "draft"], // back to draft if master demands rewrite
    boss_pending: ["approved", "rejected"],
    approved: ["executed", "rejected"],
    executed: ["reverted"],
    reverted: [],
    rejected: []
};

/**
 * Validates whether a state transition is allowed under the AI Constitution.
 */
export function validateStateTransition(
    currentState: AIChangeState,
    nextState: AIChangeState,
    riskScore?: RiskScore | null
): { valid: boolean; error?: string } {

    // 1. Check basic allowed vectors
    if (!allowedTransitions[currentState].includes(nextState)) {
        return {
            valid: false,
            error: `Constitution Violation: Invalid state transition from '${currentState}' to '${nextState}'. Skipping states is not allowed.`
        };
    }

    // 2. Severe Risk Override Rule
    if (currentState === "risk_review" && nextState === "master_review" && riskScore === "severe") {
        // We allow this, but the master_review stage MUST flag it for escalation to Boss.
        return { valid: true };
    }

    return { valid: true };
}

/**
 * Middleware utility to intercept API requests and enforce state Machine
 */
export function enforceStateTransitionMiddleware(
    currentState: AIChangeState,
    nextState: AIChangeState,
    riskScore?: RiskScore | null
) {
    const validation = validateStateTransition(currentState, nextState, riskScore);
    if (!validation.valid) {
        console.error(`[AI RISK FLAG] State Machine Violation detected: ${validation.error}`);
        return NextResponse.json(
            { error: validation.error, code: "CONSTITUTION_VIOLATION_STATE_MACHINE" },
            { status: 403 }
        );
    }
    return null; // Passes validation
}
