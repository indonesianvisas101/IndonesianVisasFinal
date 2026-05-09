import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';

export interface PDFExportData {
    usersList?: any[];
    visas?: any[];
    stats?: any[];
}

export const generatePDF = async (
    type: 'users' | 'visas' | 'company' | 'invoicing' | 'stats' | 'revenue-3m' | 'revenue-6m' | 'revenue-1y',
    data: PDFExportData
) => {
    const doc = new jsPDF();
    let title = `Indonesian Visas - Report`;
    const timestamp = new Date().toLocaleString();

    let bodyData: (string | number)[][] = [];
    let headData: string[] = [];
    let summaryText = "";

    try {
        if (type === 'users') {
            title += " - User Data";
            headData = ['Name', 'Email', 'Role', 'Status', 'Visa', 'Expires'];
            bodyData = (data.usersList || []).map(u => [u.name, u.email, u.role, u.status, u.visa || '-', u.expires || '-']);
        } else if (type === 'visas') {
            title += " - Visa Database";
            headData = ['Visa Name', 'ID', 'Category', 'Validity', 'Price'];
            bodyData = (data.visas || []).map(v => [
                v.name,
                v.id,
                v.category,
                v.validity,
                typeof v.price === 'object' ? 'Multi' : v.price
            ]);
        } else if (type === 'company') {
            title += " - Company Services";
            headData = ['Category', 'Product', 'Package', 'Price'];
            const res = await fetch('/api/company-services?isAdmin=true');
            const services = await res.json();
            bodyData = services.map((s: any) => [s.category, s.name, s.package, formatCurrency(Number(s.price))]);
        } else if (type === 'invoicing') {
            title += " - All Invoices";
            headData = ['Invoice #', 'User', 'Amount', 'Status', 'Date'];
            const res = await fetch('/api/invoices?isAdmin=true');
            const invs = await res.json();
            bodyData = invs.map((i: any) => [
                i.invoiceNumber,
                i.customerName,
                formatCurrency(i.amount),
                i.status,
                new Date(i.createdAt).toLocaleDateString()
            ]);
        } else if (type === 'stats') {
            title += " - Statistics Overview";
            headData = ['Metric', 'Value', 'Change'];
            bodyData = (data.stats || []).map(s => [s.title, s.value, s.change]);
        } else if (type.startsWith('revenue')) {
            const range = type.replace('revenue-', ''); // 3m, 6m, 1y
            title += ` - Revenue Report (${range.toUpperCase()})`;

            headData = ['Date', 'Invoice #', 'User', 'Amount', 'Status'];
            const res = await fetch('/api/invoices?isAdmin=true');
            const allInvoices = await res.json();

            // Filter Logic
            const now = new Date();
            const pastDate = new Date();
            if (range === '3m') pastDate.setMonth(now.getMonth() - 3);
            else if (range === '6m') pastDate.setMonth(now.getMonth() - 6);
            else if (range === '1y') pastDate.setFullYear(now.getFullYear() - 1);

            const filtered = allInvoices.filter((i: any) => new Date(i.createdAt) >= pastDate && i.status === 'PAID');

            // Smart Calculation
            const totalRevenue = filtered.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
            const avgRevenue = filtered.length > 0 ? totalRevenue / filtered.length : 0;

            bodyData = filtered.map((i: any) => [
                new Date(i.createdAt).toLocaleDateString(),
                i.invoiceNumber,
                i.customerName,
                formatCurrency(i.amount),
                i.status
            ]);

            // Add Summary Row
            bodyData.push(['', '', 'TOTAL PERIOD REVENUE', formatCurrency(totalRevenue), '']);
            bodyData.push(['', '', 'AVERAGE / TXN', formatCurrency(avgRevenue), '']);

            summaryText = `Total Revenue: ${formatCurrency(totalRevenue)} | Txns: ${filtered.length}`;
        }

        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${timestamp}`, 14, 30);
        doc.text(`Company: Indonesian Visas (PT Antigravity)`, 14, 35);
        if (summaryText) {
            doc.setFont("helvetica", "bold");
            doc.text(summaryText, 14, 42);
            doc.setFont("helvetica", "normal");
        }

        autoTable(doc, {
            head: [headData],
            body: bodyData,
            startY: summaryText ? 48 : 45,
            theme: 'grid',
            headStyles: { fillColor: [145, 85, 253] }, // Brand Color
            didParseCell: function (cellData: any) {
                if (cellData.row.index >= bodyData.length - 2 && type.startsWith('revenue')) {
                    cellData.cell.styles.fontStyle = 'bold';
                    cellData.cell.styles.fillColor = [240, 240, 240];
                }
            }
        });

        doc.save(`report_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
        console.error("PDF Gen Error", e);
        throw e;
    }
};
