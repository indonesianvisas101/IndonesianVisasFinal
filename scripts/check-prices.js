
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const visas = await prisma.visa.findMany({
    select: { id: true, name: true, price: true, fee: true }
  });
  console.log(JSON.stringify(visas, null, 2));
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
