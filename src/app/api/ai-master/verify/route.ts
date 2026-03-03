import { NextResponse } from 'next/server';

// Simple passphrase verification endpoint for the ChatBot widget
// Used to authenticate the @AI_Master mode switch
export async function POST(req: Request) {
    try {
        const { passphrase } = await req.json();
        const correctPass = process.env.MASTER_SECRET_PASSPHRASE || 'boss2026';
        if (!passphrase) return NextResponse.json({ valid: false }, { status: 400 });
        const isValid = passphrase === correctPass;
        return NextResponse.json({ valid: isValid }, { status: isValid ? 200 : 401 });
    } catch {
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
