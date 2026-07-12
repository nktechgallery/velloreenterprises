import { COMPANY } from './constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdfQuote = (items, subtotal, gst, total, orderNotes = '') => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('en-IN');
  const quoteNumber = `QT-${Math.floor(Math.random() * 1000000)}`;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(184, 0, 53);
  doc.text(COMPANY.name, 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${COMPANY.addressLine}, ${COMPANY.cityLine}`, 14, 28);
  doc.text(`Phone: ${COMPANY.phoneDisplay} | Email: ${COMPANY.email}`, 14, 34);

  // Quote Details
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('PROFORMA QUOTATION', 14, 50);

  doc.setFontSize(10);
  doc.text(`Date: ${date}`, 14, 58);
  doc.text(`Quote #: ${quoteNumber}`, 14, 64);

  // Table Data
  const tableColumn = ["S.No", "Description", "SKU", "Qty", "Unit Price (INR)", "Total (INR)"];
  const tableRows = [];

  items.forEach((item, index) => {
    const unitPrice = parseFloat(item.price) || 0;
    const lineTotal = unitPrice * item.quantity;
    const itemData = [
      index + 1,
      item.name,
      item.code || '-',
      item.quantity,
      unitPrice > 0 ? unitPrice.toLocaleString('en-IN') : 'TBD',
      lineTotal > 0 ? lineTotal.toLocaleString('en-IN') : 'TBD'
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    startY: 75,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [184, 0, 53], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 75 },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  const finalY = doc.lastAutoTable?.finalY || 75;

  // Pricing Summary
  if (subtotal > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 140, finalY + 10);
    doc.text(`INR ${subtotal.toLocaleString('en-IN')}`, 170, finalY + 10);

    doc.text('GST (18%):', 140, finalY + 18);
    doc.text(`INR ${gst.toLocaleString('en-IN')}`, 170, finalY + 18);

    doc.setFontSize(12);
    doc.setTextColor(184, 0, 53);
    doc.text('Total:', 140, finalY + 28);
    doc.text(`INR ${total.toLocaleString('en-IN')}`, 170, finalY + 28);
  }

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  let footerY = finalY + 45;
  if (orderNotes.trim()) {
    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer notes:', 14, footerY);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(orderNotes.trim(), 175);
    doc.text(noteLines, 14, footerY + 6);
    footerY += 12 + noteLines.length * 4;
  }
  doc.setTextColor(120, 120, 120);
  doc.text('Terms & Conditions:', 14, footerY);
  doc.text('1. Quote is valid for 15 days from the date of issue.', 14, footerY + 7);
  doc.text('2. Installation and delivery charges may apply based on site conditions.', 14, footerY + 13);
  doc.text('3. This is a computer generated document, no signature is required.', 14, footerY + 19);

  // Save the PDF
  doc.save(`${COMPANY.name.replace(/\s+/g, '_')}_Quote_${quoteNumber}.pdf`);
};
