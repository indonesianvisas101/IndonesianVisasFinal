const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const memory = await prisma.aIMasterMemory.findUnique({
      where: { memoryKey: 'next_analytics_run' }
    });
    console.log("Next Analytics Run Memory:", JSON.stringify(memory, null, 2));

    const count = await prisma.knowledgePage.count();
    console.log("Total Knowledge Pages:", count);

    const lastPages = await prisma.knowledgePage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { slug: true, createdAt: true, published: true }
    });
    console.log("Last 5 Pages:", JSON.stringify(lastPages, null, 2));

    const lastChangeRequests = await prisma.aIChangeRequest.findMany({
        take: 5,
        where: { initiatedBy: 'analyst' },
        orderBy: { createdAt: 'desc' }
    });
    console.log("Last 5 Analyst Proposals:", JSON.stringify(lastChangeRequests, null, 2));

  } catch (error) {
    console.error("Diagnostic failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
