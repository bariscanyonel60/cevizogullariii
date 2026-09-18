"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/atoms/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Evet, sil",
  cancelLabel = "Vazgeç",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [busy, open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
        aria-label="Diyaloğu kapat"
        disabled={busy}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-md rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <h2
          id={titleId}
          className="font-display text-xl font-semibold text-ink-900"
        >
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-ink-600">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            ref={cancelRef}
            type="button"
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={busy}
            className="bg-red-700 text-white hover:bg-red-600"
            onClick={onConfirm}
          >
            {busy ? "Siliniyor…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
