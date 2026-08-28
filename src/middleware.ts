import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";

/**
 * Edge middleware: yalnızca cookie varlığını kontrol eder.
 * İmza doğrulaması Node API route’larında (admin-auth) yapılır.
 */
export function middleware(request: NextRequest) {
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
  matcher: ["/api/admin/:path*"],
};
