import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Applying Registration Fix (Robust)...");

        // 1. Drop existing Trigger & Function
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS public.handle_new_user;`);

        // 2. Re-create Function (Correcting target table to 'users' and columns)
        // SECURITY DEFINER: Runs with privileges of the creator (postgres)
        // SET search_path: Prevents search_path hijacking
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS TRIGGER 
            SECURITY DEFINER SET search_path = public
            AS $$
            BEGIN
              INSERT INTO public.users (id, email, name, role, status, created_at, updated_at)
              VALUES (
                new.id,
                new.email,
                new.raw_user_meta_data->>'name',
                COALESCE(new.raw_user_meta_data->>'role', 'user'),
                'active',
                NOW(),
                NOW()
              );
              RETURN new;
            EXCEPTION WHEN OTHERS THEN
              -- Log error but don't fail auth (optional, but good for debugging)
              RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
              RETURN new;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 3. Re-create Trigger
        await prisma.$executeRawUnsafe(`
            CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        `);

        console.log("Registration Trigger Fixed!");

        return NextResponse.json({
            status: "FIX_APPLIED",
            message: "Registration trigger updated to point to 'public.users' correctly with security settings."
        });
    } catch (error) {
        console.error("Fix failed:", error);
        return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
    }
}
