import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

function homeForRole(role: string | undefined) {
  return role === "customer" ? "/dashboard" : "/admin";
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (req.auth?.user as any)?.role as string | undefined;
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiAuthRoute) return NextResponse.next();

  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && isLoggedIn && role === "customer") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isDashboardRoute && isLoggedIn && role !== "customer") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/admin/:path*", "/dashboard/:path*", "/login"],
};
