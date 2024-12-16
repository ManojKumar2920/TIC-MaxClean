import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const validateEnvVariables = () => {
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("Missing required environment variables.");
  }
};

const dbMiddleware = async () => {
  await connectDB();
};

export async function POST(req: Request) {
  try {
    // Validate environment variables
    validateEnvVariables();
    // Parse the request body
    const { email, password } = await req.json();
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }
    // Connect to the database
    await dbMiddleware();
    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }
    // Verify the password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }
    // Generate tokens
    const accessToken = sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    // Set the refresh token as an HttpOnly cookie
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
    // Return the access token in the response
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}