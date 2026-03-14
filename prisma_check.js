const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- TABLE COLUMNS AUDIT ---");
  
  try {
    const columns = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position;
    `);
    console.log("Columns in public.users:", columns);

    const authUsers = await prisma.$queryRawUnsafe(`
        SELECT id, email FROM auth.users WHERE email = 'damnbayu@gmail.com'
    `);
    console.log("Admin in auth.users:", authUsers);

  } catch (err) {
    console.error("Audit Failed:", err.message);
  }

  console.log("--- AUDIT END ---");
  await prisma.$disconnect();
}

main();
