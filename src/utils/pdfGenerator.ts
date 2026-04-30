// @ts-ignore
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface VerificationData {
    fullName: string;
    passportNumber: string;
    visaType: string;
    issuedDate: string;
    slug: string;
}

export const generateStatementPDF = async (data: VerificationData) => {
    const doc = new jsPDF();
    const verificationUrl = `${window.location.origin}/verify/${data.slug}`;

    // --- 1. GENERATE QR CODE ---
    let qrDataUrl = "";
    try {
        qrDataUrl = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H' });
    } catch (err) {
        console.error("QR Gen Error", err);
        alert("Failed to generate QR for PDF");
        return;
    }

    // --- 2. HEADER ---
    // Simple modern header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("INDONESIAN VISAS AGENCY", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Verified Visa Facilitation & Verification Service", 105, 26, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 32, 190, 32);

    // --- 3. TITLE ---
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("STATEMENT OF VISA AUTHENTICITY", 105, 50, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 65);

    // --- 4. BODY CONTENT ---
    doc.text("To Whom It May Concern,", 20, 80);

    const bodyText = `This letter serves to confirm that the following visa document has been processed and verified by the Indonesian Visas Agency database. The document details listed below match our internal records and are currently effectively valid.`;

    doc.text(doc.splitTextToSize(bodyText, 170), 20, 90);

    // --- 5. DETAILS TABLE ---
    // Simple manual positioning for cleanliness
    const startY = 115;
    const lineHeight = 10;

    doc.setFont("helvetica", "bold");
    doc.text("Full Name:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(data.fullName, 80, startY);

    doc.setFont("helvetica", "bold");
    doc.text("Passport Number:", 30, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(data.passportNumber, 80, startY + lineHeight);

    doc.setFont("helvetica", "bold");
    doc.text("Visa Type:", 30, startY + lineHeight * 2);
    doc.setFont("helvetica", "normal");
    doc.text(data.visaType, 80, startY + lineHeight * 2);

    doc.setFont("helvetica", "bold");
    doc.text("Issued Date:", 30, startY + lineHeight * 3);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(data.issuedDate).toLocaleDateString('en-GB'), 80, startY + lineHeight * 3);

    doc.setFont("helvetica", "bold");
    doc.text("Verification Status:", 30, startY + lineHeight * 4);
    doc.setTextColor(0, 128, 0); // Green
    doc.text("VALID (ACTIVE)", 80, startY + lineHeight * 4);
    doc.setTextColor(0, 0, 0); // Reset

    // --- 6. FOOTER / DISCLAIMER ---
    const footerY = 200;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);

    const disclaimer = "Note: This verification confirms the authenticity of the issued document facilitated by our agency. Final authority regarding entry and stay remains strictly with the Directorate General of Immigration of the Republic of Indonesia. Indonesian Visas provides administrative assistance. Final immigration approval remains the authority of the Indonesian government.";
    doc.text(doc.splitTextToSize(disclaimer, 120), 20, footerY);

    // --- 7. QR CODE ---
    // Bottom Right
    doc.addImage(qrDataUrl, 'PNG', 150, 190, 40, 40);
    doc.setFontSize(9);
    doc.text("Scan to Verify", 170, 235, { align: "center" });

    // --- 8. SAVE ---
    doc.save(`Statement-${data.slug}.pdf`);
};
