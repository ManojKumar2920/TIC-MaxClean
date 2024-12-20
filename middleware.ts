import { NextRequest, NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; 
const userRoleRoute = `${baseURL}/api/user`;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/schedule", "/admin"];
  const adminRoutes = ["/admin"];
  const authPages = ["/signin", "/signup"];
  const googleCallbackPath = "/api/auth/google/callback";

  // Redirect unauthenticated users trying to access protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      // Make a request to the user role route
      const res = await fetch(userRoleRoute, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
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
      console.error("Error fetching user role:", error);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Redirect authenticated users trying to access auth pages
  if (authPages.some((page) => pathname.startsWith(page))) {
    try {
      const res = await fetch(userRoleRoute, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (res.ok) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      console.error("Error fetching user role during auth page access:", error);
    }
  }

  return NextResponse.next();
}
