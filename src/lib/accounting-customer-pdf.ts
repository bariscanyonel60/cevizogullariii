import {
  creditLedgerNewestFirst,
  customerBalance,
  customerCreditStatus,
  formatQuantity,
  formatTry,
} from "@/lib/accounting-money";
import {
  creditKindLabel,
  customerFullName,
  formatIsoDateTr,
  istanbulIsoDate,
  paymentMethodLabel,
  type CreditEntry,
  type Customer,
} from "@/lib/accounting-types";
import { SITE } from "@/lib/constants";
import {
  PDF_CONTINUATION_Y,
  PDF_MARGIN,
  createBrandedPdf,
  type PdfDoc,
} from "@/lib/pdf-brand";

function formatDateTr(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function slugName(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function customerCreditPdfFilename(customer: Customer) {
  const slug = slugName(customerFullName(customer)) || "musteri";
  return `cevizogullari-veresiye-${slug}.pdf`;
}

function formatDebt(value: number) {
  if (value < 0) return `Alacak ${formatTry(-value)}`;
  return formatTry(value);
}

function entryLabel(entry: CreditEntry) {
  switch (entry.kind) {
    case "purchase":
      return creditKindLabel(entry.kind);
    case "payment": {
      const method = entry.paymentMethod
        ? paymentMethodLabel(entry.paymentMethod)
        : "";
      return method
        ? `${creditKindLabel(entry.kind)} · ${method}`
        : creditKindLabel(entry.kind);
    }
    default: {
      const _exhaustive: never = entry.kind;
      return _exhaustive;
    }
  }
}

function entryDetail(entry: CreditEntry) {
  const qty =
    entry.kind === "purchase" && entry.quantity
      ? `${formatQuantity(entry.quantity)}${entry.unit ? ` ${entry.unit}` : ""}`
      : "";
  const parts = [entry.productName, qty, entry.note].filter(Boolean);
  if (entry.kind === "purchase" && entry.dueDate) {
    parts.push(`Vade ${formatIsoDateTr(entry.dueDate)}`);
  }
  return parts.join(" — ") || "—";
}

function entryAmount(entry: CreditEntry) {
  switch (entry.kind) {
    case "purchase":
      return `−${formatTry(entry.amount)}`;
    case "payment":
      return `+${formatTry(entry.amount)}`;
    default: {
      const _exhaustive: never = entry.kind;
      return _exhaustive;
    }
  }
}

function drawInfo(
  doc: PdfDoc,
  y: number,
  label: string,
  value: string,
  x: number,
  width: number,
) {
  doc.fontSize(8).fillColor("#6B7280").text(label, x, y, { width });
  doc.fontSize(10).fillColor("#111827").text(value || "—", x, y + 12, {
    width,
    lineBreak: false,
    ellipsis: true,
  });
}

export async function buildCustomerCreditPdf(
  customer: Customer,
  entries: CreditEntry[],
): Promise<Buffer> {
  const { doc, done } = await createBrandedPdf({
    title: "Veresiye hesap özeti",
    subtitle: `Çıktı tarihi: ${formatDateTr(istanbulIsoDate())}`,
    infoTitle: `${SITE.shortName} veresiye — ${customerFullName(customer)}`,
  });

  const margin = PDF_MARGIN;
  const pageWidth = doc.page.width;
  const inner = pageWidth - margin * 2;
  let y = doc.y;

  doc
    .roundedRect(margin, y, inner, 72, 8)
    .fill("#F3F8F3");
  drawInfo(doc, y + 10, "Müşteri", customerFullName(customer), margin + 12, 220);
  drawInfo(doc, y + 10, "T.C.", customer.tc || "—", margin + 250, 140);
  drawInfo(doc, y + 10, "Telefon", customer.phone || "—", margin + 400, 140);
  drawInfo(doc, y + 42, "Adres", customer.address || "—", margin + 12, inner - 24);
  y += 88;

  const purchases = entries
    .filter((entry) => entry.kind === "purchase")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const payments = entries
    .filter((entry) => entry.kind === "payment")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const balance = customerBalance(entries);
  const status = customerCreditStatus(entries, istanbulIsoDate());
  const dueLabel = status.isOverdue
    ? `Gecikmiş ${status.overdueDays} gün`
    : status.nextDueDate
      ? formatIsoDateTr(status.nextDueDate)
      : "—";
  const cards: [string, string][] = [
    ["Toplam alış", formatTry(purchases)],
    ["Toplam tahsilat", formatTry(payments)],
    ["Güncel borç", formatDebt(balance)],
    ["Vade / gecikme", dueLabel],
  ];
  const cardWidth = (inner - 24) / 4;
  cards.forEach((card, index) => {
    const x = margin + index * (cardWidth + 8);
    doc.roundedRect(x, y, cardWidth, 44, 8).fillAndStroke("#FFFFFF", "#D7E4D8");
    doc.fontSize(8).fillColor("#6B7280").text(card[0], x + 10, y + 8, {
      width: cardWidth - 20,
    });
    doc.fontSize(11).fillColor("#111827").text(card[1], x + 10, y + 22, {
      width: cardWidth - 20,
    });
  });
  y += 60;

  const rows = creditLedgerNewestFirst(entries).slice().reverse();
  const headers = ["Tarih", "İşlem", "Açıklama", "Tutar", "Güncel borç"];
  const widths = [72, 110, 168, 90, 90];

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.page.height - 48) {
      doc.addPage();
      y = PDF_CONTINUATION_Y;
    }
  };

  const drawTableHeader = () => {
    ensureSpace(22);
    doc.rect(margin, y, inner, 20).fill("#295B2D");
    doc.fillColor("#ffffff").fontSize(8);
    let x = margin + 4;
    headers.forEach((header, index) => {
      doc.text(header, x, y + 5, { width: widths[index] - 6, lineBreak: false });
      x += widths[index];
    });
    y += 22;
  };

  doc.fontSize(12).fillColor("#295B2D").text("Hesap hareketleri", margin, y);
  y += 20;
  drawTableHeader();

  if (rows.length === 0) {
    doc
      .fillColor("#6B7280")
      .fontSize(9)
      .text("Bu kartta henüz hareket yok.", margin, y);
    y += 24;
  } else {
    rows.forEach((row, rowIndex) => {
      ensureSpace(18);
      if (y === PDF_CONTINUATION_Y) drawTableHeader();
      if (rowIndex % 2 === 0) {
        doc.rect(margin, y - 2, inner, 16).fill("#F3F8F3");
      }
      const cells = [
        formatDateTr(row.date),
        entryLabel(row),
        entryDetail(row),
        entryAmount(row),
        formatDebt(row.runningDebt),
      ];
      doc.fillColor("#111827").fontSize(8);
      let x = margin + 4;
      cells.forEach((cell, index) => {
        doc.text(cell, x, y, {
          width: widths[index] - 6,
          lineBreak: false,
          ellipsis: true,
        });
        x += widths[index];
      });
      y += 16;
    });
  }

  doc
    .fontSize(8)
    .fillColor("#6B7280")
    .text(
      "Borç satırları −, tahsilat satırları + olarak gösterilir. Bu belge Cevizoğulları yönetici panelinden üretilmiştir.",
      margin,
      Math.max(y + 16, doc.page.height - 36),
      { width: inner },
    );

  doc.end();
  return done;
}
