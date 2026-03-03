import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ status: 'ok', service: 'auth-reset' });
}

export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
