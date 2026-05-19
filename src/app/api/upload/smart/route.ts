import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import sharp from 'sharp';

export async function POST(request: Request) {
    const supabase = await createAdminClient();
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
        const isWEBP = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
        const isHEIC = buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70;

        if (!isJPG && !isPNG && !isPDF && !isWEBP && !isHEIC) {
            return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP, HEIC, and PDF are allowed." }, { status: 400 });
        }

        let fileName = file.name;
        let contentType = file.type;

        // SMART PROCESSING MACHINE
        if (file.type.startsWith('image/')) {
            console.log(`SmartUpload: Converting ${file.name} (${file.type}) to WebP with High Compression...`);
            
            // Convert to WebP using Sharp - Aggressive 70% quality as requested
            const webpBuffer = await sharp(buffer)
                .webp({ 
                    quality: 70, // Targeted 30-50% reduction
                    effort: 6,   // Higher effort for better compression
                    lossless: false 
                })
                .toBuffer();
            
            buffer = webpBuffer;
            
            // Update metadata
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            fileName = `${baseName}.webp`;
            contentType = 'image/webp';
            
            console.log(`SmartUpload: Conversion complete. New size: ${(buffer.length / 1024).toFixed(2)} KB (Reduced by ${((1 - (buffer.length / file.size)) * 100).toFixed(0)}%)`);
        } 
        else if (file.type === 'application/pdf') {
            console.log(`SmartUpload: Hardening PDF ${file.name}...`);
            // Note: Native PDF compression in Node without Ghostscript is limited.
            // We ensure correct binary preservation and content-typing to avoid "HTML Mode" corruption.
            contentType = 'application/pdf'; 
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
