import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import User from "@/models/User";
import { sendAcceptMail } from "@/utils/SendAcceptMail";
import { sendRejectMail } from "@/utils/SendRejectMail";
import { sendOntheWayMail } from "@/utils/SendOnTheWayMail";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

// Utility function to verify user authentication
async function verifyAuth() {
  const refreshTokenCookie = (await cookies()).get("refreshToken");

  if (!refreshTokenCookie?.value) {
    return { error: "Unauthorized: No refresh token found.", status: 401 };
  }

  try {
    const decoded = verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as { userId: string };
    if (!decoded.userId) {
      return { error: "Unauthorized: Invalid token payload.", status: 401 };
    }

    const user = await User.findOne({ email: decoded.userId });
    if (!user) {
      return { error: "Unauthorized: User not found.", status: 404 };
    }

    return { user };
  } catch (error) {
    return { error: "Unauthorized: Invalid or expired token.", status: 401 };
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
      paymentStatus
    } = await req.json();

    // Validate required fields
    if (!name || !email || !service || !address || !pincode || !timeSlot) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const authResult = await verifyAuth();
    if ('error' in authResult) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const servicePrices: Record<string, number> = {
      "Car foam wash": 649,
      "Bike foam wash": 449,
      "Car + Bike combo": 899,
      "Bi Weekly": 1099,
      "Weekly": 2099,
      "Battery jump start": 349,
    };

    const price = servicePrices[service];
    if (!price) {
      return NextResponse.json(
        { message: "Invalid service selected." },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      userId: authResult.user._id,
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
      paymentStatus
    });

    return NextResponse.json(
      {
        message: "Order created successfully.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const authResult = await verifyAuth();
    if ('error' in authResult) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const { user } = authResult;

    // Fetch orders based on user role
    if (user.role === "admin") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json({ orders }, { status: 200 });
    } else {
      const userOrders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
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

    const { orderId, newStatus, UserMessage } = await req.json();

    // Validate required fields
    if (!orderId || !newStatus) {
      return NextResponse.json(
        { message: "Missing required fields: orderId or newStatus." },
        { status: 400 }
      );
    }

    const validStatuses = ["Pending", "Accepted", "OnTheWay", "Completed", "Rejected"];
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

    // Send email based on the new status
    switch (newStatus) {
      case "Accepted":
        await sendAcceptMail( order.name, order.email, order.service, order.price, order.date,order.timeSlot, order.razorpayOrderId,);
        break;
      case "Rejected":
        await sendRejectMail( order.name, order.email, order.service, order.price, order.date,order.timeSlot, order.razorpayOrderId ,UserMessage);
        break;
      case "OnTheWay":
        await sendOntheWayMail( order.name, order.email, order.service, order.price, order.date,order.timeSlot, order.razorpayOrderId);
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
