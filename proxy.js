import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Role check
    const isAuth = !!token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPath) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (token.role !== "SUPERADMIN" && token.role !== "STAFF") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
