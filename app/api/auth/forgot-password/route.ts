import { NextResponse } from 'next/server';
import User from '@/models/User';
import OTP from '@/models/Otp';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { generateOtp } from '@/utils/GenerateOtp';

// POST: Send OTP to email
export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }

    const otp = generateOtp();

    await OTP.create({ email, otp });

    console.log(`OTP sent to ${email}: ${otp}`);

    return NextResponse.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Verify OTP and reset password
export async function PATCH(req: Request) {
  await connectDB();
  
  const { email, otp, newPassword } = await req.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json(
      { error: 'Email, OTP, and new password are required' },
      { status: 400 }
    );
  }

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const isExpired = new Date().getTime() - new Date(otpRecord.createdAt).getTime() > 300000; // 5 minutes
    if (isExpired) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete OTP record
    await OTP.deleteOne({ email, otp });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
