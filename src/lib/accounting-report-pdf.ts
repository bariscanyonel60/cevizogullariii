import { formatQuantity, formatTry } from "@/lib/accounting-money";
import {
  drawPdfFooter,
  drawPdfSummaryRows,
  drawPdfTable,
} from "@/lib/accounting-pdf-layout";
import type { MonthlyReport } from "@/lib/accounting-report";
import { SITE } from "@/lib/constants";
import { createBrandedPdf } from "@/lib/pdf-brand";

export async function buildMonthlyPdf(report: MonthlyReport): Promise<Buffer> {
  const { doc, done } = await createBrandedPdf({
    title: "Aylık muhasebe raporu",
    subtitle: `Dönem: ${report.label}  ·  Rapor tarihi: ${report.generatedAt}`,
    layout: "landscape",
    infoTitle: `${SITE.shortName} aylık rapor ${report.label}`,
  });

  drawPdfSummaryRows(doc, [
    ["Satış adedi", String(report.salesTotals.count)],
    ["Toplam satış (KDV dahil)", formatTry(report.salesTotals.gross)],
    ["Net satış", formatTry(report.salesTotals.net)],
    ["KDV", formatTry(report.salesTotals.vat)],
    ["Nakit satış", formatTry(report.salesTotals.cash)],
    ["Kart satış", formatTry(report.salesTotals.card)],
    ["Havale satış", formatTry(report.salesTotals.transfer)],
    ["Gider toplam", formatTry(report.expenseTotals.total)],
    ["Net nakit kasa", formatTry(report.cash.cashNet)],
    ["Personel avansı", formatTry(report.advanceTotal)],
    ["Veresiye satış (dönem)", formatTry(report.creditTotals.purchases)],
    ["Veresiye tahsilat (dönem)", formatTry(report.creditTotals.payments)],
    ["Açık veresiye (güncel)", formatTry(report.outstanding)],
    ["Geciken veresiye", formatTry(report.overdueTotal)],
    ["Geciken müşteri", String(report.overdueCount)],
  ]);

  drawPdfTable(
    doc,
    "Satışlar",
    ["Tarih", "Ürün", "Miktar", "KDV", "Ödeme", "Tutar"],
    report.sales.map((row) => [
      row.date,
      row.productName,
      formatQuantity(row.quantity),
      `%${row.vatRate}`,
      row.paymentMethod,
      formatTry(row.gross),
    ]),
    [80, 250, 70, 50, 70, 90],
  );

  drawPdfTable(
    doc,
    "Personel avansları",
    ["Tarih", "Personel", "Tutar", "Not"],
    report.advances.map((row) => [
      row.date,
      row.staffName,
      formatTry(row.amount),
      row.note || "—",
    ]),
    [90, 220, 100, 200],
  );

  drawPdfTable(
    doc,
    "Veresiye hareketleri",
    ["Tarih", "Müşteri", "İşlem", "Vade", "Tutar"],
    report.credit.map((row) => [
      row.date,
      row.customerName,
      row.kind,
      row.dueDate,
      formatTry(row.amount),
    ]),
    [80, 180, 110, 90, 90],
  );

  drawPdfTable(
    doc,
    "Giderler",
    ["Tarih", "Kategori", "Açıklama", "Ödeme", "Tutar"],
    report.expenses.map((row) => [
      row.date,
      row.category,
      row.title,
      row.paymentMethod,
      formatTry(row.amount),
    ]),
    [80, 110, 220, 90, 90],
  );

  drawPdfTable(
    doc,
    "Müşteri bakiyeleri",
    ["Müşteri", "Telefon", "Bakiye", "Vade", "Geciken"],
    report.customers.map((row) => [
      row.name,
      row.phone,
      formatTry(row.balance),
      row.nextDueDate,
      row.overdueAmount > 0 ? formatTry(row.overdueAmount) : "—",
    ]),
    [170, 110, 90, 90, 90],
  );

  drawPdfFooter(
    doc,
    "Satış tutarları KDV dahildir. Net nakit kasa = nakit satış + nakit tahsilat − nakit gider − avans.",
  );

  doc.end();
  return done;
}
