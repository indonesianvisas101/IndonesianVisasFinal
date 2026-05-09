import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

interface AgreementData {
    fullName: string;
    passportNumber: string;
    nationality: string;
    address: string;
    phoneNumber: string;
    email: string;
    agreementText: string;
    signatureBase64: string;
    auditHash: string;
    signedAt: string;
    ipAddress: string;
    slug: string;
    output?: 'base64' | 'download';
}

export const generateAgreementPDF = async (data: AgreementData) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- 1. LETTERHEAD ---
    // Background Watermark (Lightened)
    // Note: We'll add text-based letterhead for maximum clarity
    
    // Header Logo Placeholder (If we had the base64, we'd use doc.addImage)
    // For now, let's use professional text styling for the header
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("PT INDONESIAN VISAS AGENCY", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("NIB: 0402260034806 | AHU-00065.AH.02.01.TAHUN 2020", pageWidth / 2, 25, { align: "center" });
    doc.text("Website: indonesianvisas.com | Email: info@indonesianvisas.com", pageWidth / 2, 29, { align: "center" });
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, 33, pageWidth - margin, 33);
    doc.setLineWidth(0.2);
    doc.line(margin, 34, pageWidth - margin, 34);

    // --- 2. DOCUMENT TITLE ---
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("SPONSORSHIP AND RESPONSIBILITY AGREEMENT", pageWidth / 2, 45, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.text("PERJANJIAN SPONSORSHIP DAN TANGGUNG JAWAB", pageWidth / 2, 51, { align: "center" });

    // --- 3. PARTIES SECTION ---
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text("Yang bertanda tangan dibawah ini / The undersigned:", margin, 62);

    // Table for Parties
    autoTable(doc, {
        startY: 65,
        margin: { left: margin },
        theme: 'plain',
        styles: { font: 'times', fontSize: 10, cellPadding: 1 },
        columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' }, 1: { cellWidth: 5 }, 2: { cellWidth: 'auto' } },
        body: [
            ['Nama Lengkap / Full Name', ':', data.fullName.toUpperCase()],
            ['Nomor Paspor / Passport No', ':', data.passportNumber],
            ['Kewarganegaraan / Nationality', ':', data.nationality],
            ['Alamat / Address', ':', data.address],
            ['Nomor Telepon / Phone', ':', data.phoneNumber],
            ['Email', ':', data.email],
        ]
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.setFont("times", "normal");
    doc.text("Selanjutnya disebut sebagai “PIHAK KEDUA” atau “CLIENT”.", margin, finalY + 10);
    doc.setFont("times", "italic");
    doc.text("Hereinafter referred to as the “SECOND PARTY” or “CLIENT”.", margin, finalY + 15);

    // --- 4. AGREEMENT CONTENT ---
    // Since agreementText might be long, we use a loop with page breaks
    const splitText = doc.splitTextToSize(data.agreementText, contentWidth);
    let currentY = finalY + 25;

    doc.setFont("times", "normal");
    doc.setFontSize(10);
    
    // Add text with simple pagination check
    splitText.forEach((line: string) => {
        if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20; // Reset Y on new page
            
            // Add small header on subsequent pages
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Sponsorship Agreement - ${data.fullName} - Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, 10, { align: "center" });
            doc.setFontSize(10);
            doc.setTextColor(0);
        }
        doc.text(line, margin, currentY);
        currentY += 5;
    });

    // --- 5. SIGNATURE SECTION ---
    if (currentY > pageHeight - 80) {
        doc.addPage();
        currentY = 20;
    }

    const signatureY = currentY + 20;
    doc.setFont("times", "normal");
    doc.text(`Denpasar, ${new Date(data.signedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - margin - 60, signatureY);
    doc.setFont("times", "bold");
    doc.text("PIHAK KEDUA / SECOND PARTY", pageWidth - margin - 60, signatureY + 7);

    // Add Signature Image
    if (data.signatureBase64) {
        doc.addImage(data.signatureBase64, 'PNG', pageWidth - margin - 60, signatureY + 10, 50, 20);
    }

    doc.text(`( ${data.fullName.toUpperCase()} )`, pageWidth - margin - 60, signatureY + 35);
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.text("Digitally Signed", pageWidth - margin - 60, signatureY + 39);

    // Sponsor Side
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.text("PT INDONESIAN VISAS AGENCY", margin, signatureY + 7);
    // Placeholder for stamp/official signature if needed
    doc.setFont("times", "normal");
    doc.text("Authorized Administrative Officer", margin, signatureY + 35);

    // --- 6. AUDIT TRAIL FOOTER (On Last Page) ---
    const footerY = pageHeight - 25;
    doc.setDrawColor(200);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(7);
    doc.setFont("courier", "normal");
    doc.setTextColor(120);
    doc.text(`DIGITAL FINGERPRINT (SHA-256): ${data.auditHash}`, margin, footerY);
    doc.text(`SIGNED AT: ${data.signedAt} | IP: ${data.ipAddress} | UUID: ${data.slug}`, margin, footerY + 4);
    doc.text("This document is cryptographically verified and immutable.", margin, footerY + 8);

    // QR Code for verification link
    const verificationUrl = `${window.location.origin}/verify/${data.slug}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);
    doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 20, footerY - 10, 20, 20);

    // --- 7. RETURN OR SAVE ---
    if (data.output === 'base64') {
        return doc.output('datauristring');
    }

    doc.save(`Sponsorship_Agreement_${data.fullName.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Generates the PDF and returns it as a base64 data URL string.
 * Used for automated archiving.
 */
export const getAgreementPDFBase64 = async (data: Omit<AgreementData, 'output'>) => {
    return await generateAgreementPDF({ ...data, output: 'base64' });
};
