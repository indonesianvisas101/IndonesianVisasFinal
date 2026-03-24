import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const invoices = await prisma.invoice.findMany({
    select: { status: true, amount: true },
    take: 20
  });
  console.log("Invoices Count:", invoices.length);
  console.log("Unique Statuses:", [...new Set(invoices.map(i => i.status))]);
  console.log("Sample Amounts:", invoices.map(i => `${i.status}: ${i.amount}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
