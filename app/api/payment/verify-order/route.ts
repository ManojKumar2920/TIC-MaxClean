import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendOrderMail } from "@/utils/SendOrderMail";
import { sendOrderSMS } from "@/utils/SendOrderSMS";
import { Document } from 'mongoose';

// Payment statuses from the Order model
type PaymentStatus = "Pending" | "Success" | "Cancelled" | "Failed" | "Refunded";

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
      timeSlot 
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

    // Find the existing order
    const order = await Order.findOne({ timeSlot });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Map Razorpay payment status to our PaymentStatus type
    let paymentStatus: PaymentStatus;
    switch (payment.status) {
      case "captured":
        paymentStatus = "Success";
        break;
      case "failed":
        paymentStatus = "Failed";
        break;
      case "refunded":
        paymentStatus = "Refunded";
        break;
      case "created":
      case "authorized":
        paymentStatus = "Pending";
        break;
      default:
        paymentStatus = "Cancelled";
    }

    // Update order with payment details
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = paymentStatus;

    // Only keep the order status as Pending if payment is successful
    // Otherwise, set it to Rejected
    if (paymentStatus !== "Success") {
      order.status = "Rejected";
    }

    await order.save();

    // Send confirmation email and SMS only for successful payments
    if (paymentStatus === "Success") {
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
      );
    }

    return NextResponse.json(
      { 
        message: "Payment verified and order updated successfully.",
        status: paymentStatus
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