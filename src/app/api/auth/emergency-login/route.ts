import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ALLOWED_ADMIN_EMAILS = ['damnbayu@gmail.com', 'bayu@indonesianvisas.com'];

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const masterPass = process.env.MASTER_SECRET_PASSPHRASE || 'BossBayu2026';

        // 1. Authorization: Only allow designated administrative emails with the correct master secret passphrase
        if (!ALLOWED_ADMIN_EMAILS.includes(trimmedEmail)) {
            return NextResponse.json({ error: 'Unauthorized email' }, { status: 401 });
        }

        if (password !== masterPass) {
            return NextResponse.json({ error: 'Invalid master credentials' }, { status: 401 });
        }

        console.log(`[EmergencyLogin] Initiating self-healing admin sync for: ${trimmedEmail}`);

        const adminClient = await createAdminClient();

        // 2. Query auth.users to see if user already exists
        const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
        
        if (listError) {
            console.error('[EmergencyLogin] Failed to list auth users:', listError.message);
            return NextResponse.json({ error: 'Auth service query failed', details: listError.message }, { status: 500 });
        }

        const existingUser = users.find(u => u.email?.toLowerCase() === trimmedEmail);
        let userId = '';

        if (existingUser) {
            userId = existingUser.id;
            console.log(`[EmergencyLogin] Found existing auth user: ${userId}. Syncing and updating password...`);
            
            // Update password, email_confirmed_at, and user_metadata
            const { error: updateError } = await adminClient.auth.admin.updateUserById(
                userId,
                {
                    password: password,
                    email_confirm: true,
                    user_metadata: {
                        full_name: 'Admin Bayu',
                        role: 'admin'
                    }
                }
            );

            if (updateError) {
                console.error('[EmergencyLogin] Failed to update existing user:', updateError.message);
                return NextResponse.json({ error: 'Failed to update credentials', details: updateError.message }, { status: 500 });
            }
        } else {
            console.log('[EmergencyLogin] Auth user not found. Creating a new admin user...');
            
            // Create a brand new admin user
            const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
                email: trimmedEmail,
                password: password,
                email_confirm: true,
                user_metadata: {
                    full_name: 'Admin Bayu',
                    role: 'admin'
                }
            });

            if (createError || !createdUser.user) {
                console.error('[EmergencyLogin] Failed to create new admin user:', createError?.message);
                return NextResponse.json({ error: 'Failed to create credentials', details: createError?.message }, { status: 500 });
            }

            userId = createdUser.user.id;
        }

        // 3. Perfect Database Sync: Upsert the administrative profile in Prisma
        console.log(`[EmergencyLogin] Syncing user profile to public database for UUID: ${userId}`);
        const updatedDbUser = await prisma.user.upsert({
            where: { id: userId },
            update: {
                email: trimmedEmail,
                name: 'Admin Bayu',
                role: 'admin',
                status: 'active',
                updatedAt: new Date()
            },
            create: {
                id: userId,
                email: trimmedEmail,
                name: 'Admin Bayu',
                role: 'admin',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log(`[EmergencyLogin] Sync completed successfully for public.users:`, updatedDbUser);

        return NextResponse.json({
            success: true,
            message: 'Administrative credentials healed and synchronized successfully. Proceeding with sign-in.',
            userId
        });

    } catch (error: any) {
        console.error('[EmergencyLogin] Unexpected exception occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
