import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const cookieStore = cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");
    const googleTokenCookie = cookieStore.get("googleToken");
    
    // Add debugging response headers in development
    const debug = {
      hasRefreshToken: !!refreshTokenCookie,
      hasGoogleToken: !!googleTokenCookie,
      tokenContents: {
        refreshToken: refreshTokenCookie?.value ? 'present' : 'missing',
        googleToken: googleTokenCookie?.value ? 'present' : 'missing'
      }
    };

    // Enhanced error handling for missing tokens
    if (!refreshTokenCookie && !googleTokenCookie) {
      return NextResponse.json(
        {
          message: "Authentication required",
          details: "No valid authentication tokens found in cookies",
          debug: process.env.NODE_ENV === 'development' ? debug : undefined
        },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="User Authentication"'
          }
        }
      );
    }

    let user = null;
    let authMethod = "none";
    let tokenErrors = [];

    // Google authentication attempt
    if (googleTokenCookie?.value) {
      try {
        const decoded = jwt.verify(googleTokenCookie.value, JWT_SECRET) as { email: string };
        user = await User.findOne({ 
          email: decoded.email, 
          isGoogleUser: true,
          isActive: true // Add additional security checks
        }).select('-password');
        
        if (user) authMethod = "google";
      } catch (error) {
        tokenErrors.push({
          type: 'google',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Refresh token attempt
    if (!user && refreshTokenCookie?.value) {
      try {
        const decoded = jwt.verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as { userId: string };
        user = await User.findOne({ 
          _id: decoded.userId,
          isActive: true // Add additional security checks
        }).select('-password');
        
        if (user) authMethod = "refreshToken";
      } catch (error) {
        tokenErrors.push({
          type: 'refresh',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Handle authentication failure
    if (!user) {
      return NextResponse.json(
        {
          message: "Authentication failed",
          details: "Unable to verify user credentials",
          authAttempts: [
            { method: "Google", status: googleTokenCookie ? 'failed' : 'not_present' },
            { method: "RefreshToken", status: refreshTokenCookie ? 'failed' : 'not_present' }
          ],
          errors: process.env.NODE_ENV === 'development' ? tokenErrors : undefined,
          debug: process.env.NODE_ENV === 'development' ? debug : undefined
        },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="invalid_token"'
          }
        }
      );
    }

    // Success response with user data
    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        authMethod,
        debug: process.env.NODE_ENV === 'development' ? debug : undefined
      },
      { status: 200 }
    );

    // Add security headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    
    return response;

  } catch (error) {
    console.error("Authentication error:", error);
    
    return NextResponse.json(
      {
        message: "Internal server error during authentication",
        error: process.env.NODE_ENV === 'development' 
          ? String(error)
          : 'An unexpected error occurred',
        debug: process.env.NODE_ENV === 'development' ? {
          errorName: error instanceof Error ? error.name : 'Unknown',
          errorStack: error instanceof Error ? error.stack : undefined
        } : undefined
      },
      { status: 500 }
    );
  }
}