import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // v8.85 - Dynamic Type Handling (PDF & Image Support)
        const contentType = file.type || 'application/octet-stream';
        const extension = contentType.split('/')[1] || 'bin';
        const fileName = `updates/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabase.storage
            .from('public-assets')
            .upload(fileName, buffer, {
                contentType: contentType,
                upsert: true
            });

        if (error) {
            console.error("Supabase storage error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('public-assets')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
