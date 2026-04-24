import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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

  const lastRiskScan = await prisma.aIRiskLog.findFirst({
      orderBy: { createdAt: 'desc' }
  });
  console.log("Last Risk Log Date:", lastRiskScan?.createdAt);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
