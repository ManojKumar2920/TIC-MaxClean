import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateReceiptPDF } from '@/utils/GenerateReceipt';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();

    const orderId = context.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return new Response('Order not found', { status: 404 });
    }

    if (order.paymentStatus !== 'Success') {
      return new Response('Receipt only available for successful payments', { 
        status: 400 
      });
    }

    const pdfBuffer = await generateReceiptPDF(order);

    // Use standard Response instead of NextResponse for better Blob handling
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${orderId}.pdf"`,
        // Add these headers to prevent caching
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return new Response('Internal server error', { status: 500 });
  }
}