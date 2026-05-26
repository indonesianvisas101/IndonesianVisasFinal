import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        
        // 1. Unified Auth Check using the standard server client
        // This is more efficient than creating multiple clients
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
            // Fallback: Check if there's a bearer token for very recent logins
            const authHeader = request.headers.get('authorization');
            if (authHeader) {
                // If we have a header but cookie auth failed, it might be a race condition.
                // However, creating a browser client here is slow. 
                // We'll rely on the supabase server client which should handle it if the middleware is set up correctly.
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch user profile using Prisma
        // Added a timeout-like protection by using findUnique with a specific selection to speed it up
        let profile = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: {
                id: true,
                email: true,
                name: true,
                whatsapp: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!profile) {
            // Auto-heal/create missing profile in database (e.g. from Google Sign-In)
            const fallbackName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || '';
            const fallbackAvatar = authUser.user_metadata?.avatar_url || '';
            const fallbackWhatsapp = authUser.user_metadata?.phone || authUser.phone || '';
            
            // Auto-detect admin from metadata if present
            const isMetadataAdmin = authUser.user_metadata?.role === 'admin';

            const created = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    name: fallbackName,
                    avatar: fallbackAvatar,
                    whatsapp: fallbackWhatsapp,
                    role: isMetadataAdmin ? 'admin' : 'user',
                    status: 'active',
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    whatsapp: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            profile = created;
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
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Security: Remove sensitive fields
        const { id, email, role, createdAt, updatedAt, ...updateData } = body;

        // Update user profile via Prisma
        const updatedProfile = await prisma.user.upsert({
            where: { id: authUser.id },
            update: updateData,
            create: {
                id: authUser.id,
                email: authUser.email!,
                name: updateData.name || '',
                whatsapp: updateData.whatsapp || '',
                role: 'user',
                status: 'active',
                ...updateData
            }
        });

        return NextResponse.json(updatedProfile);
    } catch (error: any) {
        console.error("API Profile Update Error:", error);
        return NextResponse.json({ error: 'Failed to update profile', details: error.message }, { status: 500 });
    }
}
