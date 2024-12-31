import puppeteer from 'puppeteer';
import path from 'path';

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
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 40px auto;
      background: #ffffff;
      padding: 20px 60px 20px 60px;
      border-radius: 8px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 28px;
      color: #333333;
      margin: 0;
    }
    .header .invoice-info {
      text-align: right;
      font-size: 14px;
      color: #555555;
    }
    .customer-info, .order-details, .summary {
      margin-bottom: 20px;
    }
    .customer-info p, .order-details p {
      margin: 4px 0;
      font-size: 14px;
      color: #444444;
    }
    .section-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #222222;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      text-align: left;
      padding: 10px;
      border: 1px solid #ddd;
      font-size: 14px;
    }
    th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .summary {
      text-align: right;
    }
    .summary p {
      font-size: 14px;
      margin: 5px 0;
    }
    .total {
      font-size: 32px;
      font-weight: bold;
      color: #333333;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #777777;
    }
    .highlight {
      color: red;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container ">
    <div class="header">
      <div>
        <h1>MAX<span class="highlight">CLEAN</span></h1>
        <p>INVOICE</p>
      </div>
      <div class="invoice-info">
        <p>Invoice No: ${order._id}</p>
        <p>Date: ${new Date(order.createdAt || '').toLocaleDateString()}</p>
      </div>
    </div>
    <div class="customer-info">
      <p class="section-title text-2xl">Customer Information</p>
      <p><strong>${order.name}</strong></p>
      <p>${order.email}</p>
      <p>${order.phoneNumber}</p>
      <p>${order.address}, ${order.landmark}, ${order.pincode}</p>
    </div>
    <div class="order-details">
      <p class="section-title">Order Details</p>
      <p><strong>Service:</strong> ${order.service}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Time Slot:</strong> ${order.timeSlot}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>SERVICE</th>
          <th>PRICE</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${order.service}</td>
          <td>${order.price.toLocaleString()}/-</td>
          <td>${order.price.toLocaleString()}/-</td>
        </tr>
      </tbody>
    </table>
    <div class="summary">
      <p>Sub-total: ${order.price.toLocaleString()}/-</p>
      <p>Tax: 0</p>
      <p class="total">Total: ${order.price.toLocaleString()} INR</p>
    </div>
    <div class="footer">
      <p>Thank you for choosing MaxClean!</p>
    </div>
  </div>
</body>
</html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });
  await browser.close();

  return Buffer.from(pdfBuffer);
}
