import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key for Admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Fallback to anon for dev, but service role is better

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileName = `updates/${Date.now()}-${(file as any).name || 'image.webp'}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to 'public-assets' bucket
        const { data, error } = await supabase.storage
            .from('public-assets')
            .upload(fileName, buffer, {
                contentType: 'image/webp',
                upsert: true
            });

        if (error) {
            console.error("Supabase storage error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('public-assets')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
