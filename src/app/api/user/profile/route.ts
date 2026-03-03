import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createBrowserClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        let authUser = null;

        // 1. Try cookie-based session first (standard SSR flow)
        try {
            const { data: { user } } = await supabase.auth.getUser();
            authUser = user;
        } catch { /* ignored */ }

        // 2. Fallback: read Bearer token from Authorization header
        // (hits right after login before the SSR cookie is committed)
        if (!authUser) {
            const authHeader = request.headers.get('authorization');
            const token = authHeader?.replace('Bearer ', '').trim();
            if (token) {
                try {
                    const anonClient = createBrowserClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                    );
                    const { data: { user } } = await anonClient.auth.getUser(token);
                    authUser = user;
                } catch { /* ignored */ }
            }
        }

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user profile using Prisma to bypass Supabase RLS
        const profile = await prisma.user.findUnique({
            where: { id: authUser.id }
        });

        if (!profile) {
            // User exists in Auth but not yet in public.users — return minimal profile
            return NextResponse.json({
                id: authUser.id,
                email: authUser.email,
                role: 'user',
                status: 'active',
                is_fallback: true
            });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("API Profile Fetch Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        let authUser = null;

        // 1. Try cookie-based session first
        try {
            const { data: { user } } = await supabase.auth.getUser();
            authUser = user;
        } catch { /* ignored */ }

        // 2. Fallback: read Bearer token from Authorization header
        if (!authUser) {
            const authHeader = request.headers.get('authorization');
            const token = authHeader?.replace('Bearer ', '').trim();
            if (token) {
                try {
                    const anonClient = createBrowserClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                    );
                    const { data: { user } } = await anonClient.auth.getUser(token);
                    authUser = user;
                } catch { /* ignored */ }
            }
        }

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Remove sensitive fields
        delete body.id;
        delete body.email;
        delete body.role;
        delete body.joinedAt;
        delete body.createdAt;

        // Update user profile via Prisma to bypass RLS - Use UPSERT to handle missing records
        const updatedProfile = await prisma.user.upsert({
            where: { id: authUser.id },
            update: body,
            create: {
                id: authUser.id,
                email: authUser.email!,
                name: body.name || '',
                whatsapp: body.whatsapp || '',
                role: 'user',
                status: 'active',
                ...body
            }
        });

        return NextResponse.json(updatedProfile);
    } catch (error: any) {
        console.error("API Profile Update Error:", error);
        return NextResponse.json({ error: 'Failed to update profile', details: error.message }, { status: 500 });
    }
}
