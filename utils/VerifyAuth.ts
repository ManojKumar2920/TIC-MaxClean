import User from "@/models/User";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

interface VerifyAuthResult {
  user?: any; // Replace 'any' with your User type
  error?: string;
  status?: number;
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export async function verifyAuth(): Promise<VerifyAuthResult> {
  const refreshTokenCookie = (await cookies()).get("refreshToken");

  if (!refreshTokenCookie?.value) {
    return { error: "Unauthorized: No refresh token found.", status: 401 };
  }

  try {
    const decoded = verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as {
      userId: string;
      email: string;
    };

    if (!decoded.email) {
      return { error: "Unauthorized: Invalid token payload.", status: 401 };
    }

    const user = await User.findOne({ email: decoded.email }).select(
      "firstName lastName email role"
    ); // Only select needed fields

    if (!user) {
      return { error: "Unauthorized: User not found.", status: 404 };
    }

    // Return user without sensitive fields
    return {
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      // Provide more specific error messages for token issues
      if (error.name === "TokenExpiredError") {
        return { error: "Unauthorized: Token has expired.", status: 401 };
      }
      if (error.name === "JsonWebTokenError") {
        return { error: "Unauthorized: Invalid token.", status: 401 };
      }
    }
    return { error: "Unauthorized: Token verification failed.", status: 401 };
  }
}
