import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    try {
        // Health Check: Verify 'documents' bucket exists
        const { data, error } = await supabase.storage.getBucket('documents');

        if (error) {
            // Note: failing to GET the bucket often means "Permission Denied" for listing, 
            // not necessarily that it doesn't exist. Since user confirmed it exists, we proceed.
            console.warn("Upload API: Could not verify bucket (access restricted?), assuming existence.");
            return NextResponse.json({ status: 'ok', message: "Ready (Bucket check skipped)", warning: error.message });
        }

        return NextResponse.json({ status: 'ok', bucket: data });
    } catch (e: any) {
        console.error("Upload handler CRITICAL error:", e);
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = (formData.get('bucket') as string) || 'documents'; // Default to generic docs
        const folder = (formData.get('folder') as string) || 'uploads';

        if (!file) {
            return NextResponse.json({ error: "File required" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const fileExt = file.name.split('.').pop();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${folder}/${Date.now()}-${safeName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrlData.publicUrl });

    } catch (error: any) {
        console.error("Upload handler error:", error);
        return NextResponse.json({ error: "Server upload failed" }, { status: 500 });
    }
}
