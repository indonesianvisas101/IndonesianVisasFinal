// @ts-ignore
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { VISA_DATABASE } from "@/constants/visas";

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
    // - This area now handles INTERNAL NOTES (Tax/Fee Breakdown) only for transparency
    const internalBreakdown = invoice.attribution?.internalNotes;
    // v6.1 - GRANULAR DATABASE SYNC (NO RE-CALCULATION)
    const baseProcessing = Number(invoice.invoice?.visaAmount || invoice.invoice?.serviceFee || 0);
    const addonsTotal = Number(invoice.invoice?.addonsAmount || 0);
    const qty = invoice.invoice?.quantity || invoice.quantity || 1;
    const baseTotal = baseProcessing * qty; // Total for the line item

    if (internalBreakdown) {
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("PAYMENT DETAILS & NOTES:", margin + 5, y);
        y += 4;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(grayText[0], grayText[1], grayText[2]);
        const splitInternal = doc.splitTextToSize(internalBreakdown, 100);
        doc.text(splitInternal, margin + 5, y);
        y += (splitInternal.length * 4);
    } else {
        y += 5;
    }

    doc.text(String(qty), 130, 121, { align: "center" });
    doc.text(`IDR ${baseProcessing.toLocaleString()}`, 160, 121, { align: "right" });
    doc.text(`IDR ${baseTotal.toLocaleString()}`, rightX - 5, 121, { align: "right" });



    // Adjust Y if description was long
    if (y < 135) y = 135;

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, rightX, y);

    // --- 4. TOTALS ---
    y += 10;
    const totalX = 140; // Label col X
    const valX = rightX - 5; // Value col X

    // v6.1 - GRANULAR DATABASE SYNC (NO RE-CALCULATION)
    const taxAmount = Number(invoice.invoice?.pph23Amount || 0);
    const gatewayFee = Number(invoice.invoice?.gatewayFee || 0);
    const grandTotal = Number(invoice.invoice?.amount || 0);

    doc.setFontSize(7);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Base Processing:", totalX, y);
    doc.text(`IDR ${baseTotal.toLocaleString()}`, valX, y, { align: "right" });
    y += 4;

    if (addonsTotal > 0) {
        doc.text("Add-On Services:", totalX, y);
        doc.text(`IDR ${addonsTotal.toLocaleString()}`, valX, y, { align: "right" });
        y += 4;
    }

    doc.text("Government Tax (PPh 23):", totalX, y);
    doc.text(`IDR ${taxAmount.toLocaleString()}`, valX, y, { align: "right" });
    y += 4;
    doc.text("Payment Gateway Fee:", totalX, y);
    doc.text(`IDR ${gatewayFee.toLocaleString()}`, valX, y, { align: "right" });
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Grand Total:", totalX, y);
    doc.text(`IDR ${grandTotal.toLocaleString()}`, valX, y, { align: "right" });
    
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    const usdEquiv = (grandTotal / 15900).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.text(`(Approx. $${usdEquiv} USD)`, valX, y, { align: "right" });

    // --- 4.5 PUBLIC NOTES GRID (Below Totals) ---
    const adminNotes = invoice.invoice?.adminNotes;
    if (adminNotes) {
        y += 15;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text("Admin Notes:", margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(grayText[0], grayText[1], grayText[2]);
        const splitNotes = doc.splitTextToSize(adminNotes, 100);
        doc.text(splitNotes, margin, y);
    }

    // --- 5. BOTTOM LAYOUT (QR LEFT, CONFIRMATION RIGHT) ---
    const bottomY = 240;
    const isPaid = ["Paid", "Active", "Review by Agent", "On Going", "Preparing for submission", "Submited", "Process by Immigration", "Approved"].includes(invoice.status);

    // Left: QR Code
    if (invoice.verification) {
        try {
            const verificationUrl = `${window.location.origin}/verify/${invoice.verification.slug}`;
            const qrDataUrl = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'M' });

            // Background box
            doc.setFillColor(245, 245, 255);
            doc.roundedRect(margin, bottomY - 10, 50, 45, 2, 2, 'F');

            // Image
            doc.addImage(qrDataUrl, 'PNG', margin + 10, bottomY - 5, 30, 30);

            // v4.8 - ENHANCED STATUS ABOVE QR (PDF)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
            doc.text("CHECK YOUR APPLICATION UPDATE BELLOW", margin + 25, bottomY - 20, { align: "center" });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(3, 105, 161); // Blue
            doc.text(`Status: ${invoice.status || 'Processing'}`, margin + 25, bottomY - 12, { align: "center" });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("VERIFIED DOCUMENT", margin + 25, bottomY + 30, { align: "center" });

        } catch (e) {
            console.error("QR Generation Error", e);
        }
    }

    // Right: Confirmation & Stamp
    const stampX = rightX - 40;
    const stampY = bottomY - 15;

    // Drawing the Stamp
    const stampColor = isPaid ? [86, 202, 0] : [239, 68, 68]; // Red for Unpaid
    doc.setDrawColor(stampColor[0], stampColor[1], stampColor[2]);
    doc.setLineWidth(1);
    doc.circle(stampX + 15, stampY + 15, 12, 'S'); // Circular Stamp with 'S' for stroke
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(stampColor[0], stampColor[1], stampColor[2]);
    doc.text(isPaid ? "PAID" : "UNPAID", stampX + 15, stampY + 16, { align: "center", angle: -15 });

    // Confirmation Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Confirm Payment to:", rightX, bottomY + 10, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("PT Indonesian Visas Agency™", rightX, bottomY + 15, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.line(rightX - 50, bottomY + 18, rightX, bottomY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("Authorized Official Invoice", rightX, bottomY + 22, { align: "right" });

    // --- 6. FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business. Please keep this invoice for your records.", pageWidth / 2, 290, { align: "center" });

    doc.save(`Invoice-${invoice.id.substring(0, 8)}.pdf`);
}
