"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { AdminShell } from "@/components/organisms/admin/AdminShell";

export function AdminLoginGate({ initiallyAuthed }: { initiallyAuthed: boolean }) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authed) {
    return <AdminShell />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Giriş başarısız");
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="w-full max-w-md space-y-5 rounded-3xl bg-ivory-50 p-8 shadow-premium"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Cevizoğulları
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">
            Yönetici girişi
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Site içeriği, görseller ve ön muhasebe için giriş yapın. Sitede görünmez.
          </p>
        </div>
        <div>
          <Label htmlFor="admin-username">Kullanıcı adı</Label>
          <Input
            id="admin-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="admin-password">Şifre</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Kontrol ediliyor..." : "Giriş yap"}
        </Button>
      </form>
    </div>
  );
}
