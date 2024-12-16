import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    // Logging for debugging
    console.log('User Details Route: Starting request');

    // Connect to the database
    await connectDB();
    console.log('User Details Route: Database connected');

    // Get all cookies
    const cookieStore = cookies();
    const refreshTokenCookie = (await cookieStore).get("refreshToken");
    const googleTokenCookie = (await cookieStore).get("googleToken");
    const jwtTokenCookie = (await cookieStore).get("jwtToken");

    console.log('Cookies found:', {
      refreshToken: !!refreshTokenCookie,
      googleToken: !!googleTokenCookie,
    });

    // Check if any authentication token exists
    if (!refreshTokenCookie && !googleTokenCookie && !jwtTokenCookie) {
      console.warn('User Details Route: No authentication token found');
      return NextResponse.json(
        { message: "Unauthorized: No authentication token found." },
        { status: 401 }
      );
    }

    let user = null;
    let authMethod = 'none';

    // Try Google Token first
    if (googleTokenCookie) {
      try {
        const decoded = jwt.verify(googleTokenCookie.value, JWT_SECRET) as {
          email: string;
        };
        console.log('Google token verified for email:', decoded.email);

        user = await User.findOne({ 
          email: decoded.email, 
          isGoogleUser: true 
        });

        if (user) authMethod = 'google';
      } catch (error) {
        console.error('Google token verification error:', error);
      }
    }

    // Try Refresh Token (MongoDB auth)
    if (!user && refreshTokenCookie) {
      try {
        const decoded = jwt.verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as {
          userId: string;
        };
        console.log('Refresh token verified for userId:', decoded.userId);

        user = await User.findById(decoded.userId);

        if (user) authMethod = 'refreshToken';
      } catch (error) {
        console.error('Refresh token verification error:', error);
      }
    }

    // Try JWT Token
    if (!user && jwtTokenCookie) {
      try {
        const decoded = jwt.verify(jwtTokenCookie.value, JWT_SECRET) as {
          email: string;
        };
        console.log('JWT token verified for email:', decoded.email);

        user = await User.findOne({ email: decoded.email });

        if (user) authMethod = 'jwt';
      } catch (error) {
        console.error('JWT token verification error:', error);
      }
    }

    // If no user found
    if (!user) {
      console.warn('User Details Route: No user found with any authentication method');
      return NextResponse.json(
        { 
          message: "Unauthorized: Unable to authenticate user.",
          authAttempts: [
            { method: 'Google Token', tried: !!googleTokenCookie },
            { method: 'Refresh Token', tried: !!refreshTokenCookie },
            { method: 'JWT Token', tried: !!jwtTokenCookie }
          ]
        },
        { status: 401 }
      );
    }

    console.log(`User found via ${authMethod} authentication`);

    // Remove sensitive information
    const { 
      password, 
      __v, 
      ...userWithoutSensitive 
    } = user.toObject();

    return NextResponse.json({
      ...userWithoutSensitive,
      authMethod
    }, { status: 200 });

  } catch (error) {
    console.error('User Details Route: Unexpected error', error);
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace' 
      },
      { status: 500 }
    );
  }
}