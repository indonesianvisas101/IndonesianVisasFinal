
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- SEEDING ADMIN START ---");
  
  const adminId = '7ed7446d-80e8-41a2-a279-510833e64f76';
  const adminEmail = 'damnbayu@gmail.com';

  try {
    console.log(`Inserting admin ${adminEmail}...`);
    // Raw query to bypass any Prisma model issues and ensure UUID type
    await prisma.$executeRawUnsafe(`
        INSERT INTO "public"."users" 
        (id, email, role, status, name, created_at, updated_at)
        VALUES ($1::uuid, $2, 'admin', 'active', 'Admin Bayu', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'active';
    `, adminId, adminEmail);
    
    console.log("Admin seeded successfully.");

    // ALSO: Sync all current auth users to public.users to fix access for everyone
    console.log("Syncing remaining auth users...");
    await prisma.$executeRawUnsafe(`
        INSERT INTO "public"."users" (id, email, role, created_at, updated_at)
        SELECT id, email, 'user', created_at, updated_at
        FROM auth.users
        ON CONFLICT (id) DO NOTHING;
    `);
    console.log("User sync completed.");

  } catch (err) {
    console.error("Seeding Failed:", err.message);
  }

  console.log("--- SEEDING END ---");
  await prisma.$disconnect();
}

main();
