import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/schedule"];
const authPages = ["/signin", "/signup"];
const googleCallbackPath = "/api/auth/google/callback"; // Update this to match your actual Google callback endpoint

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // Handle Google's OAuth callback
  if (pathname.startsWith(googleCallbackPath)) {
    // You can process query parameters here if needed
    const redirectPath = searchParams.get("redirect") || "/dashboard";
    if (refreshToken) {
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
  }

  // 1. Redirect unauthenticated users trying to access protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!refreshToken) {
      const loginUrl = new URL("/signin", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect authenticated users trying to access auth pages
  if (refreshToken && authPages.some((page) => pathname.startsWith(page))) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}
