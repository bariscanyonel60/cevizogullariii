"use client";

import { useMemo, useState } from "react";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { formatTry } from "@/lib/accounting-money";
import { buildMonthlyReport, reportFilename } from "@/lib/accounting-report";
import {
  istanbulYearMonth,
  type AccountingStore,
  type ReportFormat,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export function AccountingReportsPanel({
  store,
  busy,
  onError,
  onMessage,
}: Props) {
  const [month, setMonth] = useState(istanbulYearMonth());
  const [downloading, setDownloading] = useState<ReportFormat | null>(null);

  const report = useMemo(() => buildMonthlyReport(store, month), [month, store]);

  async function download(format: ReportFormat) {
    setDownloading(format);
    onError(null);
    onMessage(null);
    try {
      const res = await fetch(
        `/api/admin/accounting/report?month=${encodeURIComponent(month)}&format=${format}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Rapor indirilemedi");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = reportFilename(month, format);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      onMessage(
        format === "xlsx"
          ? `${report.label} Excel raporu indirildi`
          : `${report.label} PDF raporu indirildi`,
      );
    } catch (err) {
      onError(err instanceof Error ? err.message : "Rapor indirilemedi");
    } finally {
      setDownloading(null);
    }
  }

  const locked = busy || downloading !== null;

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900">
              Aylık rapor
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              Seçilen ayın satış, avans ve veresiye özetini Excel veya PDF olarak
              indirin.
            </p>
          </div>
          <div className="w-full sm:w-56">
            <Label htmlFor="report-month">Ay</Label>
            <Input
              id="report-month"
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={locked}
            onClick={() => void download("xlsx")}
          >
            <FileSpreadsheet className="size-4" />
            {downloading === "xlsx" ? "Excel hazırlanıyor…" : "Excel indir"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={locked}
            onClick={() => void download("pdf")}
          >
            <FileText className="size-4" />
            {downloading === "pdf" ? "PDF hazırlanıyor…" : "PDF indir"}
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PreviewCard
          label="Dönem satış"
          value={formatTry(report.salesTotals.gross)}
          hint={`${report.salesTotals.count} işlem · KDV ${formatTry(report.salesTotals.vat)}`}
        />
        <PreviewCard
          label="Nakit / kart"
          value={`${formatTry(report.salesTotals.cash)} / ${formatTry(report.salesTotals.card)}`}
        />
        <PreviewCard
          label="Personel avansı"
          value={formatTry(report.advanceTotal)}
          hint={`${report.advances.length} kayıt`}
        />
        <PreviewCard
          label="Açık veresiye"
          value={formatTry(report.outstanding)}
          hint={`Dönem borç ${formatTry(report.creditTotals.purchases)}`}
        />
      </section>

      <p className="flex items-center gap-2 text-xs text-ink-400">
        <FileDown className="size-3.5" />
        Dosya adı: {reportFilename(month, "xlsx")} veya{" "}
        {reportFilename(month, "pdf")}
      </p>
    </div>
  );
}

function PreviewCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="mt-2 font-display text-xl font-bold text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </article>
  );
}
