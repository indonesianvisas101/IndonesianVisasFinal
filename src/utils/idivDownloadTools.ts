import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * v3.0 — CSS Injection Capture Strategy
 *
 * Problem with v1 (flattenForCapture):
 *   - MUI stores backfaceVisibility in CSS classes, not inline style.
 *     So `element.style.backfaceVisibility` is always empty — the check fails.
 *   - Framer Motion writes transform as matrix3d() inline; our override
 *     was applied but Framer Motion re-applied its value before paint.
 *
 * Problem with v2 (clone off-screen):
 *   - html-to-image uses foreignObject in SVG. Elements at x=-99999
 *     are outside the compositing region and render as blank.
 *
 * Solution (v3):
 *   - Inject a <style> tag using the element's ID with !important.
 *     This wins over both CSS classes AND Framer Motion inline styles.
 *   - Hide the sibling face so only the target face is visible.
 *   - Capture the original element (in-place, no clone).
 *   - Remove the style tag and restore sibling visibility.
 */

const OVERRIDE_STYLE_ID = '__idiv-capture-css';

function injectCaptureCSS(targetId: string): void {
    // Remove any existing override first
    document.getElementById(OVERRIDE_STYLE_ID)?.remove();

    const style = document.createElement('style');
    style.id = OVERRIDE_STYLE_ID;
    // Use !important to beat MUI class selectors AND Framer Motion inline matrix3d
    style.textContent = `
        #${targetId},
        #${targetId} * {
            transform: none !important;
            backface-visibility: visible !important;
            -webkit-backface-visibility: visible !important;
            transform-style: flat !important;
            -webkit-transform-style: flat !important;
            perspective: none !important;
            -webkit-perspective: none !important;
        }
    `;
    document.head.appendChild(style);
}

function removeCaptureCSS(): void {
    document.getElementById(OVERRIDE_STYLE_ID)?.remove();
}

/**
 * Capture a single card face cleanly.
 *
 * @param targetEl  The face element to capture (front or back).
 * @param siblingEl The other face element (will be hidden during capture).
 * @param nativeW   Native card width in px (before any CSS scale transform).
 * @param nativeH   Native card height in px.
 */
const captureCardFace = async (
    targetEl: HTMLElement,
    siblingEl: HTMLElement,
    nativeW: number,
    nativeH: number
): Promise<string> => {
    // 1. Hide the sibling so it doesn't bleed through
    const prevSiblingVisibility = siblingEl.style.visibility;
    siblingEl.style.visibility = 'hidden';

    // 2. Inject CSS that forces the target to render as flat 2D
    injectCaptureCSS(targetEl.id);

    // 3. Wait one frame so the browser re-paints with the overrides applied
    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => setTimeout(r, 80));

    try {
        const canvas = await toCanvas(targetEl, {
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            cacheBust: false,
            width: nativeW,
            height: nativeH,
            style: {
                // Belt-and-suspenders in case toCanvas has its own transform logic
                transform: 'none',
                backfaceVisibility: 'visible',
            },
            imagePlaceholder:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        });

        return canvas.toDataURL('image/png', 1.0);
    } finally {
        // 4. Always restore, even if capture throws
        removeCaptureCSS();
        siblingEl.style.visibility = prevSiblingVisibility;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API — same function signatures, nothing in callers needs to change
// ─────────────────────────────────────────────────────────────────────────────

export const downloadIDivDual = async (
    frontId: string,
    backId: string,
    fileName: string = 'Indonesian-Visa-IDiv',
    format: 'png' | 'pdf' = 'pdf'
) => {
    const frontEl = document.getElementById(frontId);
    const backEl  = document.getElementById(backId);

    if (!frontEl || !backEl) {
        alert('Card element not found. Please refresh the page and try again.');
        return;
    }

    // Native card size — read from the element's explicit inline style
    // (IDivCardModern sets width/height as explicit px on both faces)
    const nativeW = parseFloat(frontEl.style.width)  || frontEl.offsetWidth  || 384;
    const nativeH = parseFloat(frontEl.style.height) || frontEl.offsetHeight || 256;

    try {
        // Capture Front (hide Back during capture)
        const frontDataUrl = await captureCardFace(frontEl, backEl, nativeW, nativeH);

        // Brief pause to avoid overlapping GPU/compositor operations
        await new Promise(r => setTimeout(r, 200));

        // Capture Back (hide Front during capture)
        const backDataUrl = await captureCardFace(backEl, frontEl, nativeW, nativeH);

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [nativeW * 2, nativeH * 2],
            });
            pdf.addImage(frontDataUrl, 'PNG', 0, 0, nativeW * 2, nativeH * 2);
            pdf.addPage([nativeW * 2, nativeH * 2], 'landscape');
            pdf.addImage(backDataUrl,  'PNG', 0, 0, nativeW * 2, nativeH * 2);
            pdf.save(`${fileName}.pdf`);
        } else {
            // PNG — two separate files
            const download = (url: string, suffix: string) => {
                const link = document.createElement('a');
                link.download = `${fileName}-${suffix}.png`;
                link.href     = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            download(frontDataUrl, 'Front');
            setTimeout(() => download(backDataUrl, 'Back'), 500);
        }
    } catch (error: any) {
        console.error('IDiv Download Error:', error);
        alert(
            `Download failed: ${error?.message || 'Unknown error'}\n\n` +
            'Tip: Make sure you are using Chrome or Edge (latest version).'
        );
    }
};

// Single-side download — kept for any other pages that use this function
export const downloadIDiv = async (
    elementId: string,
    fileName: string = 'Indonesian-Visa-IDiv',
    format: 'png' | 'pdf' | 'jpeg' = 'png'
) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const nativeW = parseFloat(element.style.width)  || element.offsetWidth  || 384;
    const nativeH = parseFloat(element.style.height) || element.offsetHeight || 256;

    // For single-side, there's no sibling — use a dummy hidden element
    const dummy = document.createElement('div');
    dummy.style.visibility = 'hidden';

    try {
        injectCaptureCSS(element.id);
        await new Promise(r => requestAnimationFrame(r));
        await new Promise(r => setTimeout(r, 80));

        const canvas = await toCanvas(element, {
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            width: nativeW,
            height: nativeH,
        });
        const dataUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 1.0);
        removeCaptureCSS();

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [nativeW * 2, nativeH * 2],
            });
            pdf.addImage(dataUrl, 'PNG', 0, 0, nativeW * 2, nativeH * 2);
            pdf.save(`${fileName}.pdf`);
        } else {
            const link = document.createElement('a');
            link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : 'png'}`;
            link.href     = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error: any) {
        removeCaptureCSS();
        alert(`Download failed: ${error?.message || 'Unknown error'}`);
    }
};
