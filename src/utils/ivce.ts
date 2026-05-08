/**
 * IVCE v1.0 - Indonesian Visas Compression Engine
 * Advance File Processing & Upload Utility
 * (c) 2026 Indonesian Visas Agency™
 */

export interface CompressionOptions {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
}

export const compressImage = async (file: File, options: CompressionOptions = {}): Promise<Blob> => {
    const { quality = 0.7, maxWidth = 1920, maxHeight = 1920 } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Advanced Resizing Logic
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error("Canvas context failed"));

                // High Quality Rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Compression failed"));
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export const uploadCompressedFile = async (file: File): Promise<string> => {
    let fileToUpload: Blob | File = file;

    // Only compress images
    if (file.type.startsWith('image/')) {
        console.log(`[IVCE] Compressing image: ${file.name}`);
        fileToUpload = await compressImage(file);
    } else {
        console.log(`[IVCE] Uploading file as is: ${file.name}`);
    }

    const formData = new FormData();
    formData.append('file', fileToUpload, file.name);

    const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
};
