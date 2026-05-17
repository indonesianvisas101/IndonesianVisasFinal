import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Generates a signed URL for a private Supabase resource.
 * @param publicUrl - The public URL string or the full storage URL
 * @param expiresIn - Time in seconds until the URL expires (default 1 hour)
 * @returns The signed URL or the original URL if it's not a Supabase URL
 */
export async function getSignedUrl(publicUrl: string, expiresIn: number = 3600): Promise<string> {
    if (!publicUrl) return publicUrl;

    // Strip expired/contaminated signed URLs down to a raw storage path
    if (publicUrl.startsWith('http') && publicUrl.includes('supabase.co/storage/v1/object/')) {
        try {
            const urlObj = new URL(publicUrl);
            const objectPath = urlObj.pathname.split('/storage/v1/object/')[1];
            if (objectPath) {
                const parts = objectPath.split('/');
                if (['public', 'authenticated', 'sign'].includes(parts[0])) parts.shift();
                publicUrl = parts.join('/');
            }
        } catch {}
    }

    // v10.9.9 - SMART BUCKET DISCOVERY
    // If it's a raw path (doesn't start with http), construct a pseudo-Supabase URL to trigger the signing logic
    let targetUrl = publicUrl;
    if (!publicUrl.startsWith('http')) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const knownBuckets = ['applications', 'documents', 'quick_apply', 'verifications'];
        const firstSegment = publicUrl.split('/')[0];

        if (knownBuckets.includes(firstSegment)) {
            targetUrl = `${supabaseUrl}/storage/v1/object/sign/${publicUrl}`;
        } else {
            // Default to documents bucket if uncertain
            targetUrl = `${supabaseUrl}/storage/v1/object/sign/documents/${publicUrl}`;
        }
    }

    const isSupabase = targetUrl.includes('.supabase.co/storage/v1/object/');
    if (!isSupabase) return targetUrl;

    const urlWithoutParams = targetUrl.split('?')[0];

    try {
        const supabase = await createAdminClient();
        
        let pathWithBucket = "";
        if (urlWithoutParams.includes('/storage/v1/object/')) {
            // v11.1.3 - ULTIMATE EXTRACTOR: Look for the segment after the type (public/sign/authenticated)
            const parts = urlWithoutParams.split('/storage/v1/object/')[1].split('/');
            // If first part is a known type, skip it to get to the bucket
            if (['public', 'authenticated', 'sign'].includes(parts[0])) {
                parts.shift();
            }
            pathWithBucket = parts.join('/');
        } else {
            // Handle raw paths
            pathWithBucket = targetUrl.startsWith('/') ? targetUrl.substring(1) : targetUrl;
        }

        if (!pathWithBucket || !pathWithBucket.includes('/')) return targetUrl;

        const firstSlashIndex = pathWithBucket.indexOf('/');
        const bucket = pathWithBucket.substring(0, firstSlashIndex);
        const path = decodeURIComponent(pathWithBucket.substring(firstSlashIndex + 1));

        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) {
            // v13.0 - SMART FALLBACK: If not found and bucket is 'documents', retry with 'verifications/' prefix
            if ((error.message.includes('Object not found') || error.message.includes('not_found')) && bucket === 'documents' && !path.startsWith('verifications/')) {
                const fallbackPath = `verifications/${path}`;
                console.log(`[Storage] Retrying with verifications/ prefix: ${fallbackPath}`);
                const { data: fallback, error: fallbackError } = await supabase.storage
                    .from(bucket)
                    .createSignedUrl(fallbackPath, expiresIn);
                if (!fallbackError && fallback?.signedUrl) {
                    return fallback.signedUrl;
                }
            }
            if (error.message.includes('Object not found') || error.message.includes('Bad Gateway')) {
                return targetUrl;
            }
            console.error(`[Storage] Failed to create signed URL for ${targetUrl}:`, error.message);
            return targetUrl;
        }

        return data.signedUrl;
    } catch (err) {
        return targetUrl;
    }
}

/**
 * Utility to process a JSON object (like VisaApplication.documents) and replace all Supabase URLs with signed ones.
 */
export async function signDocumentUrls(documents: any): Promise<any> {
    if (!documents) return documents;
    
    // If it's a string, check if it's JSON or a URL
    if (typeof documents === 'string') {
        if (documents.trim().startsWith('{') || documents.trim().startsWith('[')) {
            try {
                const parsed = JSON.parse(documents);
                return await signDocumentUrls(parsed);
            } catch (e) {
                return await getSignedUrl(documents);
            }
        }
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
