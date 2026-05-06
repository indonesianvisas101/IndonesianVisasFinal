import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url: imageUrl, name: fileName = 'document' } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
        }

        console.log(`[ConvertAPI] Starting conversion for: ${fileName}`);
        
        // 1. Fetch the original image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            console.error(`[ConvertAPI] Fetch failed: ${response.status} ${response.statusText}`);
            return NextResponse.json({ error: `Failed to fetch original image: ${response.statusText}` }, { status: response.status });
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Convert to JPG with Small Size optimization (75% quality)
        console.log(`[ConvertAPI] Processing image with Sharp...`);
        const optimizedJpg = await sharp(buffer)
            .jpeg({ 
                quality: 75, 
                progressive: true,
                mozjpeg: true // Better compression
            })
            .toBuffer();

        console.log(`[ConvertAPI] Conversion successful. Original: ${buffer.length} bytes, New: ${optimizedJpg.length} bytes`);

        // 3. Return as a download
        const finalFileName = fileName.replace(/\.[^/.]+$/, "") + ".jpg";
        
        return new NextResponse(new Uint8Array(optimizedJpg), {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="${finalFileName}"`,
                'Cache-Control': 'no-store'
            }
        });

    } catch (error: any) {
        console.error("[ConvertAPI] Fatal Error:", error);
        return NextResponse.json({ 
            error: "Conversion process crashed", 
            details: error.message 
        }, { status: 500 });
    }
}
