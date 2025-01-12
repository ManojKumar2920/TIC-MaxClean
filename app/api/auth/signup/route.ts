import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/Otp';
import { sendEmailOtp } from '@/utils/SendOtp';
import { generateOtp } from '@/utils/GenerateOtp';
import { sendWelcomeMail } from '@/utils/SendWelcomeMail';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

    const { 
      firstName, 
      lastName, 
      email,
      phoneNumber, 
      emailOtp 
    } = await req.json();

    // Step 1: Initial Signup Request (Send OTP)
    if (!emailOtp) {
      // Validate input fields
      if (!firstName || !lastName || !email || !phoneNumber) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 422 });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      }

      // Check if OTP already exists for this email, if so, delete it
      await OTP.deleteMany({ email });

      // Generate OTP
      const otp = generateOtp();

      // Store OTP with an expiry date
      const expiryDate = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes expiry
      const newOTP = new OTP({
        email,
        otp,
        expiresAt: expiryDate,
      });
      await newOTP.save();

      // Send OTP via email
      await sendEmailOtp(email, otp);

      return NextResponse.json({ 
        message: 'OTP sent successfully',
        otpSent: true 
      }, { status: 200 });
    }

    // Step 2: OTP Verification and User Creation
    if (emailOtp) {
      // Find the stored OTP
      const storedOtp = await OTP.findOne({ 
        email, 
        otp: emailOtp 
      });

      if (!storedOtp) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Check if the OTP has expired
      if (storedOtp.expiresAt < new Date()) {
        // Remove expired OTP
        await OTP.deleteOne({ email, otp: emailOtp });
        return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
      }

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      await newUser.save();

      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      // Create response with user data and access token
      const response = NextResponse.json({ 
        message: 'User created successfully',
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken
      }, { status: 201 });

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

      // Send welcome email
      await sendWelcomeMail(email, firstName);

      return response;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}