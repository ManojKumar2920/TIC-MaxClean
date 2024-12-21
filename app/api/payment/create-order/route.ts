import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Razorpay from "razorpay";

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay keys in environment variables");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const { service, timeSlot } = await req.json();

    // Validate required fields
    if (!service || !timeSlot) {
      return NextResponse.json(
        { message: "Service and time slot are required." },
        { status: 400 }
      );
    }
  

    // Calculate price based on service
    const servicePrices: Record<string, number> = {
      "Car foam wash": 679,
      "Car + Bike combo": 899,
      "Bi Weekly": 1199,
      "Weekly": 2199,
    };


    const price = servicePrices[service];
    if (!price) {
      return NextResponse.json(
        { message: "Invalid service selected." },
        { status: 400 }
      );
    }

    // Create an order in Razorpay
    const order = await razorpay.orders.create({
      amount: price * 100, // Razorpay accepts the amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `order_${new Date().getTime()}`,
      notes: {
        service,
        timeSlot,
      },
    });
    

    // Return the Razorpay order ID and the payment gateway key
    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: order.id,
        key: RAZORPAY_KEY_ID,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
