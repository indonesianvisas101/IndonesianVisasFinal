const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function applyRlsSecure() {
    try {
        console.log('=== APPLY SECURE RLS POLICIES & REALTIME ===\n');

        // 1. Enable RLS on conversations, messages, and users
        console.log('Enabling Row Level Security...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;`);
        console.log('✅ RLS Enabled successfully.');

        // 2. CONVERSATIONS POLICIES
        console.log('\nApplying policies on conversations table...');
        
        // SELECT
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view own conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can view own conversations" ON "conversations" FOR SELECT TO authenticated USING ("user_id" = auth.uid());`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can view all conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can view all conversations" ON "conversations" FOR SELECT TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        // INSERT
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can insert own conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can insert own conversations" ON "conversations" FOR INSERT TO authenticated WITH CHECK ("user_id" = auth.uid());`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can insert all conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can insert all conversations" ON "conversations" FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        // UPDATE
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can update own conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can update own conversations" ON "conversations" FOR UPDATE TO authenticated USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can update all conversations" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can update all conversations" ON "conversations" FOR UPDATE TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        // DELETE
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can delete any conversation" ON "conversations";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can delete any conversation" ON "conversations" FOR DELETE TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        console.log('✅ Conversations policies applied.');

        // 3. MESSAGES POLICIES
        console.log('\nApplying policies on messages table...');
        
        // SELECT
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view messages in own conversation" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can view messages in own conversation" ON "messages" FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid()));`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can view all messages" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can view all messages" ON "messages" FOR SELECT TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        // INSERT
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can insert messages in own conversation" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can insert messages in own conversation" ON "messages" FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid()));`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can insert messages" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can insert messages" ON "messages" FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        // UPDATE
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can update own messages" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can update own messages" ON "messages" FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid()));`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can update any message" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can update any message" ON "messages" FOR UPDATE TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        // DELETE
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can delete own messages" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can delete own messages" ON "messages" FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid()));`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can delete any message" ON "messages";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can delete any message" ON "messages" FOR DELETE TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        console.log('✅ Messages policies applied.');

        // 4. USERS POLICIES
        console.log('\nApplying policies on users table...');
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view own profile" ON "users";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Users can view own profile" ON "users" FOR SELECT TO authenticated USING (id = auth.uid());`);
        
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Admins can view all profiles" ON "users";`);
        await prisma.$executeRawUnsafe(`CREATE POLICY "Admins can view all profiles" ON "users" FOR SELECT TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');`);

        console.log('✅ Users policies applied.');

        // 5. Enable Realtime Publications
        console.log('\nActivating Supabase Realtime Publication...');
        await prisma.$executeRawUnsafe(`
            DO $$
            DECLARE
                pub_exists boolean;
            BEGIN
                -- Check if publication exists
                SELECT exists(SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') INTO pub_exists;
                IF NOT pub_exists THEN
                    CREATE PUBLICATION supabase_realtime;
                END IF;
                
                -- Safely add tables to publication if not already present
                BEGIN
                    ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
                EXCEPTION WHEN others THEN
                    RAISE NOTICE 'conversations already in publication';
                END;
                
                BEGIN
                    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
                EXCEPTION WHEN others THEN
                    RAISE NOTICE 'messages already in publication';
                END;
            END $$;
        `);
        console.log('✅ Realtime Publication configured.');

        // 6. Schema Grants and Permissions
        console.log('\nGranting database schema permissions...');
        await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO anon, authenticated;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;`);
        await prisma.$executeRawUnsafe(`GRANT SELECT ON public.users TO anon, authenticated;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON "conversations" TO authenticated;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON "messages" TO authenticated;`);
        console.log('✅ Izin akses database diperbarui.');

        console.log('\n=== SECURE RLS POLICIES & REALTIME COMPLETED SUCCESSFULLY ===');

    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

applyRlsSecure();
