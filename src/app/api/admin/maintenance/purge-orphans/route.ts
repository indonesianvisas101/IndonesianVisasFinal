
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAdminClient } from '@/utils/supabase/admin';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const supabase = await createAdminClient();
        const buckets = ['quick_apply', 'documents', 'passports'];
        const allFiles: { bucket: string, path: string, url: string, size: number, lastModified: string }[] = [];

        // 1. List all files in targeted buckets
        for (const bucket of buckets) {
            const { data: folders, error: folderError } = await supabase.storage.from(bucket).list('', { limit: 100 });
            if (folderError) continue;

            for (const item of folders) {
                if (item.id === undefined) { // It's a folder
                    const { data: files, error: fileError } = await supabase.storage.from(bucket).list(item.name, { limit: 1000 });
                    if (fileError) continue;
                    
                    files.forEach(f => {
                        const path = `${item.name}/${f.name}`;
                        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
                        allFiles.push({
                            bucket,
                            path,
                            url: publicUrl,
                            size: f.metadata?.size || 0,
                            lastModified: f.metadata?.lastModified || new Date().toISOString()
                        });
                    });
                } else { // It's a file in root
                    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(item.name);
                    allFiles.push({
                        bucket,
                        path: item.name,
                        url: publicUrl,
                        size: item.metadata?.size || 0,
                        lastModified: item.metadata?.lastModified || new Date().toISOString()
                    });
                }
            }
        }

        // 2. Fetch all known URLs from Database
        const leads = await prisma.marketingLead.findMany({
            select: { passportUrl: true, photoUrl: true, additionalDocs: true }
        });
        
        const applications = await prisma.visaApplication.findMany({
            select: { documents: true }
        });

        const verifications = await prisma.$queryRawUnsafe(`SELECT "photoUrl" FROM "Verification"`) as any[];

        const knownUrls = new Set<string>();
        
        leads.forEach(l => {
            if (l.passportUrl) knownUrls.add(l.passportUrl.split('?')[0]);
            if (l.photoUrl) knownUrls.add(l.photoUrl.split('?')[0]);
            if (Array.isArray(l.additionalDocs)) {
                l.additionalDocs.forEach((d: any) => {
                    if (typeof d === 'string') knownUrls.add(d.split('?')[0]);
                });
            }
        });

        applications.forEach(a => {
            const docs = a.documents as any;
            if (docs && typeof docs === 'object') {
                const traverse = (obj: any) => {
                    if (typeof obj === 'string' && obj.includes('supabase.co')) {
                        knownUrls.add(obj.split('?')[0]);
                    } else if (Array.isArray(obj)) {
                        obj.forEach(traverse);
                    } else if (obj && typeof obj === 'object') {
                        Object.values(obj).forEach(traverse);
                    }
                };
                traverse(docs);
            }
        });

        verifications.forEach(v => {
            if (v.photoUrl) knownUrls.add(v.photoUrl.split('?')[0]);
        });

        // 3. Identify Orphans and Broken Links
        const storageUrlMap = new Set(allFiles.map(f => f.url.split('?')[0]));
        
        // Orphans: Files in storage but NOT in database
        const orphans = allFiles.filter(f => !knownUrls.has(f.url.split('?')[0]));
        
        // Broken Links: URLs in database but NOT in storage
        // Only check for URLs that belong to our scanned buckets
        const brokenLinks = Array.from(knownUrls).filter(url => {
            const isOurStorage = buckets.some(b => url.includes(`/storage/v1/object/public/${b}/`));
            return isOurStorage && !storageUrlMap.has(url);
        });

        return NextResponse.json({
            totalFiles: allFiles.length,
            knownUrlsCount: knownUrls.size,
            orphanCount: orphans.length,
            brokenLinksCount: brokenLinks.length,
            orphans: orphans.slice(0, 100), 
            brokenLinks: brokenLinks.slice(0, 100),
            totalOrphanSize: orphans.reduce((acc, f) => acc + f.size, 0)
        });

    } catch (error: any) {
        console.error("Purge Orphans Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const body = await request.json();
        const { files } = body; // Array of { bucket, path }

        if (!Array.isArray(files) || files.length === 0) {
            return NextResponse.json({ error: "No files specified" }, { status: 400 });
        }

        const supabase = await createAdminClient();
        const results = [];

        for (const file of files) {
            const { error: delError } = await supabase.storage
                .from(file.bucket)
                .remove([file.path]);
            
            results.push({
                path: file.path,
                success: !delError,
                error: delError?.message
            });
        }

        return NextResponse.json({ results, successCount: results.filter(r => r.success).length });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
