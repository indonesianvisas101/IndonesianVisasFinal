import prisma from '../src/lib/prisma';
import { TOPIC_SCHEDULER } from '../src/ai/topic-discovery/topicScheduler';

async function main() {
    console.log("Triggering VVIP Queue Processing...");
    try {
        await TOPIC_SCHEDULER.runDailyOrchestration(true);
        console.log("Orchestration triggered successfully.");
    } catch (e) {
        console.error("Failed to trigger orchestration:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
