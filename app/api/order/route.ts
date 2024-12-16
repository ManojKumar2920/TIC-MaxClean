import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { cookies } from "next/headers"; // for accessing cookies
import { verify } from "jsonwebtoken"; // for decoding and verifying JWT tokens
import User from "@/models/User";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
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
    } = await req.json();

    // Validate required fields
    if (!name || !email || !service || !address || !pincode || !timeSlot) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const refreshTokenCookie = (await cookies()).get("refreshToken");

    if (!refreshTokenCookie || !refreshTokenCookie.value) {
      return NextResponse.json(
        { message: "Unauthorized: No refresh token found." },
        { status: 401 }
      );
    }

    const refreshToken = refreshTokenCookie.value;

    let userId: string | undefined;

    try {
      const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET) as unknown;
      const decodedToken = decoded as { userId: string };

      userId = decodedToken.userId;
      console.log("USer id: " + userId);
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired refresh token." },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: No userId found in token." },
        { status: 401 }
      );
    }


    // Calculate price based on service
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

    // Create a new order
    const newOrder = await Order.create({
      userId,
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
      paymentStatus: "Pending",
    });

    // Return the newly created order
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

export async function GET(req: Request) {
  try {
    await connectDB();

    const refreshTokenCookie = (await cookies()).get("refreshToken");

    if (!refreshTokenCookie || !refreshTokenCookie.value) {
      return NextResponse.json(
        { message: "Unauthorized: No refresh token found." },
        { status: 401 }
      );
    }

    const refreshToken = refreshTokenCookie.value;

    let userId: string | undefined;

    try {
      const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET) as unknown;
      const decodedToken = decoded as { userId: string };

      userId = decodedToken.userId;
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired refresh token." },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: No userId found in token." },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: User not found." },
        { status: 404 }
      );
    }

    if (user.role === "admin") {
      // Fetch all orders if user is admin
      const orders = await Order.find();
      return NextResponse.json({ orders }, { status: 200 });
    } else if (user.role === "user") {
      // Fetch only the orders specific to the logged-in user if user is not an admin
      const userOrders = await Order.find({ userId });
      return NextResponse.json({ orders: userOrders }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized: Insufficient permissions." },
        { status: 403 }
      );
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
