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
    await connectDB();
    const { orderId } = await req.json();

    // Validate the orderId
    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required." },
        { status: 400 }
      );
    }

    // Step 1: Fetch the order from the database using the orderId
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // Retrieve service and timeSlot from the fetched order
    const { service, timeSlot } = order;

    const servicePrices: Record<string, number> = {
      "Car foam wash": 679,
      "Car + Bike combo": 899,
      "Bi Weekly": 1199,
      "Weekly": 2199,
    };

    // Get the price for the service
    const price = servicePrices[service];
    if (!price) {
      return NextResponse.json(
        { message: "Invalid service selected." },
        { status: 400 }
      );
    }

    // Step 2: Create the Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: 1 * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_order_${orderId}`,
      payment_capture: true, // Auto-capture payments
      notes: {
        service,
        timeSlot,
      },
    });

    order.razorpayOrderId = razorpayOrder.id;  // Assuming `razorpayOrderId` is a field in the Order model
    await order.save(); 

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        { message: "Failed to create Razorpay order." },
        { status: 500 }
      );
    }

    // Step 3: Respond with the Razorpay order ID and the public key
    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: razorpayOrder.id,
        key: RAZORPAY_KEY_ID, // Razorpay public key
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
