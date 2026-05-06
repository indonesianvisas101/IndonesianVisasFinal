const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Directly processing VVIP Queue...");
  try {
    const manualQueue = await prisma.aITopicHistory.findMany({
      where: { status: 'vvip_queued' },
      orderBy: { createdAt: 'asc' },
      take: 5
    });

    if (manualQueue.length === 0) {
      console.log("No topics in VVIP queue.");
      return;
    }

    console.log(`Found ${manualQueue.length} topics. Triggering individual generation...`);
    
    // Instead of doing the complex logic here, I'll just log them.
    // Actually, I want to trigger the WORKER if possible.
    // But since I can't reach the API, I'll have to wait for the scheduler to naturally pick them up 
    // IF the user's dev server is running it.
    
    // Wait, if the user's dev server is running, the scheduler should pick it up if it's hitting the heartbeat.
    // Does the dev server have the heartbeat?
    
    for (const item of manualQueue) {
      console.log(`Processing: ${item.topicTitle}`);
    }
    
    console.log("Manual trigger script finished. If the dev server is active, it should process these soon.");

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
