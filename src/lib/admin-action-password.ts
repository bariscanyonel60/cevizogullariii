import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ADMIN_ACTION_PASSWORD_HEADER } from "@/lib/admin-action-password-shared";

function expectedActionPassword(): string | null {
  const value = process.env.ADMIN_ACTION_PASSWORD?.trim();
  return value ? value : null;
}

function safeEqual(input: string, expected: string): boolean {
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function adminActionPasswordConfigured(): boolean {
  return Boolean(expectedActionPassword());
}

export function verifyAdminActionPassword(
  provided: string | null | undefined,
): boolean {
  const expected = expectedActionPassword();
  if (!expected || provided == null) return false;
  return safeEqual(provided, expected);
}

/** Mutasyon route'larinda: sifre yok/yanlis ise 403. */
export function requireAdminActionPassword(
  request: Request,
): NextResponse | null {
  if (!adminActionPasswordConfigured()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_ACTION_PASSWORD tanımlı değil. Panel kayıtları için hPanel veya .env.local’e ekleyin.",
      },
      { status: 503 },
    );
  }
  const provided = request.headers.get(ADMIN_ACTION_PASSWORD_HEADER);
  if (!verifyAdminActionPassword(provided)) {
    return NextResponse.json(
      { error: "Güvenlik şifresi hatalı. İşlem kaydedilmedi." },
      { status: 403 },
    );
  }
  return null;
}
