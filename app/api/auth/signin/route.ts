import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/Otp";
import { sendEmailOtp } from "@/utils/SendOtp";
import { generateOtp } from "@/utils/GenerateOtp";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const validateEnvVariables = () => {
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("Missing required environment variables.");
  }
};

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    validateEnvVariables();

    // Connect to database
    await connectDB();

    const { email, emailOtp } = await req.json();

    // Step 1: Request OTP
    if (!emailOtp) {
      if (!email) {
        return NextResponse.json(
          { message: "Email is required" },
          { status: 422 }
        );
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      await OTP.deleteMany({ email });
      const otp = generateOtp();
      const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      const newOTP = new OTP({ email, otp, expiresAt: expiryDate });
      await newOTP.save();

      await sendEmailOtp(email, otp);

      return NextResponse.json(
        { message: "OTP sent successfully", otpSent: true },
        { status: 200 }
      );
    }

    // Step 2: Verify OTP and Sign In
    if (!email || !emailOtp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 422 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const storedOtp = await OTP.findOne({ email, otp: emailOtp });

    if (!storedOtp) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (storedOtp.expiresAt < new Date()) {
      await OTP.deleteOne({ email, otp: emailOtp });
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // Create response with user data and access token
    const response = NextResponse.json(
      {
        message: "Sign-In successful",
        user: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          role: existingUser.role,
        },
        accessToken,
      },
      { status: 200 }
    );

    // Set refresh token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
      priority: "high",
    });

    // Remove the used OTP
    await OTP.deleteOne({ email, otp: emailOtp });

    return response;

  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}