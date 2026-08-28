import type { Metadata } from "next";
import { AdminLoginGate } from "@/components/organisms/admin/AdminLoginGate";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Yönetici",
  description: "Cevizoğulları içerik ve ön muhasebe paneli",
  path: "/admin",
  noIndex: true,
});

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  return <AdminLoginGate initiallyAuthed={authed} />;
}
