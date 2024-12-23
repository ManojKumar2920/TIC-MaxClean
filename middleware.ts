import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define route groups
  const protectedRoutes = /^\/(dashboard|schedule|admin)/;
  const adminRoutes = /^\/admin/;
  const authPages = /^\/(signin|signup)/;

  // Skip auth check for API and static routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    // Fetch user details
    const res = await fetch("https://themaxclean.com/api/user", {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const isAuthenticated = res.ok;
    const user = isAuthenticated ? await res.json() : null;

    // Handle protected routes
    if (protectedRoutes.test(pathname)) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }

      // Handle admin-only routes
      if (adminRoutes.test(pathname) && user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Handle auth pages (signin/signup)
    if (authPages.test(pathname) && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);

    // Redirect to signin on error for protected routes
    if (protectedRoutes.test(pathname)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the matcher for efficient routing
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
