import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_HOST, SITE } from "@/lib/constants";

const ADMIN_COOKIE = "admin_session";

/**
 * www → apex 301 ve admin cookie varlığı.
 * İmza doğrulaması Node API route’larında (admin-auth) yapılır.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  if (host === `www.${CANONICAL_HOST}`) {
    const destination = new URL(SITE.url);
    destination.pathname = request.nextUrl.pathname;
    destination.search = request.nextUrl.search;
    return NextResponse.redirect(destination, 301);
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin/login")) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "private, no-store, max-age=0, must-revalidate",
    );
    return response;
  }

  if (pathname.startsWith("/api/admin/")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, max-age=0, must-revalidate",
    );
    return response;
  }

  // Hostinger hcdn Next ISR s-maxage=1y HTML'i tutmasin; eski CSS hash 404 olmasin.
  response.headers.set(
    "Cache-Control",
    "public, max-age=0, s-maxage=60, stale-while-revalidate=300, must-revalidate",
  );
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.png|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|pdf|txt|xml|woff2|html)).*)",
  ],
};
