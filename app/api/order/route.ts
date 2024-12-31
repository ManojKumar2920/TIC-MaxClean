import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import User from "@/models/User";
import { sendAcceptMail } from "@/utils/SendAcceptMail";
import { sendRejectMail } from "@/utils/SendRejectMail";
import { sendOntheWayMail } from "@/utils/SendOnTheWayMail";
import { sendCompletedMail } from "@/utils/SendCompletedMail";
import { generateReceiptPDF } from "@/utils/GenerateReceipt";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

interface VerifyAuthResult {
  user?: any; // Replace 'any' with your User type
  error?: string;
  status?: number;
}

// Utility function to verify user authentication
async function verifyAuth(): Promise<VerifyAuthResult> {
  const refreshTokenCookie = (await cookies()).get("refreshToken");

  if (!refreshTokenCookie?.value) {
    return { error: "Unauthorized: No refresh token found.", status: 401 };
  }

  try {
    const decoded = verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as {
      userId: string;
      email: string;
    };

    if (!decoded.email) {
      return { error: "Unauthorized: Invalid token payload.", status: 401 };
    }

    const user = await User.findOne({ email: decoded.email }).select(
      "firstName lastName email role"
    ); // Only select needed fields

    if (!user) {
      return { error: "Unauthorized: User not found.", status: 404 };
    }

    // Return user without sensitive fields
    return {
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      // Provide more specific error messages for token issues
      if (error.name === "TokenExpiredError") {
        return { error: "Unauthorized: Token has expired.", status: 401 };
      }
      if (error.name === "JsonWebTokenError") {
        return { error: "Unauthorized: Invalid token.", status: 401 };
      }
    }
    return { error: "Unauthorized: Token verification failed.", status: 401 };
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      name,
      email,
      phoneNumber,
      service,
      address,
      landmark,
      pincode,
      date,
      timeSlot,
      notes,
      paymentStatus,
    } = await req.json();

    // Validate required fields
    if (!name || !email || !service || !address || !pincode || !timeSlot) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const authResult = await verifyAuth();
    if ("error" in authResult) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const servicePrices: Record<string, number> = {
      "Car foam wash": 679,
      "Car + Bike combo": 899,
      "Bi Weekly": 1199,
      Weekly: 2199,
    };

    const price = servicePrices[service];
    if (!price) {
      return NextResponse.json(
        { message: "Invalid service selected." },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      userId: authResult.user.userId,
      name,
      email,
      phoneNumber,
      service,
      price,
      address,
      landmark,
      pincode,
      date,
      timeSlot,
      notes,
      paymentStatus,
    });

    return NextResponse.json(
      {
        message: "Order created successfully.",
        order: newOrder,
        orderId: newOrder._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: unknown) {
  try {
    // Ensure database connection
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth();
    if ("error" in authResult) {
      console.log("Authentication failed:", authResult.error);
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const { user } = authResult;

    // Fetch orders based on user role
    if (user.role === "admin") {
      // console.log("Fetching all orders for admin...");
      const orders = await Order.find().sort({ updatedAt: -1 });
      // console.log("Orders fetched:", orders);
      return NextResponse.json({ orders }, { status: 200 });
    } else {
      // console.log(`Fetching orders for user: ${user.userId}`);
      const userOrders = await Order.find({ userId: user.userId }).sort({
        updatedAt: -1,
      });
      // console.log("User orders fetched:", userOrders);
      return NextResponse.json({ orders: userOrders }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { orderId, newStatus, message } = await req.json();

    // Validate required fields
    if (!orderId || !newStatus) {
      return NextResponse.json(
        { message: "Missing required fields: orderId or newStatus." },
        { status: 400 }
      );
    }

    const validStatuses = [
      "Pending",
      "Accepted",
      "OnTheWay",
      "Completed",
      "Rejected",
    ];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: "Invalid status provided." },
        { status: 400 }
      );
    }

    const authResult = await verifyAuth();
    if ("error" in authResult) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const { user } = authResult;

    // Only admins can update the status of an order
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Only admins can update order status." },
        { status: 403 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    order.status = newStatus;
    await order.save();

    const pdfBuffer = await generateReceiptPDF(order);

    if (newStatus === "Accepted") {
      order.receipt = pdfBuffer;
    }

    const receiptBuffer = pdfBuffer;

    await order.save();

    // Send email based on the new status
    switch (newStatus) {
      case "Accepted":
        await sendAcceptMail(

          order.name,
          order.email,
          order.service,
          order.price,
          order.date,
          order.timeSlot,
          order.razorpayOrderId,
          receiptBuffer
        );
        break;
      case "Rejected":
        await sendRejectMail(
          order.name,
          order.email,
          order.service,
          order.price,
          order.date,
          order.timeSlot,
          order.razorpayOrderId,
          message
        );
        break;
      case "OnTheWay":
        await sendOntheWayMail(
          order.name,
          order.email,
          order.service,
          order.price,
          order.date,
          order.timeSlot,
          order.razorpayOrderId
        );
        break;
      case "Completed":
        await sendCompletedMail(
          order.name,
          order.email,
          order.service,
          order.price,
          order.date,
          order.timeSlot,
          order.razorpayOrderId
        );
        break;
      default:
        break; // No email to send for other statuses
    }

    return NextResponse.json(
      { message: "Order status updated successfully.", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
