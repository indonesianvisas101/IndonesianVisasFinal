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

    // v8.99 - STRIP QUERY PARAMS: Ensure we only process the path, not existing tokens
    const urlWithoutParams = publicUrl.split('?')[0];

    try {
        const supabase = await createAdminClient();
        
        let pathWithBucket = "";
        if (urlWithoutParams.includes('/storage/v1/object/public/')) {
            pathWithBucket = urlWithoutParams.split('/storage/v1/object/public/')[1];
        } else if (urlWithoutParams.includes('/storage/v1/object/authenticated/')) {
            pathWithBucket = urlWithoutParams.split('/storage/v1/object/authenticated/')[1];
        } else {
            // Fallback: try to extract after /object/
            pathWithBucket = urlWithoutParams.split('/storage/v1/object/')[1];

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
            // v8.98 - SPEED PROTECTION: Immediately return original URL on common missing errors
            if (error.message.includes('Object not found') || error.message.includes('Bad Gateway')) {
                return publicUrl;
            }
            console.error(`[Storage] Failed to create signed URL for ${publicUrl}:`, error.message);
            return publicUrl;
        }

        return data.signedUrl;
    } catch (err) {
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

/**
 * Uploads a file (buffer or base64) to a Supabase bucket.
 * @param bucket - The destination bucket name
 * @param path - The destination path within the bucket
 * @param file - The file content as Buffer, ArrayBuffer, or base64 string
 * @param contentType - The MIME type of the file
 */
export async function uploadFile(
    bucket: string,
    path: string,
    file: Buffer | ArrayBuffer | string,
    contentType: string = 'application/pdf'
) {
    try {
        const supabase = await createAdminClient();
        
        let uploadData: Buffer | ArrayBuffer;
        if (typeof file === 'string' && file.includes(';base64,')) {
            // Extract actual base64 content if it's a data URL
            const base64Content = file.split(';base64,')[1];
            uploadData = Buffer.from(base64Content, 'base64');
        } else if (typeof file === 'string') {
            uploadData = Buffer.from(file, 'base64');
        } else {
            uploadData = file;
        }

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, uploadData, {
                contentType,
                upsert: true
            });

        if (error) {
            console.error(`[Storage] Upload failed for ${path}:`, error.message);
            throw error;
        }

        // Return the public URL or internal path
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        return urlData.publicUrl;
    } catch (err) {
        console.error('[Storage] Unexpected upload error:', err);
        throw err;
    }
}
