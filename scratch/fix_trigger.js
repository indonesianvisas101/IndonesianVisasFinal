const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixTrigger() {
    console.log("--- FIXING POSTGRESQL SIGNUP TRIGGER START ---");
    try {
        // Redefine the trigger function to insert into public.users with the correct column mappings
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS trigger AS $$
            BEGIN
              INSERT INTO public.users (id, email, name, avatar, role, status, created_at, updated_at)
              VALUES (
                new.id, 
                new.email, 
                COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), 
                COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
                CASE 
                  WHEN new.email = 'damnbayu@gmail.com' OR new.email = 'damnbayu@icloud.com' THEN 'admin'
                  ELSE 'user'
                END,
                'active',
                NOW(),
                NOW()
              )
              ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                name = COALESCE(EXCLUDED.name, public.users.name),
                avatar = COALESCE(EXCLUDED.avatar, public.users.avatar),
                updated_at = NOW();
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
        console.log("1. Trigger function public.handle_new_user re-created successfully.");

        // Re-create the trigger on auth.users
        await prisma.$executeRawUnsafe(`
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        `);
        console.log("2a. Old trigger dropped successfully.");

        await prisma.$executeRawUnsafe(`
            CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `);
        console.log("2b. Database trigger on_auth_user_created mapped to public.users successfully.");

        console.log("--- TRIGGER FIXED SUCCESSFULLY ---");
    } catch (err) {
        console.error("Failed to re-create database trigger:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixTrigger();
