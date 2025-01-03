import { NextResponse } from 'next/server';
import { sendOrderSMS } from '@/utils/SendOrderSMS';

export async function POST() {
  const testOrder = {
    name: "Test Customer",
    service: "Premium Wash", 
    price: 999,
    date: "2024-01-03",
    timeSlot: "10:00 AM",
    phone: "1234567890",
    address: "123 Test Street",
    razorpayOrderId: "test_order_123"
  };

  try {
    await sendOrderSMS(testOrder.name, testOrder.service, testOrder.price, testOrder.date, testOrder.timeSlot, testOrder.phone, testOrder.address, testOrder.razorpayOrderId);
    return NextResponse.json({ success: true, message: "Test SMS sent successfully" });
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send test SMS" },
      { status: 500 }
    );
  }
}
