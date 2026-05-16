import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Helper: Flatten a single element to a clean 2D state for capture.
 * Returns a function to restore original styles.
 */
const flattenForCapture = (el: HTMLElement): (() => void) => {
    // Save all transforms we need to override on the element and all parents up to body
    const overrides: Array<{ el: HTMLElement; props: Record<string, string> }> = [];

    let current: HTMLElement | null = el;
    while (current && current !== document.body) {
        const computed = window.getComputedStyle(current);
        const saved: Record<string, string> = {};

        // Save and reset 3D-related styles that break capture
        const propsToReset = [
            'transform',
            'backfaceVisibility',
            'WebkitBackfaceVisibility',
            'transformStyle',
            'WebkitTransformStyle',
            'perspective',
        ];

        let needsOverride = false;
        for (const prop of propsToReset) {
            const val = (computed as any)[prop];
            if (val && val !== 'none' && val !== 'flat' && val !== '' && val !== '0px') {
                needsOverride = true;
            }
            saved[prop] = (current.style as any)[prop] || '';
        }

        if (needsOverride) {
            overrides.push({ el: current, props: saved });
            current.style.transform = 'none';
            current.style.backfaceVisibility = 'visible';
            (current.style as any).WebkitBackfaceVisibility = 'visible';
            current.style.transformStyle = 'flat';
            (current.style as any).WebkitTransformStyle = 'flat';
            current.style.perspective = 'none';
        }

        current = current.parentElement;
    }

    // Return restore function
    return () => {
        for (const { el, props } of overrides) {
            for (const [prop, val] of Object.entries(props)) {
                (el.style as any)[prop] = val;
            }
        }
    };
};

/**
 * Capture a single element as a PNG data URL.
 * Handles CORS images, scaling transforms, and 3D transforms properly.
 */
const captureElement = async (el: HTMLElement): Promise<string> => {
    // Use the element's natural scroll/offset dimensions (before any scaling)
    // We read the card's own width/height defined in its style (e.g. 384px)
    const styleWidth = parseFloat(el.style.width) || el.scrollWidth;
    const styleHeight = parseFloat(el.style.height) || el.scrollHeight;

    const restore = flattenForCapture(el);

    try {
        // Wait one frame for styles to apply
        await new Promise(r => requestAnimationFrame(r));

        const dataUrl = await toPng(el, {
            pixelRatio: 3,
            backgroundColor: '#ffffff',
            cacheBust: true,
            width: styleWidth,
            height: styleHeight,
            style: {
                // Ensure the element is rendered at its true size
                transform: 'none',
                transformOrigin: 'top left',
            },
            // Prevent cross-origin issues for external images
            fetchRequestInit: { credentials: 'omit', mode: 'cors' },
        });

        restore();
        return dataUrl;
    } catch (err) {
        restore();
        throw err;
    }
};

/**
 * Download both sides of the IDiv card as PNG or PDF.
 * Safely handles 3D transforms, CSS scaling, and cross-origin images.
 */
export const downloadIDivDual = async (
    frontId: string = 'idiv-front',
    backId: string = 'idiv-back',
    fileName: string = 'Indonesian-Visa-IDiv-Full',
    format: 'png' | 'pdf' = 'pdf'
) => {
    const frontEl = document.getElementById(frontId);
    const backEl = document.getElementById(backId);

    if (!frontEl || !backEl) {
        console.error('IDiv elements not found:', { frontId, backId });
        alert('Gagal: Elemen kartu tidak ditemukan. Pastikan preview kartu sudah tampil.');
        return;
    }

    try {
        // Capture front and back sequentially to avoid style conflicts
        const frontDataUrl = await captureElement(frontEl);
        const backDataUrl = await captureElement(backEl);

        const cardW = parseFloat(frontEl.style.width) || frontEl.scrollWidth;
        const cardH = parseFloat(frontEl.style.height) || frontEl.scrollHeight;

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [cardW * 3, cardH * 3],
            });

            // Page 1: Front
            pdf.addImage(frontDataUrl, 'PNG', 0, 0, cardW * 3, cardH * 3);

            // Page 2: Back
            pdf.addPage([cardW * 3, cardH * 3], 'landscape');
            pdf.addImage(backDataUrl, 'PNG', 0, 0, cardW * 3, cardH * 3);

            pdf.save(`${fileName}.pdf`);
        } else {
            // PNG: download front and back as two separate files
            const linkF = document.createElement('a');
            linkF.download = `${fileName}-Front.png`;
            linkF.href = frontDataUrl;
            linkF.click();

            await new Promise(r => setTimeout(r, 400));

            const linkB = document.createElement('a');
            linkB.download = `${fileName}-Back.png`;
            linkB.href = backDataUrl;
            linkB.click();
        }
    } catch (error: any) {
        console.error('Gagal download IDiv:', error);
        alert(`Gagal mengunduh kartu: ${error?.message || 'Unknown error'}.\n\nCoba refresh halaman dan buka preview kartu kembali.`);
    }
};

/**
 * Download satu sisi kartu IDiv (front atau back) saja.
 */
export const downloadIDiv = async (
    elementId: string,
    fileName: string = 'Indonesian-Visa-IDiv',
    format: 'png' | 'jpeg' | 'pdf' = 'png'
) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('IDiv element not found:', elementId);
        alert('Gagal: Elemen kartu tidak ditemukan.');
        return;
    }

    try {
        const dataUrl = await captureElement(element);
        const cardW = parseFloat(element.style.width) || element.scrollWidth;
        const cardH = parseFloat(element.style.height) || element.scrollHeight;

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [cardW * 3, cardH * 3],
            });
            pdf.addImage(dataUrl, 'PNG', 0, 0, cardW * 3, cardH * 3);
            pdf.save(`${fileName}.pdf`);
        } else {
            const link = document.createElement('a');
            link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : 'png'}`;
            link.href = dataUrl;
            link.click();
        }
    } catch (error: any) {
        console.error('Gagal download IDiv:', error);
        alert(`Gagal mengunduh kartu: ${error?.message || 'Unknown error'}.`);
    }
};
