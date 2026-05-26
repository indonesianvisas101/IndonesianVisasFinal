const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditChatSystem() {
    try {
        console.log('=== CHAT SYSTEM AUDIT ===\n');

        // 1. RLS status
        console.log('Checking Row Level Security (RLS) status...');
        const rlsStatus = await prisma.$queryRawUnsafe(`
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' AND tablename IN ('conversations', 'messages', 'users');
        `);
        console.log(JSON.stringify(rlsStatus, null, 2));
        console.log('');

        // 2. RLS Policies
        console.log('Checking existing RLS policies...');
        const policies = await prisma.$queryRawUnsafe(`
            SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename IN ('conversations', 'messages', 'users');
        `);
        console.log(JSON.stringify(policies, null, 2));
        console.log('');

        // 3. Table Counts and Schema Check
        const convCount = await prisma.conversation.count();
        const msgCount = await prisma.message.count();
        console.log(`Conversations Count: ${convCount}`);
        console.log(`Messages Count: ${msgCount}`);
        
        // 4. Duplicate/Orphan Checks
        const orphans = await prisma.$queryRawUnsafe(`
            SELECT COUNT(*) as count 
            FROM "messages" 
            WHERE "conversation_id" NOT IN (SELECT "id" FROM "conversations");
        `);
        console.log(`Orphaned Messages Count: ${orphans[0].count}`);

    } catch (e) {
        console.error('Audit failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

auditChatSystem();
