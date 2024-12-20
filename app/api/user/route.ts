import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Retrieve cookies
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");
    const googleTokenCookie = cookieStore.get("googleToken");

    // Check for authentication tokens in cookies
    if (!refreshTokenCookie && !googleTokenCookie) {
      return NextResponse.json(
        { message: "Unauthorized: No authentication token found." },
        { status: 401 }
      );
    }

    let user = null;
    let authMethod = "none";

    // Try Google Token first
    if (googleTokenCookie) {
      try {
        const decoded = jwt.verify(googleTokenCookie.value, JWT_SECRET) as { email: string };
        user = await User.findOne({ email: decoded.email, isGoogleUser: true })
          .select('firstName lastName email phoneNumber role createdAt updatedAt');

        if (user) authMethod = "google";
      } catch (error) {
        console.error("Google token verification error:", error);
      }
    }

    // Try Refresh Token if Google Token fails
    if (!user && refreshTokenCookie) {
      try {
        const decoded = jwt.verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as { userId: string };
        user = await User.findOne({ email: decoded.userId })
          .select('firstName lastName email phoneNumber role createdAt updatedAt');

        if (user) authMethod = "refreshToken";
      } catch (error) {
        console.error("Refresh token verification error:", error);
      }
    }

    // If no user found, return unauthorized
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized: Unable to authenticate user.",
          authAttempts: [
            { method: "Google Token", tried: !!googleTokenCookie },
            { method: "Refresh Token", tried: !!refreshTokenCookie },
          ],
        },
        { status: 401 }
      );
    }

    // Return the user details along with the authentication method used
    return NextResponse.json(
      {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        authMethod
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in user details route:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error: String(error),
        stack: error instanceof Error ? error.stack : "No stack trace",
      },
      { status: 500 }
    );
  }
}