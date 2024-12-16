import { NextRequest, NextResponse } from 'next/server';  // Using NextRequest, NextResponse
import { hash } from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/Otp';
import { sendEmailOtp } from '@/utils/SendOtp';
import { generateOtp } from '@/utils/GenerateOtp';
import { sendWelcomeMail } from '@/utils/SendWelcomeMail';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      emailOtp 
    } = await req.json();  // Use req.json() to parse the request body

    // Step 1: Initial Signup Request (Send OTP)
    if (!emailOtp) {
      // Validate input fields
      if (!firstName || !lastName || !email || !password || !phoneNumber) {
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

      // Store OTP with an expiry date (e.g., 10 minutes from now)
      const expiryDate = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes expiry
      const newOTP = new OTP({
        email,
        otp,
        expiresAt: expiryDate,
      });
      await newOTP.save();

      // Send OTP via email (you can add phone OTP sending if needed)
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

      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
      });

      await newUser.save();

      // Remove the used OTP after successful registration
      await OTP.deleteOne({ email, otp: emailOtp });

      await sendWelcomeMail(email, firstName);

      // Respond with success
      return NextResponse.json({ 
        message: 'User created successfully',
        user: { 
          id: newUser._id, 
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
