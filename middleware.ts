import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get("token")?.value;

  // Allow access to the login page without a token
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Redirect to login page if no token is found for /admin routes
  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Proceed with the request if a token is found or if on the login page
  return NextResponse.next();
}

// Apply the middleware to all admin routes
export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to all admin routes
};
