import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import sharp from 'sharp';

export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = (formData.get('bucket') as string) || 'documents';
        const folder = (formData.get('folder') as string) || 'uploads';

        // 1. Hardening: Size Limit (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (Max 5MB)" }, { status: 400 });
        }

        let buffer = Buffer.from(await file.arrayBuffer() as any);

        // 2. Hardening: Magic Number Validation (Verify file signature)
        const isJPG = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
        const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
        const isPDF = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;

        if (!isJPG && !isPNG && !isPDF) {
            return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and PDF are allowed." }, { status: 400 });
        }

        let fileName = file.name;
        let contentType = file.type;

        // SMART PROCESSING MACHINE
        if (file.type.startsWith('image/')) {
            console.log(`SmartUpload: Converting ${file.name} (${file.type}) to WebP...`);
            
            // Convert to WebP using Sharp
            const webpBuffer = await sharp(buffer)
                .webp({ quality: 80 }) // 80 is the sweet spot for web
                .toBuffer();
            
            buffer = webpBuffer;
            
            // Update metadata
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            fileName = `${baseName}.webp`;
            contentType = 'image/webp';
            
            console.log(`SmartUpload: Conversion complete. New size: ${(buffer.length / 1024).toFixed(2)} KB`);
        } 
        else if (file.type === 'application/pdf') {
            console.log(`SmartUpload: Processing PDF ${file.name}...`);
            // PDF compression can be added here in the future if needed
        }

        // Finalize File Name with Timestamp for uniqueness
        const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '');
        const finalPath = `${folder}/${Date.now()}-${safeName}`;

        // Upload optimized file to Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(finalPath, buffer, {
                contentType: contentType,
                upsert: true
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(finalPath);

        return NextResponse.json({ 
            url: publicUrlData.publicUrl,
            originalName: file.name,
            optimizedName: fileName,
            size: buffer.length,
            type: contentType
        });

    } catch (error: any) {
        console.error("SmartUpload handler error:", error);
        return NextResponse.json({ error: "Server upload processing failed" }, { status: 500 });
    }
}
