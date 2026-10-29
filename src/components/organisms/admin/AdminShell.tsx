"use client";

import { useState } from "react";
import { FilePenLine, Images, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { AccountingDashboard } from "@/components/organisms/admin/AccountingDashboard";
import { AdminDashboard } from "@/components/organisms/admin/AdminDashboard";
import { CmsDashboard } from "@/components/organisms/admin/CmsDashboard";

type AdminModule = "media" | "cms" | "accounting";

export function AdminShell() {
  const [module, setModule] = useState<AdminModule>("cms");

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen bg-ivory-50 px-4 py-8 md:px-8">
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Cevizoğulları
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 md:text-3xl">
            Yönetim paneli
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-earth-400/15 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setModule("cms")}
              aria-current={module === "cms" ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                module === "cms"
                  ? "bg-forest-800 text-white"
                  : "text-ink-600 hover:bg-mist-100"
              }`}
            >
              <FilePenLine className="size-4" />
              Site içeriği
            </button>
            <button
              type="button"
              onClick={() => setModule("media")}
              aria-current={module === "media" ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                module === "media"
                  ? "bg-forest-800 text-white"
                  : "text-ink-600 hover:bg-mist-100"
              }`}
            >
              <Images className="size-4" />
              Medya
            </button>
            <button
              type="button"
              onClick={() => setModule("accounting")}
              aria-current={module === "accounting" ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                module === "accounting"
                  ? "bg-forest-800 text-white"
                  : "text-ink-600 hover:bg-mist-100"
              }`}
            >
              <Wallet className="size-4" />
              Ön muhasebe
            </button>
          </div>
          <Button type="button" variant="secondary" onClick={() => void onLogout()}>
            <LogOut className="size-4" />
            Çıkış
          </Button>
        </div>
      </div>
      {module === "cms" ? (
        <CmsDashboard />
      ) : module === "media" ? (
        <AdminDashboard />
      ) : (
        <AccountingDashboard />
      )}
    </div>
  );
}
