import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/schedule", "/admin"];
  const adminRoutes = ["/admin"];
  const authPages = ["/signin", "/signup"];

  // Skip auth check for API and static routes
  if (pathname.startsWith('/api/') || pathname.includes('/_next/') || pathname.includes('/static/')) {
    return NextResponse.next();
  }

  try {
    // Check user authentication
    const res = await fetch(`${req.nextUrl.origin}/api/user`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    // For protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      if (!res.ok) {
        // User is not authenticated, redirect to signin
        return NextResponse.redirect(new URL("/signin", req.url));
      }

      const { user } = await res.json();

      // Check admin routes
      if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (user.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    // For auth pages (signin/signup)
    if (authPages.some((page) => pathname.startsWith(page))) {
      if (res.ok) {
        // User is already authenticated, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

  } catch (error) {
    console.error("Middleware error:", error);
    // On error, redirect to signin for protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }
  

  return NextResponse.next();

  
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};