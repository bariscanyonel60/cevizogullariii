import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_HOST, SITE } from "@/lib/constants";

const ADMIN_COOKIE = "admin_session";

/**
 * Edge middleware: www → apex 301 ve admin cookie varlığı.
 * İmza doğrulaması Node API route’larında (admin-auth) yapılır.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  if (host === `www.${CANONICAL_HOST}`) {
    const destination = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      SITE.url,
    );
    return NextResponse.redirect(destination, 301);
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.png|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|pdf|txt|xml|woff2|html)).*)",
  ],
};
