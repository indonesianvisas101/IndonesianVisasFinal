
// @ts-ignore
import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateInvoicePDF = async (invoice: any) => {
    const doc = new jsPDF();

    // --- COLORS ---
    const primaryColor = [145, 85, 253]; // #9155FD (Purple)
    const darkColor = [31, 41, 55]; // #1F2937
    const grayText = [107, 114, 128]; // #6B7280

    // --- LAYOUT CONSTANTS ---
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);

    // --- 1. HEADER ---
    let y = 25;

    // Top Left: Company Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("Indonesian Visas", margin, y);

    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("PT Indonesian Visas Agency™", margin, y);
    y += 5;
    doc.text("Jl. Tibungsari No.11C, Padangsambian Kaja", margin, y);
    y += 5;
    doc.text("Denpasar, Bali, Indonesia", margin, y);
    y += 5;
    doc.text("support@indonesianvisas.agency", margin, y);
    y += 5;
    doc.text("indonesianvisas.com", margin, y);

    // Top Right: INVOICE Label & Meta
    const rightX = pageWidth - margin;
    y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("INVOICE", rightX, y, { align: "right" });

    y += 8;
    doc.setFontSize(11);
    doc.text(`#${invoice.id.substring(0, 6).toUpperCase()}`, rightX, y, { align: "right" });

    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Date Issued:", rightX, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(new Date(invoice.appliedAt).toLocaleDateString(), rightX, y, { align: "right" });

    // --- 2. ADDRESSES (Bill To / Payable To) ---
    y = 70;
    const midX = pageWidth / 2;

    // Bill To (Left)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("BILL TO:", margin, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(invoice.user?.name || invoice.guestName || "Valued Customer", margin, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text(invoice.user?.email || invoice.guestEmail || "", margin, y);
    if (invoice.user?.address || invoice.guestAddress) {
        y += 5;
        doc.text(invoice.user?.address || invoice.guestAddress, margin, y);
    }

    // Payable To (Right) -- reset Y
    y = 70;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Payable To:", rightX, y, { align: "right" });

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("PT Indonesian Visas Agency™", rightX, y, { align: "right" });

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("BCA: 123-456-7890", rightX, y, { align: "right" });

    // Status Badge (Visual simulation text)
    y += 10;
    const status = invoice.status?.toUpperCase() || "PENDING";
    const statusColor = (status === 'PAID' || status === 'ACTIVE') ? [86, 202, 0] : [255, 180, 0];

    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(status, rightX, y, { align: "right" });


    // --- 3. TABLE ---
    y = 110;

    // Header Bg
    doc.setFillColor(249, 250, 252);
    doc.rect(margin, y, contentWidth, 10, 'F');

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

    doc.text("ITEM DESCRIPTION", margin + 5, y + 7);
    doc.text("QTY", 130, y + 7, { align: "center" });
    doc.text("PRICE", 160, y + 7, { align: "right" });
    doc.text("TOTAL", rightX - 5, y + 7, { align: "right" });

    // Items
    y += 16;
    const priceDisplay = invoice.customAmount || "By Quote";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(invoice.visaName || invoice.visaId, margin + 5, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Visa Processing & Administration Fee", margin + 5, y + 4);

    if (invoice.description) {
        doc.setFont("helvetica", "italic");
        const splitDesc = doc.splitTextToSize(invoice.description, 90);
        doc.text(splitDesc, margin + 5, y + 9);
    }

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("1", 130, y, { align: "center" });
    doc.text(priceDisplay, 160, y, { align: "right" });
    doc.text(priceDisplay, rightX - 5, y, { align: "right" });

    // Divider
    y += 20;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, rightX, y);

    // --- 4. TOTALS ---
    y += 10;
    const totalX = 140; // Label col X
    const valX = rightX - 5; // Value col X

    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Subtotal:", totalX, y);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(priceDisplay, valX, y, { align: "right" });

    y += 5;
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Tax (0%):", totalX, y);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("IDR 0", valX, y, { align: "right" });

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Total:", totalX, y);
    doc.text(priceDisplay, valX, y, { align: "right" });

    // --- 5. QR CODE (Bottom Centered) ---
    // Should appear if Verification data exists
    if (invoice.verification) {
        try {
            const verificationUrl = `${window.location.origin}/verify/${invoice.verification.slug}`;
            const qrDataUrl = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'M' });

            const qrY = 240;
            const centerX = pageWidth / 2;

            // Background box
            doc.setFillColor(245, 245, 255);
            doc.roundedRect(centerX - 30, qrY - 10, 60, 50, 2, 2, 'F');

            // Image
            doc.addImage(qrDataUrl, 'PNG', centerX - 15, qrY - 5, 30, 30);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("VERIFIED DOCUMENT", centerX, qrY + 30, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(grayText[0], grayText[1], grayText[2]);
            doc.text("Scan to verify authenticity", centerX, qrY + 35, { align: "center" });

        } catch (e) {
            console.error("QR Generation Error", e);
        }
    }

    // --- 6. FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business. Please keep this invoice for your records.", pageWidth / 2, 290, { align: "center" });

    doc.save(`Invoice-${invoice.id.substring(0, 8)}.pdf`);
}
