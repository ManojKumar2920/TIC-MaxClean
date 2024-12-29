import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get refresh token from cookies
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Unauthorized: No refresh token found" },
        { status: 401 }
      );
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken.value, REFRESH_TOKEN_SECRET) as {
        userId: string;
        email: string;
      };

      // Find user
      const user = await User.findOne({ email: decoded.email })
        .select('firstName lastName email phoneNumber role createdAt updatedAt');

      if (!user) {
        return NextResponse.json(
          { message: "Unauthorized: User not found" },
          { status: 401 }
        );
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Create response with user data
      const response = NextResponse.json(
        {
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        },
        { status: 200 }
      );

      // Set new access token in Authorization header
      response.headers.set("Authorization", `Bearer ${accessToken}`);

      return response;

    } catch (error) {
      // Handle invalid or expired refresh token
      if (error instanceof jwt.JsonWebTokenError) {
        // Clear the invalid refresh token
        (await cookies()).delete("refreshToken");
        
        return NextResponse.json(
          { message: "Unauthorized: Invalid refresh token" },
          { status: 401 }
        );
      }
      throw error;
    }

  } catch (error) {

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}