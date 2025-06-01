import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/pages/login", "/pages/register"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/pages/login", request.url));
  }
}


export const config = {
  matcher: [
    "/pages/audit/:path*",
    "/pages/dashboard/:path*",
    "/pages/inventory/:path*",
    "/pages/product/:path*",
  ],
};
