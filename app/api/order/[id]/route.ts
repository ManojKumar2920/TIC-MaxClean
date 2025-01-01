import { NextResponse } from 'next/server';
import { generateReceiptPDF } from '@/utils/GenerateReceipt';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get orderId from URL path
    const orderId = req.url.split('/').pop();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== 'Success') {
      return NextResponse.json(
        { message: 'Receipt only available for successful payments' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateReceiptPDF(order);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${orderId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
