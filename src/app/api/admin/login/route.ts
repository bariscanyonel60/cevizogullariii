import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  createAdminSessionValue,
  getAdminCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
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

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions());
  return response;
}
