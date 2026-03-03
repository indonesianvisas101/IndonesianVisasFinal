import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ status: 'authenticated', user: { name: 'admin' } });
}
