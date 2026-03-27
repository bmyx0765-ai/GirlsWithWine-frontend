import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ handle BOTH routes
  if (
    pathname.startsWith("/call-girls/") ||
    pathname.startsWith("/city/")
  ) {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}${pathname}`, {
        redirect: "manual",
      });

      if (res.status === 301 || res.status === 302) {
        const location = res.headers.get("location");

        if (location) {
          return NextResponse.redirect(
            new URL(location, request.url),
            301
          );
        }
      }
    } catch (err) {
      console.log("Middleware Error:", err);
    }
  }

  return NextResponse.next();
}

/* ✅ VERY IMPORTANT */
export const config = {
  matcher: [
    "/call-girls/:path*",
    "/city/:path*", // ✅ NEW
  ],
};
