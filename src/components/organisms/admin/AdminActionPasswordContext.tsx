"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { ADMIN_ACTION_PASSWORD_HEADER } from "@/lib/admin-action-password-shared";

type ResolveFn = (password: string | null) => void;

type AdminActionPasswordContextValue = {
  /** Kullanicidan guvenlik sifresi ister; vazgecerse null. */
  requestActionPassword: (purpose?: string) => Promise<string | null>;
  /** Sifreyi header'a ekleyerek fetch yapar. Vazgecilirse null doner. */
  adminMutationFetch: (
    input: RequestInfo | URL,
    init?: RequestInit,
    purpose?: string,
  ) => Promise<Response | null>;
};

const AdminActionPasswordContext =
  createContext<AdminActionPasswordContextValue | null>(null);

export function AdminActionPasswordProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState("Bu islemi kaydetmek icin");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const resolveRef = useRef<ResolveFn | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descId = useId();

  const close = useCallback((value: string | null) => {
    setOpen(false);
    setPassword("");
    setLocalError(null);
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.(value);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close, open]);

  const requestActionPassword = useCallback(
    (nextPurpose = "Bu işlemi kaydetmek için") => {
      return new Promise<string | null>((resolve) => {
        if (resolveRef.current) {
          resolveRef.current(null);
        }
        resolveRef.current = resolve;
        setPurpose(nextPurpose);
        setPassword("");
        setLocalError(null);
        setOpen(true);
        queueMicrotask(() => inputRef.current?.focus());
      });
    },
    [],
  );

  const adminMutationFetch = useCallback(
    async (
      input: RequestInfo | URL,
      init?: RequestInit,
      fetchPurpose?: string,
    ) => {
      const actionPassword = await requestActionPassword(fetchPurpose);
      if (actionPassword === null) return null;
      const headers = new Headers(init?.headers);
      headers.set(ADMIN_ACTION_PASSWORD_HEADER, actionPassword);
      return fetch(input, { ...init, headers });
    },
    [requestActionPassword],
  );

  const value = useMemo(
    () => ({ requestActionPassword, adminMutationFetch }),
    [requestActionPassword, adminMutationFetch],
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) {
      setLocalError("Güvenlik şifresi gerekli");
      return;
    }
    close(trimmed);
  }

  return (
    <AdminActionPasswordContext.Provider value={value}>
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
            aria-label="Diyaloğu kapat"
            onClick={() => close(null)}
          />
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            onSubmit={submit}
            className="relative z-10 w-full max-w-md rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
          >
            <h2
              id={titleId}
              className="font-display text-xl font-semibold text-ink-900"
            >
              Güvenlik şifresi
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-ink-600">
              {purpose}. Yanlış şifrede işlem kaydedilmez.
            </p>
            <div className="mt-4">
              <Label htmlFor="admin-action-password">Şifre</Label>
              <Input
                ref={inputRef}
                id="admin-action-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setLocalError(null);
                }}
                required
              />
              {localError ? (
                <p className="mt-2 text-sm text-red-700">{localError}</p>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => close(null)}
              >
                Vazgeç
              </Button>
              <Button type="submit" size="sm">
                Onayla ve kaydet
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminActionPasswordContext.Provider>
  );
}

export function useAdminActionPassword() {
  const ctx = useContext(AdminActionPasswordContext);
  if (!ctx) {
    throw new Error(
      "useAdminActionPassword AdminActionPasswordProvider içinde kullanılmalı",
    );
  }
  return ctx;
}
