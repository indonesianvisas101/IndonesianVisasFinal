import { NextResponse } from 'next/server';
import { getSignedUrl } from '@/lib/storage';
import { getAdminAuth } from '@/lib/auth-helpers';

/**
 * API to sign a storage path on the fly for admin previews.
 * GET /api/admin/sign-url?path=...
 */
export async function GET(request: Request) {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');

        if (!path) {
            return NextResponse.json({ error: "Path required" }, { status: 400 });
        }

        // Clean path if it's already a full signed URL
        let cleanPath = path;
        if (path.startsWith('http') && path.includes('supabase.co')) {
            try {
                const urlObj = new URL(path);
                const parts = urlObj.pathname.split('/object/public/')?.[1] || urlObj.pathname.split('/object/sign/')?.[1];
                if (parts) cleanPath = parts;
            } catch {}
        }

        const signedUrl = await getSignedUrl(cleanPath);

        return NextResponse.json({ signedUrl });
    } catch (error: any) {
        console.error("[SignURL API] Error:", error.message);
        return NextResponse.json({ error: "Failed to sign URL" }, { status: 500 });
    }
}
