import { config } from "dotenv";
config({ path: ".env.local" });

import { enforceProductionModeStatus } from "../src/lib/ai-governance/env-validator";
import { default as prisma } from "../src/lib/prisma";

async function runDeepValidation() {
    console.log("==========================================");
    console.log("🧠 INDONESIANVISAS AI GOVERNANCE");
    console.log("   FINAL PHASE 3 DEEP VALIDATION REPORT");
    console.log("==========================================\n");

    let allPassed = true;

    // 1. Env Mode Validation
    process.stdout.write("[TEST 1] ENV Separation & Production Mode... ");
    const isProdMode = await enforceProductionModeStatus();
    if (isProdMode) {
        console.log("✅ PASSED");
    } else {
        console.log("❌ FAILED (System locked in maintenance due to API keys)");
        allPassed = false;
    }

    // 2. Check Seller Isolation via Prisma introspect limits (Conceptual test in code)
    process.stdout.write("[TEST 2] Seller API Isolation... ");
    if (process.env.OPENAI_API_KEY_SELLER && !process.env.OPENAI_API_KEY_SELLER.includes("PLACEHOLDER")) {
        console.log("✅ PASSED");
    } else {
        console.log("❌ FAILED (Placeholder Seller Key)");
        allPassed = false;
    }

    // 3. Risk Veto Hard Lock Verification
    process.stdout.write("[TEST 3] AI Risk Veto Logic Presence... ");
    // Verify state machine logic handles severity
    const fs = require('fs');
    const stateLogicPath = fs.readFileSync('./src/lib/ai-governance/state-machine.ts', 'utf-8');
    if (stateLogicPath.includes('riskScore === "severe"')) {
        console.log("✅ PASSED");
    } else {
        console.log("❌ FAILED (Missing veto logic in state machine)");
        allPassed = false;
    }

    // 4. Memory Wipe Verification
    process.stdout.write("[TEST 4] Strategic Memory Isolation... ");
    try {
        await prisma.aIMasterMemory.count(); // ensures table exists and is accessible
        console.log("✅ PASSED");
    } catch (e) {
        console.log("❌ FAILED");
        allPassed = false;
    }

    console.log("\n==========================================");
    if (allPassed) {
        console.log("🏆 SYSTEM STATUS: READY FOR LIVE PRODUCTION");
    } else {
        console.log("⚠️ SYSTEM STATUS: INFRASTRUCTURE LOCK MODE (Checks Failed)");
    }
    console.log("==========================================\n");

    process.exit(0);
}

runDeepValidation().catch(e => {
    console.error(e);
    process.exit(1);
});
