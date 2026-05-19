import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ status: 'authenticated', user: { name: 'admin' } });
}

export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
