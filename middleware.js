import { NextResponse } from "next/server";

export async function middleware(request) {

  const url = request.nextUrl;

  const pathname = url.pathname;

  /* ========================================= */
  /* LOWERCASE REDIRECT */
  /* ========================================= */

  const lowercasePath =
    pathname.toLowerCase();

  if (pathname !== lowercasePath) {

    url.pathname = lowercasePath;

    return NextResponse.redirect(
      url,
      301
    );
  }

  /* ========================================= */
  /* REMOVE TRAILING SLASH */
  /* ========================================= */

  if (
    pathname.length > 1 &&
    pathname.endsWith("/")
  ) {

    url.pathname =
      pathname.slice(0, -1);

    return NextResponse.redirect(
      url,
      301
    );
  }

  /* ========================================= */
  /* HANDLE OLD URL REDIRECTS */
  /* ========================================= */

  if (
    pathname.startsWith("/call-girls/") ||
    pathname.startsWith("/city/")
  ) {

    try {

      const API_URL =
        process.env.NEXT_PUBLIC_BASE_URL;

      if (!API_URL) {
        return NextResponse.next();
      }

      const res = await fetch(
        `${API_URL}${pathname}`,
        {
          redirect: "manual",
        }
      );

      if (
        res.status === 301 ||
        res.status === 302
      ) {

        const location =
          res.headers.get("location");

        if (location) {

          return NextResponse.redirect(
            new URL(location, request.url),
            301
          );

        }

      }

    } catch (err) {

      console.log(
        "Middleware Error:",
        err
      );

    }

  }

  return NextResponse.next();

}

/* ========================================= */
/* MATCHER */
/* ========================================= */

export const config = {

  matcher: [

    /*
      Skip:
      - api
      - next static
      - images
      - favicon
    */

    "/((?!api|_next|favicon.ico|.*\\..*).*)",

  ],

};