import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect /admin routes — must be logged in AND have admin role
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login?next=" + pathname, req.url));
      }
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware for matched routes, even if not logged in
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
