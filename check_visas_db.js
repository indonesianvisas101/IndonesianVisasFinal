const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVisas() {
  try {
    const visas = await prisma.visa.findMany({
      where: {
        id: { in: ['B1', 'C1', 'C2', 'C12'] }
      }
    });
    console.log(JSON.stringify(visas, null, 2));
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkVisas();
