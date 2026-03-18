
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";

const ADMIN_EMAILS = [
    'damnbayu@gmail.com'
];

export async function getAdminAuth() {
    const cookieStore = await cookies();
    const headerList = await headers();

    const authHeader = headerList.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    let user = null;
    let authError = null;

    if (token) {
        // Option A: Use Bearer Token from Header
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseHeader = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: { persistSession: false },
                global: { headers: { Authorization: `Bearer ${token}` } }
            }
        );
        const { data } = await supabaseHeader.auth.getUser();
        user = data.user;
    }

    if (!user) {
        // Option B: Fallback to Cookie
        const supabaseCookie = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value; },
                },
            }
        );
        const { data, error } = await supabaseCookie.auth.getUser();
        user = data.user;
        authError = error;
    }

    if (authError || !user) {
        return { authorized: false, error: "Unauthorized", status: 401 };
    }

    // Check email fallback for immediate admin access (Solves empty 'users' table issue)
    const isBossEmail = user.email && ADMIN_EMAILS.includes(user.email);

    // Try to find user in our public.users table
    let dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, role: true, email: true }
    });

    // AUTO-PROVISIONING: If found in auth but not in public.users, or if role is wrong but it's the boss
    if (!dbUser && isBossEmail) {
        console.log(`[AuthHelper] Auto-provisioning admin: ${user.email}`);
        try {
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email!,
                    role: 'admin',
                    status: 'active',
                    name: user.user_metadata?.full_name || 'Admin',
                }
            }) as any;
        } catch (e) {
            console.error("[AuthHelper] Provisioning failed:", e);
        }
    }

    const isAdmin = dbUser?.role === 'admin' || isBossEmail;

    if (!isAdmin) {
        return { authorized: false, error: "Forbidden: Admins only", status: 403 };
    }

    return { authorized: true, user: user, dbUser: dbUser };
}
