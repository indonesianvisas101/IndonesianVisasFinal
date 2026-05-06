import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Generates a signed URL for a private Supabase resource.
 * @param publicUrl - The public URL string or the full storage URL
 * @param expiresIn - Time in seconds until the URL expires (default 1 hour)
 * @returns The signed URL or the original URL if it's not a Supabase URL
 */
export async function getSignedUrl(publicUrl: string, expiresIn: number = 3600): Promise<string> {
    if (!publicUrl) return publicUrl;

    // Support both /public/ and /authenticated/ patterns
    const isSupabase = publicUrl.includes('.supabase.co/storage/v1/object/');
    if (!isSupabase) return publicUrl;

    try {
        const supabase = await createAdminClient();
        
        let pathWithBucket = "";
        if (publicUrl.includes('/storage/v1/object/public/')) {
            pathWithBucket = publicUrl.split('/storage/v1/object/public/')[1];
        } else if (publicUrl.includes('/storage/v1/object/authenticated/')) {
            pathWithBucket = publicUrl.split('/storage/v1/object/authenticated/')[1];
        } else {
            // Fallback: try to extract after /object/
            pathWithBucket = publicUrl.split('/storage/v1/object/')[1];
            // Remove the first segment (which might be 'public' or 'authenticated' if not caught above)
            const segments = pathWithBucket.split('/');
            if (['public', 'authenticated'].includes(segments[0])) {
                segments.shift();
                pathWithBucket = segments.join('/');
            }
        }

        if (!pathWithBucket) return publicUrl;

        const firstSlashIndex = pathWithBucket.indexOf('/');
        if (firstSlashIndex === -1) return publicUrl;

        const bucket = pathWithBucket.substring(0, firstSlashIndex);
        const path = decodeURIComponent(pathWithBucket.substring(firstSlashIndex + 1));

        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) {
            console.error(`[Storage] Failed to create signed URL for ${publicUrl}:`, error.message);
            // If it's a "Bucket not found" error, maybe it's not a Supabase URL we can sign
            return publicUrl;
        }

        return data.signedUrl;
    } catch (err) {
        console.error(`[Storage] Error processing signed URL:`, err);
        return publicUrl;
    }
}

/**
 * Utility to process a JSON object (like VisaApplication.documents) and replace all Supabase URLs with signed ones.
 */
export async function signDocumentUrls(documents: any): Promise<any> {
    if (!documents) return documents;
    
    // If it's a string, try to sign it
    if (typeof documents === 'string') {
        return await getSignedUrl(documents);
    }

    // If it's an array, map over it
    if (Array.isArray(documents)) {
        return await Promise.all(documents.map(item => signDocumentUrls(item)));
    }

    // If it's an object, recurse
    if (typeof documents === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(documents)) {
            result[key] = await signDocumentUrls(value);
        }
        return result;
    }

    return documents;
}
