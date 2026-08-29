import { existsSync } from "node:fs";
import { join } from "node:path";
import PDFDocument from "pdfkit";
import { formatQuantity, formatTry } from "@/lib/accounting-money";
import type { MonthlyReport } from "@/lib/accounting-report";
import { SITE } from "@/lib/constants";

const FONT_CANDIDATES = [
  join(process.cwd(), "src/lib/fonts/DejaVuSans.ttf"),
  join(process.cwd(), "DejaVuSans.ttf"),
];

function fontPath() {
  const match = FONT_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!match) {
    throw new Error("Rapor yazı tipi bulunamadı");
  }
  return match;
}

type PdfDoc = InstanceType<typeof PDFDocument>;

function drawSummaryRow(
  doc: PdfDoc,
  y: number,
  label: string,
  value: string,
  pageWidth: number,
) {
  doc.fontSize(10).fillColor("#374151").text(label, 40, y, { width: 280 });
  doc.fillColor("#111827").text(value, 320, y, {
    width: pageWidth - 360,
    align: "right",
  });
}

function table(
  doc: PdfDoc,
  title: string,
  headers: string[],
  rows: string[][],
  widths: number[],
) {
  const pageWidth = doc.page.width;
  const margin = 40;
  let y = doc.y + 8;

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.page.height - 40) {
      doc.addPage();
      y = 40;
    }
  };

  ensureSpace(36);
  doc.fontSize(13).fillColor("#295B2D").text(title, margin, y);
  y = doc.y + 8;

  const drawHeader = () => {
    ensureSpace(22);
    doc.rect(margin, y, pageWidth - margin * 2, 20).fill("#295B2D");
    doc.fillColor("#ffffff").fontSize(8);
    let x = margin + 4;
    headers.forEach((header, index) => {
      doc.text(header, x, y + 5, { width: widths[index] - 6, lineBreak: false });
      x += widths[index];
    });
    y += 22;
  };

  drawHeader();

  if (rows.length === 0) {
    doc.fillColor("#6B7280").fontSize(9).text("Bu dönemde kayıt yok.", margin, y);
    doc.moveDown();
    return;
  }

  rows.forEach((row, rowIndex) => {
    ensureSpace(18);
    if (y === 40 && rowIndex > 0) drawHeader();
    if (rowIndex % 2 === 0) {
      doc.rect(margin, y - 2, pageWidth - margin * 2, 16).fill("#F3F8F3");
    }
    doc.fillColor("#111827").fontSize(8);
    let x = margin + 4;
    row.forEach((cell, index) => {
      doc.text(cell, x, y, {
        width: widths[index] - 6,
        lineBreak: false,
        ellipsis: true,
      });
      x += widths[index];
    });
    y += 16;
  });

  doc.y = y + 12;
}

export async function buildMonthlyPdf(report: MonthlyReport): Promise<Buffer> {
  const font = fontPath();
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 40,
    info: {
      Title: `${SITE.shortName} aylık rapor ${report.label}`,
      Author: SITE.name,
    },
  });
  doc.font(font);

  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const pageWidth = doc.page.width;
  doc.fontSize(18).fillColor("#295B2D").text(`${SITE.name} — Aylık muhasebe raporu`);
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor("#374151").text(`Dönem: ${report.label}`);
  doc.text(`Rapor tarihi: ${report.generatedAt}`);
  doc.moveDown(0.8);

  const summary: [string, string][] = [
    ["Satış adedi", String(report.salesTotals.count)],
    ["Toplam satış (KDV dahil)", formatTry(report.salesTotals.gross)],
    ["Net satış", formatTry(report.salesTotals.net)],
    ["KDV", formatTry(report.salesTotals.vat)],
    ["Nakit", formatTry(report.salesTotals.cash)],
    ["Kart", formatTry(report.salesTotals.card)],
    ["Personel avansı", formatTry(report.advanceTotal)],
    ["Veresiye satış (dönem)", formatTry(report.creditTotals.purchases)],
    ["Veresiye tahsilat (dönem)", formatTry(report.creditTotals.payments)],
    ["Açık veresiye (güncel)", formatTry(report.outstanding)],
  ];
  let y = doc.y;
  summary.forEach((item, index) => {
    drawSummaryRow(doc, y + index * 16, item[0], item[1], pageWidth);
  });
  doc.y = y + summary.length * 16 + 12;

  table(
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

  table(
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

  table(
    doc,
    "Veresiye hareketleri",
    ["Tarih", "Müşteri", "İşlem", "Ürün", "Tutar"],
    report.credit.map((row) => [
      row.date,
      row.customerName,
      row.kind,
      row.productName || "—",
      formatTry(row.amount),
    ]),
    [80, 180, 110, 180, 90],
  );

  table(
    doc,
    "Müşteri bakiyeleri",
    ["Müşteri", "T.C.", "Telefon", "Dönem borç", "Tahsilat", "Bakiye"],
    report.customers.map((row) => [
      row.name,
      row.tc || "—",
      row.phone,
      formatTry(row.periodPurchases),
      formatTry(row.periodPayments),
      formatTry(row.balance),
    ]),
    [150, 100, 100, 90, 90, 90],
  );

  doc.fontSize(8).fillColor("#6B7280").text(
    "Satış tutarları KDV dahildir. Bu rapor yalnızca yönetici paneli içindir.",
    40,
    doc.page.height - 30,
  );

  doc.end();
  return done;
}
