// pages/api/payment/cancel-order.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { orderId } = await req.json();

    // Validate that all required fields are provided
    if ( !orderId) {
      return NextResponse.json(
        { message: "Missing required field :orderId" },
        { status: 400 }
      );
    }

    // Find the order using _id, timeSlot, and date
    const order = await Order.findOne({ _id: orderId});

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    order.paymentStatus = "Cancelled";

    await order.save();

    return NextResponse.json(
      { message: "Order status updated to Cancelled." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error },
      { status: 500 }
    );
  }
}
