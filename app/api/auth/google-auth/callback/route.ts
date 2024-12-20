import { google } from "googleapis";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { sendWelcomeMail } from "@/utils/SendWelcomeMail";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-auth/callback`
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // Connect to the database
    await connectDB();

    // Exchange the code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Check if the refresh token is present
    if (!tokens.refresh_token) {
      console.warn(
        "No refresh token received. Ensure access_type is offline and prompt is consent."
      );
    } else {
      console.log("Refresh Token:", tokens.refresh_token);
    }
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    const { email, given_name: firstName, family_name: lastName } = googleUser;

    // Check if the user exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new user
      user = await User.create({
        email,
        firstName,
        lastName,
        role: "user", // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // If the user exists, update their details
      user.firstName = firstName;
      user.lastName = lastName;
      user.updatedAt = new Date();
      await user.save();
    }

    // Generate a JWT token for the user (session token)
    const token = jwt.sign(
      {
        email,
        firstName,
        lastName,
        role: user.role,
        userId: user._id, // Include user ID in the token
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Set refresh token in an HTTP-only cookie
    // When creating the refresh token, ensure consistent structure
    const refreshToken = jwt.sign(
      {
        userId: user._id, // Consistent key name
        email: user.email, // Optional: add more info if needed
      },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      }
    );
    const response = NextResponse.redirect(new URL("/", req.url));

    // // Set JWT token and refresh token as cookies
    // response.cookies.set("googleToken", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    //   path: "/",
    // });

    (await cookies()).set({
      name: "googleToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Check if refreshToken is available before setting the cookie
    if (refreshToken) {
      (await cookies()).set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    } else {
      console.error("No refresh token received from Google.");
    }

    await sendWelcomeMail(user.email, user.firstName);

    return response;
  } catch (error) {
    console.error("Google Sign-In Callback Error:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
