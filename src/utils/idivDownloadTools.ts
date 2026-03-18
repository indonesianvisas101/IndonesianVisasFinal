import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Utility to download the IDiv card with high quality
 * @param elementId The ID of the HTML element to capture (e.g. 'idiv-front', 'idiv-back')
 * @param fileName The name for the downloaded file
 * @param format 'png' | 'jpeg' | 'pdf'
 */
export const downloadIDiv = async (
    elementId: string, 
    fileName: string = 'Indonesian-Visa-IDiv',
    format: 'png' | 'jpeg' | 'pdf' = 'png'
) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('IDiv element not found:', elementId);
        return;
    }

    try {
        // High quality scale (3x)
        const options = {
            pixelRatio: 3,
            backgroundColor: '#ffffff',
            cacheBust: true,
        };

        if (format === 'png') {
            const dataUrl = await toPng(element, options);
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } 
        else if (format === 'jpeg') {
            const dataUrl = await toJpeg(element, { ...options, quality: 0.95 });
            const link = document.createElement('a');
            link.download = `${fileName}.jpg`;
            link.href = dataUrl;
            link.click();
        }
        else if (format === 'pdf') {
            const dataUrl = await toPng(element, options);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [element.offsetWidth * 3, element.offsetHeight * 3]
            });
            
            pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth * 3, element.offsetHeight * 3);
            pdf.save(`${fileName}.pdf`);
        }
    } catch (error) {
        console.error('Failed to download IDiv:', error);
    }
};

/**
 * Download both sides of the IDiv card
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
        return;
    }

    try {
        const options = { pixelRatio: 3, backgroundColor: '#ffffff', cacheBust: true };
        
        // Temporarily override styles to fix mirroring for flat 2D capture
        const originalTransform = backEl.style.transform;
        const originalBackfaceVisibility = backEl.style.backfaceVisibility;
        
        backEl.style.transform = 'none'; 
        backEl.style.backfaceVisibility = 'visible';
        
        const frontDataUrl = await toPng(frontEl, options);
        const backDataUrl = await toPng(backEl, options);

        // Restore original flip transform
        backEl.style.transform = originalTransform;
        backEl.style.backfaceVisibility = originalBackfaceVisibility;

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [frontEl.offsetWidth * 3, frontEl.offsetHeight * 3]
            });
            
            // Page 1: Front
            pdf.addImage(frontDataUrl, 'PNG', 0, 0, frontEl.offsetWidth * 3, frontEl.offsetHeight * 3);
            
            // Page 2: Back
            pdf.addPage([frontEl.offsetWidth * 3, frontEl.offsetHeight * 3], 'landscape');
            pdf.addImage(backDataUrl, 'PNG', 0, 0, frontEl.offsetWidth * 3, frontEl.offsetHeight * 3);
            
            pdf.save(`${fileName}.pdf`);
        } else {
            // If PNG, we download them as two separate files or can we combine them?
            // Let's do two separate downloads for simplicity or use a canvas to combine.
            // But user said "Download for 2 side", suggesting a unified thing. 
            // PDF is best for this. For PNG, let's just trigger both.
            
            const linkF = document.createElement('a');
            linkF.download = `${fileName}-Front.png`;
            linkF.href = frontDataUrl;
            linkF.click();

            setTimeout(() => {
                const linkB = document.createElement('a');
                linkB.download = `${fileName}-Back.png`;
                linkB.href = backDataUrl;
                linkB.click();
            }, 300);
        }
    } catch (error) {
        console.error('Failed to download Dual IDiv:', error);
    }
}
