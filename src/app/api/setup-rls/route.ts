import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Enable RLS
        await prisma.$executeRawUnsafe(`ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;`);

        // Create Policies (Idempotent-ish)

        // CONVERSATIONS
        // User can view own
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view own conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can view own conversations" ON "conversations" FOR SELECT USING (auth.uid() = user_id);`);

        // User can insert own
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can insert own conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can insert own conversations" ON "conversations" FOR INSERT WITH CHECK (auth.uid() = user_id);`);

        // MESSAGES
        // User can view messages in their conversations
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view messages in own conversation" ON "messages";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can view messages in own conversation" ON "messages" 
            FOR SELECT USING (
                conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
            );
        `);

        // User can insert messages in their conversations
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can insert messages in own conversation" ON "messages";`);
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can insert messages in own conversation" ON "messages" 
            FOR INSERT WITH CHECK (
                conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
            );
        `);

        // ADMIN ACCESS (Bypass RLS via Service Role usually, but if client, need policy?)
        // Assuming admin uses same auth.uid but has role? 
        // For now, let's allow public access for demonstration if logged in? No, that's insecure.
        // Let's assume Admin Panel uses Client with specialized permissions OR Admin uses Prisma (API) which bypasses this.
        // Wait, Admin Chat Tab uses Realtime, so it needs RLS policy too!
        // We will add a policy for specific Admin UUIDs or just "Public for now" for testing if strict RLS fails?
        // Better: Allow anyone to read all for now until we have auth.role claim.
        // ACTUALLY: User-Dashboard Chat is the priority. Admin can use `prisma` via API updates but Realtime needs RLS.

        // Let's add a "View All" policy for later refinement
        // await prisma.$executeRawUnsafe(`CREATE POLICY "Allow All" ON "conversations" FOR ALL USING (true);`); 

        // GRANT PERMISSIONS
        // The error "permission denied for schema public" means anon/authenticated lost usage
        await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO anon, authenticated;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;`);
        await prisma.$executeRawUnsafe(`GRANT SELECT ON public.users TO anon, authenticated;`);

        // USERS table policies
        await prisma.$executeRawUnsafe(`ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view own profile" ON "users";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can view own profile" ON "users" FOR SELECT USING (auth.uid() = id);`);

        return NextResponse.json({ success: true, message: "RLS Policies and Schema Permissions Applied" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
