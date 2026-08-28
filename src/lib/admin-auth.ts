import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  createAdminSessionValue,
  getAdminCookieOptions,
  verifyAdminCredentials,
  verifyAdminToken,
} from "@/lib/admin-auth-token";

export {
  ADMIN_COOKIE,
  adminAuthConfigured,
  createAdminSessionValue,
  getAdminCookieOptions,
  verifyAdminCredentials,
  verifyAdminToken,
};

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}
