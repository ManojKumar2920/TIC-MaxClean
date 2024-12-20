import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/Otp';
import { sendEmailOtp } from '@/utils/SendOtp';
import { generateOtp } from '@/utils/GenerateOtp';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const validateEnvVariables = () => {
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('Missing required environment variables.');
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
          { message: 'Email is required' },
          { status: 422 }
        );
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return NextResponse.json(
          { message: 'User not found' },
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
        { message: 'OTP sent successfully', otpSent: true },
        { status: 200 }
      );
    }

    // Step 2: Verify OTP and Sign In
    if (emailOtp) {
      if (!email || !emailOtp) {
        return NextResponse.json(
          { message: 'Email and OTP are required' },
          { status: 422 }
        );
      }

      const storedOtp = await OTP.findOne({ email, otp: emailOtp });

      if (!storedOtp) {
        return NextResponse.json(
          { message: 'Invalid or expired OTP' },
          { status: 400 }
        );
      }

      if (storedOtp.expiresAt < new Date()) {
        await OTP.deleteOne({ email, otp: emailOtp });
        return NextResponse.json(
          { message: 'OTP has expired' },
          { status: 400 }
        );
      }

      // Generate access and refresh tokens
      const accessToken = sign(
        { userId: email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = sign(
        { userId: email },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Store refresh token in HTTP-only cookie
      const response = NextResponse.json(
        {
          message: 'Sign-In successful',
          accessToken,
        },
        { status: 200 }
      );

      (await cookies()).set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      console.log("Refresh token is "+refreshToken, "Access token is "+accessToken)
      console.log("Signedin successfull!")

      // Remove the used OTP
      await OTP.deleteOne({ email, otp: emailOtp });

      return response;
    }
  } catch (error) {
    console.error('Sign-In error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
