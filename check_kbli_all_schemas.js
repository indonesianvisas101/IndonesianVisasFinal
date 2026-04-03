const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`SELECT schemaname, tablename FROM pg_catalog.pg_tables WHERE tablename ILIKE '%kbli%'`;
  console.log(JSON.stringify(tables, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
