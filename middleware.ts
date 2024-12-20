import { NextRequest, NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const userRoleRoute = `${baseURL}/api/user`;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/schedule", "/admin"];
  const adminRoutes = ["/admin"];
  const authPages = ["/signin", "/signup"];

  // Helper function to check if user has valid auth tokens
  const hasValidAuthTokens = (cookies: string | null): boolean => {
    if (!cookies) return false;
    
    // Check for either refreshToken alone (normal login)
    // or both googleToken and refreshToken (Google login)
    const hasRefreshToken = cookies.includes('refreshToken');
    const hasGoogleTokens = cookies.includes('googleToken') && cookies.includes('refreshToken');
    
    return hasRefreshToken || hasGoogleTokens;
  };

  // For protected routes, check authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const cookies = req.headers.get("cookie");
      
      // First check if any valid token combination exists
      if (!hasValidAuthTokens(cookies)) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }

      // Make a request to the user role route with the cookies
      const res = await fetch(userRoleRoute, {
        headers: {
          cookie: cookies || "",
        },
        credentials: 'include',
      });

      if (!res.ok) {
        // Unauthorized or failed request
        return NextResponse.redirect(new URL("/signin", req.url));
      }

      const { user } = await res.json();

      // Check role for admin routes
      if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (user.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    } catch (error) {
      console.error("Error in auth middleware:", error);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // For auth pages, redirect if already authenticated
  if (authPages.some((page) => pathname.startsWith(page))) {
    try {
      const cookies = req.headers.get("cookie");
      
      // If user has valid tokens, redirect to dashboard
      if (hasValidAuthTokens(cookies)) {
        const res = await fetch(userRoleRoute, {
          headers: {
            cookie: cookies || "",
          },
          credentials: 'include',
        });

        if (res.ok) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  }

  return NextResponse.next();
}

// Configure middleware to match specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/schedule/:path*',
    '/admin/:path*',
    '/signin',
    '/signup',
  ]
};