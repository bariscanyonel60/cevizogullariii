import { formatQuantity, formatTry } from "@/lib/accounting-money";
import {
  drawPdfFooter,
  drawPdfSummaryRows,
  drawPdfTable,
} from "@/lib/accounting-pdf-layout";
import {
  formatChangePercent,
  paymentMethodRows,
  type MonthlyReport,
  type ReportGroupRow,
} from "@/lib/accounting-report";
import { SITE } from "@/lib/constants";
import { createBrandedPdf, type PdfDoc } from "@/lib/pdf-brand";

function drawGroupTable(
  doc: PdfDoc,
  title: string,
  firstHeader: string,
  rows: ReportGroupRow[],
) {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const count = rows.reduce((sum, row) => sum + row.count, 0);
  drawPdfTable(
    doc,
    title,
    [firstHeader, "Kayıt", "Tutar"],
    rows.length > 0
      ? [
          ...rows.map((row) => [row.label, String(row.count), formatTry(row.total)]),
          ["TOPLAM", String(count), formatTry(total)],
        ]
      : [],
    [300, 100, 140],
  );
}

export async function buildMonthlyPdf(report: MonthlyReport): Promise<Buffer> {
  const { doc, done } = await createBrandedPdf({
    title: "Aylık muhasebe raporu",
    subtitle: `Dönem: ${report.label}  ·  Rapor tarihi: ${report.generatedAt}`,
    layout: "landscape",
    infoTitle: `${SITE.shortName} aylık rapor ${report.label}`,
  });

  drawPdfSummaryRows(doc, [
    ["Toplam satış (KDV dahil)", formatTry(report.salesTotals.gross)],
    ["Net satış / KDV", `${formatTry(report.salesTotals.net)} / ${formatTry(report.salesTotals.vat)}`],
    ["İşlem adedi / satış yapılan gün", `${report.salesTotals.count} / ${report.salesTotals.activeDays}`],
    ["Ortalama satış tutarı", formatTry(report.salesTotals.averageTicket)],
    ["Gider toplam", formatTry(report.expenseTotals.total)],
    ["Firma ödemeleri", formatTry(report.cash.supplierPaymentTotal)],
    ["Personel avansı", formatTry(report.advanceTotal)],
    ["Nakit kasa giren / çıkan", `${formatTry(report.cash.cashIn)} / ${formatTry(report.cash.cashOut)}`],
    ["Net nakit kasa", formatTry(report.cash.cashNet)],
    ["Veresiye satış / tahsilat (dönem)", `${formatTry(report.creditTotals.purchases)} / ${formatTry(report.creditTotals.payments)}`],
    ["Açık veresiye (güncel)", formatTry(report.outstanding)],
    ["Geciken veresiye", `${formatTry(report.overdueTotal)} (${report.overdueCount} müşteri)`],
  ]);

  drawPdfTable(
    doc,
    `Önceki ayla karşılaştırma (${report.previousLabel})`,
    ["Kalem", report.label, report.previousLabel, "Değişim"],
    report.comparison.map((row) => [
      row.label,
      row.isCount ? String(row.current) : formatTry(row.current),
      row.isCount ? String(row.previous) : formatTry(row.previous),
      formatChangePercent(row.changePercent),
    ]),
    [200, 150, 150, 100],
  );

  drawPdfTable(
    doc,
    "Haftalık gidişat",
    ["Hafta", "İşlem", "Satış", "Gider", "Firma ödemesi"],
    report.weeks.map((row) => [
      row.label,
      String(row.saleCount),
      formatTry(row.salesGross),
      formatTry(row.expenseTotal),
      formatTry(row.supplierTotal),
    ]),
    [160, 80, 130, 130, 130],
  );

  drawPdfTable(
    doc,
    "Ödeme yöntemine göre",
    ["Yöntem", "Satış", "Gider"],
    paymentMethodRows(report).map((row) => [
      row.label,
      formatTry(row.sales),
      formatTry(row.expenses),
    ]),
    [200, 160, 160],
  );

  drawGroupTable(doc, "İşlem türüne göre satış", "Tür", report.salesByKind);

  drawPdfTable(
    doc,
    "KDV oranına göre satış",
    ["KDV", "Net", "KDV tutarı", "Toplam"],
    report.salesByVat.map((row) => [
      row.label,
      formatTry(row.net),
      formatTry(row.vat),
      formatTry(row.gross),
    ]),
    [120, 140, 140, 140],
  );

  drawPdfTable(
    doc,
    "En çok satan ürünler",
    ["Ürün", "İşlem", "Miktar", "Tutar"],
    [
      ...report.topProducts.map((row) => [
        row.productName,
        String(row.count),
        formatQuantity(row.quantity),
        formatTry(row.gross),
      ]),
      ...(report.otherProducts
        ? [[
            report.otherProducts.productName,
            String(report.otherProducts.count),
            "—",
            formatTry(report.otherProducts.gross),
          ]]
        : []),
    ],
    [300, 80, 100, 130],
  );

  drawGroupTable(doc, "Gider kategorileri", "Kategori", report.expensesByCategory);
  drawGroupTable(doc, "Firma ödemeleri", "Firma", report.supplierPayments);
  drawGroupTable(doc, "Personel avansları", "Personel", report.advancesByStaff);

  drawPdfTable(
    doc,
    "Müşteri bakiyeleri",
    ["Müşteri", "Telefon", "Dönem borç", "Dönem tahsilat", "Bakiye", "Geciken"],
    report.customers.map((row) => [
      row.name,
      row.phone,
      formatTry(row.periodPurchases),
      formatTry(row.periodPayments),
      formatTry(row.balance),
      row.overdueAmount > 0 ? formatTry(row.overdueAmount) : "—",
    ]),
    [170, 100, 100, 100, 100, 90],
  );

  drawPdfFooter(
    doc,
    "Satış tutarları KDV dahildir. Net nakit kasa = nakit satış + nakit tahsilat − nakit gider − avans − nakit firma ödemesi.",
  );

  doc.end();
  return done;
}
