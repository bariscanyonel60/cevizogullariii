import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecrets() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret) return null;
  return { username, password, secret };
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

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  const secrets = getSecrets();
  if (!secrets || !token) return false;

  const [expiresRaw, signature] = token.split(".");
  if (!expiresRaw || !signature) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = sign(`admin:${expiresAt}`, secrets.secret);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(
  username: string,
  password: string,
): boolean {
  const secrets = getSecrets();
  if (!secrets) return false;
  // Her iki karşılaştırmayı da çalıştır (erken çıkışla zamanlama sızıntısını azalt)
  const userOk = safeEqual(username, secrets.username);
  const passOk = safeEqual(password, secrets.password);
  return userOk && passOk;
}

export function createAdminSessionValue(): string | null {
  const secrets = getSecrets();
  if (!secrets) return null;
  const expiresAt = Date.now() + ADMIN_MAX_AGE_SEC * 1000;
  const payload = `admin:${expiresAt}`;
  return `${expiresAt}.${sign(payload, secrets.secret)}`;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_MAX_AGE_SEC,
  };
}

export function adminAuthConfigured(): boolean {
  return getSecrets() !== null;
}
