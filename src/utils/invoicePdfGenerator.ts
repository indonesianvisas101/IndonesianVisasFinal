
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
    
    // Rich Bill To Info
    if (invoice.attribution?.phone) {
        y += 5;
        doc.text(invoice.attribution.phone, margin, y);
    }
    if (invoice.attribution?.country) {
        y += 5;
        doc.text(invoice.attribution.country, margin, y);
    }
    if (invoice.user?.address || invoice.guestAddress) {
        y += 5;
        doc.text(invoice.user?.address || invoice.guestAddress, margin, y);
    }

    // Indonesian Address for IDiv Support
    const verification = invoice.verification || (invoice.verificationId ? { address: "Placeholder" } : null); // Mock or real
    if (invoice.verification?.address || invoice.guestAddress) {
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("RESIDENTIAL ADDRESS (IDIV):", margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        const addr = invoice.verification?.address || invoice.guestAddress;
        const splitAddr = doc.splitTextToSize(addr, 80);
        doc.text(splitAddr, margin, y);
        y += (splitAddr.length * 4);
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

    // Corporate Bank Account (Standardized)
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    if (invoice.status === 'Paid' || invoice.status === 'Active') {
        doc.text("PAYMENT CAPTURED", rightX, y, { align: "right" });
    } else {
        doc.text("BCA: 6116-017850", rightX, y, { align: "right" });
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(grayText[0], grayText[1], grayText[2]);
        doc.text("Indonesian Visas Agency (SWIFT: CENAIDJA)", rightX, y, { align: "right" });
    }

    // Status Badge
    y += 8;
    const status = invoice.invoice?.status || invoice.status?.toUpperCase() || "PENDING";
    const statusColor = (status === 'PAID' || status === 'ACTIVE') ? [86, 202, 0] : [255, 180, 0];

    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    // Draw a small rect or just text
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(status, rightX, y, { align: "right" });


    // --- 3. TABLE ---
    y = 105;

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
    const activeAmount = invoice.invoice?.amount || invoice.customAmount || 0;
    const priceDisplay = activeAmount ? `IDR ${parseFloat(activeAmount).toLocaleString()}` : "By Quote";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(invoice.visaName || invoice.visaId, margin + 5, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text(`Processing & Administration (Applicant: ${invoice.guestName || invoice.user?.name || 'Customer'})`, margin + 5, y + 4);

    if (invoice.attribution?.totalTravelers > 1) {
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`GROUP BOOKING (#${invoice.attribution.orderIndex} of ${invoice.attribution.totalTravelers})`, margin + 5, y + 4);
        y -= 5;
    }

    // Invoice Description (From Admin)
    const adminDescription = invoice.invoice?.description || invoice.description;
    if (adminDescription) {
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        const splitDesc = doc.splitTextToSize(adminDescription, 100);
        doc.text(splitDesc, margin + 5, y);
        y += (splitDesc.length * 4);
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("1", 130, 121, { align: "center" }); // Pivot back to standard Y for totals
    doc.text(priceDisplay, 160, 121, { align: "right" });
    doc.text(priceDisplay, rightX - 5, 121, { align: "right" });

    // Adjust Y if description was long
    if (y < 135) y = 135;

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, rightX, y);

    // --- 4. TOTALS ---
    y += 10;
    const totalX = 140; // Label col X
    const valX = rightX - 5; // Value col X

    if (invoice.invoice?.serviceFee > 0) {
        doc.setFontSize(7);
        doc.setTextColor(grayText[0], grayText[1], grayText[2]);
        doc.text("Base Processing:", totalX, y);
        doc.text(`IDR ${parseFloat(invoice.invoice.serviceFee).toLocaleString()}`, valX, y, { align: "right" });
        y += 4;
        doc.text("Gov. Tax (2%):", totalX, y);
        doc.text(`IDR ${parseFloat(invoice.invoice.pph23Amount).toLocaleString()}`, valX, y, { align: "right" });
        y += 4;
        doc.text("Service Fee (4%):", totalX, y);
        doc.text(`IDR ${parseFloat(invoice.invoice.gatewayFee).toLocaleString()}`, valX, y, { align: "right" });
        y += 6;
    } else {
        doc.setTextColor(grayText[0], grayText[1], grayText[2]);
        doc.text("Subtotal:", totalX, y);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(priceDisplay, valX, y, { align: "right" });
        y += 10;
    }

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
