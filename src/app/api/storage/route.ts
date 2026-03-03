import { NextResponse } from 'next/server';

export async function HEAD() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            return new NextResponse(null, { status: 503 }); // Service Unavailable
        }

        // Real Connectivity Check
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(url, key);
        const { data, error } = await supabase.storage.listBuckets();

        if (error) throw error;

        return new NextResponse(null, { status: 200 }); // OK only if we can list buckets
    } catch (e) {
        return new NextResponse(null, { status: 500 }); // Internal Server Error
    }
}

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return NextResponse.json({
        status: url ? 'ok' : 'error',
        service: 'supabase-storage',
        configured: !!url
    });
}
