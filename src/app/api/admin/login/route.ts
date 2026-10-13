import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  createAdminSessionValue,
  getAdminCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_MAX = 5;
/** x-forwarded-for taklit edilebildiği için IP'den bağımsız üst sınır. */
const GLOBAL_FAIL_MAX = 25;
const GLOBAL_KEY = "*";
const failuresByIp = new Map<string, number[]>();

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function recentFailures(ip: string): number[] {
  const now = Date.now();
  const stamps = (failuresByIp.get(ip) ?? []).filter(
    (t) => now - t < FAIL_WINDOW_MS,
  );
  failuresByIp.set(ip, stamps);
  return stamps;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (
    recentFailures(ip).length >= FAIL_MAX ||
    recentFailures(GLOBAL_KEY).length >= GLOBAL_FAIL_MAX
  ) {
    return NextResponse.json(
      { error: "Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SESSION_SECRET tanımlı değil." },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password?.trim() ?? "";
  if (!verifyAdminCredentials(username, password)) {
    recentFailures(ip).push(Date.now());
    recentFailures(GLOBAL_KEY).push(Date.now());
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { error: "Kullanıcı adı veya şifre hatalı" },
      { status: 401 },
    );
  }

  const token = createAdminSessionValue();
  if (!token) {
    return NextResponse.json({ error: "Oturum oluşturulamadı" }, { status: 500 });
  }

  failuresByIp.delete(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions());
  return response;
}
