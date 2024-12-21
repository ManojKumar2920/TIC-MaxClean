import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendOrderMail } from "@/utils/SendOrderMail";
import { Document } from 'mongoose';
import { sendOrderSMS } from "@/utils/SendOrderSMS";

// Define an interface for the Order document
interface IOrder extends Document {
  name: string;
  email: string;
  service: string;
  timeSlot: string;
  price: number;
  date: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status?: string;
  paymentStatus?: string;
}

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET as string;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      timeSlot // Add timeSlot to the destructured object
    } = await req.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !timeSlot) {
      return NextResponse.json(
        { message: "Missing required payment details." },
        { status: 400 }
      );
    }

    // Verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Find the existing order with proper typing
    const order = await Order.findOne({ timeSlot }) as IOrder | null;

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Determine order status
    let orderStatus: string;
    switch (payment.status) {
      case "captured":
        orderStatus = "Success";
        break;
      case "failed":
      case "refunded":
        orderStatus = "Failed";
        break;
      case "authorized":
      case "created":
        orderStatus = "Pending";
        break;
      default:
        orderStatus = "Cancelled";
    }

    // Update order with payment details
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.status = orderStatus;
    order.paymentStatus = orderStatus;

    await order.save();

    // Send confirmation email for successful payments
    if (orderStatus === "Success") {
      await sendOrderMail(
        order.name,
        order.email,
        order.service,
        order.price,
        order.date,
        order.timeSlot,
        order.razorpayOrderId
      );

      await sendOrderSMS(
        order.name,
        order.service,
        order.price,
        order.date,
        order.timeSlot,
        order.razorpayOrderId
      )
    }



    return NextResponse.json(
      { 
        message: "Payment verified and order updated successfully.",
        status: orderStatus
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}