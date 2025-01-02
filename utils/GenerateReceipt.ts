import jsPDF from 'jspdf';
import "jspdf-autotable";

interface Order {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  service: string;
  price: number;
  address: string;
  landmark: string;
  pincode: string;
  date: string;
  timeSlot: string;
  paymentStatus: string;
  createdAt: string;
}

export async function generateReceiptPDF(order: Order): Promise<Buffer> {
  const doc = new jsPDF();

  // Company Logo/Header
  doc.setFontSize(24); 
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); // Black
  doc.text('MAX', 20, 20);
  
  const maxWidth = doc.getTextWidth('MAX');
  doc.setTextColor(255, 0, 0); // Red
  doc.text('CLEAN', 20 + maxWidth, 20);
  
  // Reset text color to black for remaining content
  doc.setTextColor(0, 0, 0);
  
  // Company Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text([
    'MaxClean Professional Services',
    'Phone: +91-8179987444',
    'Email: maxcleanbusiness@gmail.com',
    'Website: www.themaxclean.com'
  ], 20, 30);

  // Invoice Title and Number
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 140, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Order id: ${order._id}`,
    `Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`,
    `Payment Status: ${order.paymentStatus}`
  ], 140, 30);

  // Add horizontal line after header
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 45, 190, 45);

  // Billing Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 20, 70);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text([
    order.name,
    order.email,
    order.phoneNumber,
    `${order.address}`,
    `${order.landmark}`,
    `${order.pincode}`
  ], 20, 80);

  // Service Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE DETAILS:', 20, 120);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text([
    `Service Date: ${order.date}`,
    `Time Slot: ${order.timeSlot}`
  ], 20, 130);

  // Create the invoice table
  const tableData = [
    [
      { content: 'DESCRIPTION', styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' } },
      { content: 'AMOUNT', styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' } }
    ],
    [order.service, order.price]
  ];

  (doc as any).autoTable({
    startY: 150,
    head: [tableData[0]],
    body: [tableData[1]],
    theme: 'grid',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 30, halign: 'right' }
    }
  });

  // Calculate final amounts
  const subtotal = order.price;
  const tax = 0;
  const total = subtotal ;

  // Add summary section with proper formatting
  const summaryStartY = (doc as any).autoTable.previous.finalY + 20;
  
  // Add a light gray background for the summary section
  doc.setFillColor(248, 248, 248);
  doc.rect(130, summaryStartY - 10, 60, 25, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Subtotal:`,
    `Tax:`,
    `Total:`
  ], 140, summaryStartY);

  // Align amounts to the right with proper currency formatting
  doc.text([
    subtotal.toLocaleString('en-IN'),
    tax.toLocaleString('en-IN'),
    total.toLocaleString('en-IN')
  ], 170, summaryStartY, { align: 'right' });

  // Add bottom border line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 270, 190, 270);

  // Footer with colored MaxClean
  doc.setFontSize(8);
  const thankYouText = 'Thank you for choosing ';
  const footerX = 105;
  const footerY = 280;
  
  // Calculate positions for centered text
  const thankYouWidth = doc.getTextWidth(thankYouText);
  const maxWidth2 = doc.getTextWidth('Max');
  const cleanWidth = doc.getTextWidth('Clean');
  const totalWidth = thankYouWidth + maxWidth2 + cleanWidth;
  const startX = footerX - (totalWidth / 2);
  
  // Write footer text in parts with different colors
  doc.setTextColor(100, 100, 100);
  doc.text(thankYouText, startX, footerY);
  doc.setTextColor(0, 0, 0);
  doc.text('Max', startX + thankYouWidth, footerY);
  doc.setTextColor(255, 0, 0);
  doc.text('Clean!', startX + thankYouWidth + maxWidth2, footerY);
  
  // Reset color and add contact line
  doc.setTextColor(100, 100, 100);
  doc.text('For any queries, please contact our customer support.', 105, footerY + 8, { align: 'center' });

  // Convert to Buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}