import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendOrderMail } from "@/utils/SendOrderMail";
import { sendOrderSMS } from "@/utils/SendOrderSMS";

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env ;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay keys in environment variables");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { message: "Missing required payment details." },
        { status: 400 }
      );
    }

    // Verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Retrieve order
    const order = await Order.findOne({ razorpayOrderId : razorpay_order_id });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    let paymentStatus = "Pending";
    if (payment.status === "captured") {
      paymentStatus = "Success";
    } else if (payment.status === "failed") {
      paymentStatus = "Failed";
    } else if (payment.status === "refunded") {
      paymentStatus = "Refunded";
    }

    // Update the order status
    order.paymentStatus = paymentStatus;
    order.razorpayPaymentId = razorpay_payment_id;

    // If payment is successful, update the status to "Completed"
    if (paymentStatus === "Success") {
      await sendOrderMail(
        order.name,
        order.email,
        order.phoneNumber,
        order.address,
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
        order.phoneNumber,
        order.address,
        order.razorpayOrderId
      );
    }
    await order.save();

    return NextResponse.json(
      { message: "Payment verified and order updated successfully.", status: paymentStatus },
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
