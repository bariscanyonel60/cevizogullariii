"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import {
  accountingPdfFilename,
  type AccountingPdfKind,
} from "@/lib/accounting-types";

type Props = {
  kind: AccountingPdfKind;
  date?: string;
  month?: string;
  disabled?: boolean;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
  label?: string;
};

export function AccountingPdfButton({
  kind,
  date,
  month,
  disabled,
  onError,
  onMessage,
  label = "PDF indir",
}: Props) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    onError(null);
    onMessage(null);
    const params = new URLSearchParams({ kind });
    if (date) params.set("date", date);
    if (month) params.set("month", month);
    const fallback = accountingPdfFilename(kind, date || month || "rapor");
    try {
      const res = await fetch(
        `/api/admin/accounting/section-pdf?${params.toString()}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "PDF indirilemedi");
      }
      const blob = await res.blob();
      const header = res.headers.get("Content-Disposition") ?? "";
      const match = header.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? fallback;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      onMessage("PDF indirildi");
    } catch (err) {
      onError(err instanceof Error ? err.message : "PDF indirilemedi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      disabled={disabled || busy}
      onClick={() => void download()}
    >
      <FileDown className="size-4" />
      {busy ? "PDF…" : label}
    </Button>
  );
}
