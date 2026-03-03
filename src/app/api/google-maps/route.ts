import { NextResponse } from 'next/server';

export async function GET() {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return NextResponse.json({
        status: key ? 'ok' : 'error',
        service: 'google-maps',
        configured: !!key
    });
}

export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
