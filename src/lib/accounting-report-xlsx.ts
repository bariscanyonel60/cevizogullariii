import ExcelJS from "exceljs";
import { SITE } from "@/lib/constants";
import type { MonthlyReport } from "@/lib/accounting-report";

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF295B2D" },
};
const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: "FFFFFFFF" },
  name: "Calibri",
  size: 11,
};
const MONEY_FMT = '#,##0.00 "₺"';
const QTY_FMT = "#,##0.###";

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  row.height = 22;
}

function addMoney(sheet: ExcelJS.Worksheet, row: number, col: number, value: number) {
  const cell = sheet.getCell(row, col);
  cell.value = value;
  cell.numFmt = MONEY_FMT;
}

export async function buildMonthlyExcel(report: MonthlyReport): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = SITE.shortName;
  workbook.created = new Date();
  workbook.title = `${SITE.shortName} aylık rapor — ${report.label}`;

  const summary = workbook.addWorksheet("Özet", {
    views: [{ showGridLines: false }],
  });
  summary.columns = [
    { width: 36 },
    { width: 22 },
  ];
  summary.mergeCells("A1:B1");
  summary.getCell("A1").value = `${SITE.name} — Aylık muhasebe raporu`;
  summary.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF295B2D" } };
  summary.getCell("A2").value = "Dönem";
  summary.getCell("B2").value = report.label;
  summary.getCell("A3").value = "Rapor tarihi";
  summary.getCell("B3").value = report.generatedAt;

  const summaryRows: [string, number | string][] = [
    ["Satış adedi", report.salesTotals.count],
    ["Toplam satış (KDV dahil)", report.salesTotals.gross],
    ["Net satış", report.salesTotals.net],
    ["KDV", report.salesTotals.vat],
    ["Nakit satış", report.salesTotals.cash],
    ["Kart satış", report.salesTotals.card],
    ["Havale satış", report.salesTotals.transfer],
    ["Gider toplam", report.expenseTotals.total],
    ["Nakit kasa giren", report.cash.cashIn],
    ["Nakit kasa çıkan", report.cash.cashOut],
    ["Net nakit kasa", report.cash.cashNet],
    ["Personel avansı", report.advanceTotal],
    ["Veresiye satış (dönem)", report.creditTotals.purchases],
    ["Veresiye tahsilat (dönem)", report.creditTotals.payments],
    ["Açık veresiye (güncel)", report.outstanding],
    ["Geciken veresiye", report.overdueTotal],
    ["Geciken müşteri", String(report.overdueCount)],
  ];
  summaryRows.forEach((item, index) => {
    const rowNumber = 5 + index;
    summary.getCell(rowNumber, 1).value = item[0];
    if (typeof item[1] === "number" && index > 0) {
      addMoney(summary, rowNumber, 2, item[1]);
    } else {
      summary.getCell(rowNumber, 2).value = item[1];
    }
  });
  summary.getCell("A20").value =
    "Satış tutarları KDV dahildir. Net nakit kasa = nakit satış + nakit tahsilat − nakit gider − avans. Bu rapor yalnızca yönetici paneli içindir.";
  summary.getCell("A20").font = { italic: true, size: 9, color: { argb: "FF6B7280" } };

  const sales = workbook.addWorksheet("Satışlar");
  sales.columns = [
    { header: "Tarih", key: "date", width: 14 },
    { header: "İşlem", key: "kind", width: 14 },
    { header: "Ürün", key: "productName", width: 36 },
    { header: "Miktar", key: "quantity", width: 12 },
    { header: "Birim fiyat", key: "unitPrice", width: 14 },
    { header: "KDV %", key: "vatRate", width: 10 },
    { header: "Net", key: "net", width: 14 },
    { header: "KDV tutarı", key: "vatAmount", width: 14 },
    { header: "Toplam", key: "gross", width: 14 },
    { header: "Ödeme", key: "paymentMethod", width: 12 },
    { header: "Not", key: "note", width: 24 },
  ];
  styleHeader(sales.getRow(1));
  report.sales.forEach((row) => {
    const added = sales.addRow(row);
    added.getCell("quantity").numFmt = QTY_FMT;
    added.getCell("unitPrice").numFmt = MONEY_FMT;
    added.getCell("net").numFmt = MONEY_FMT;
    added.getCell("vatAmount").numFmt = MONEY_FMT;
    added.getCell("gross").numFmt = MONEY_FMT;
  });
  if (report.sales.length > 0) {
    const total = sales.addRow({
      date: "",
      kind: "",
      productName: "TOPLAM",
      quantity: "",
      unitPrice: "",
      vatRate: "",
      net: report.salesTotals.net,
      vatAmount: report.salesTotals.vat,
      gross: report.salesTotals.gross,
      paymentMethod: "",
      note: "",
    });
    total.font = { bold: true };
    total.getCell("net").numFmt = MONEY_FMT;
    total.getCell("vatAmount").numFmt = MONEY_FMT;
    total.getCell("gross").numFmt = MONEY_FMT;
  }

  const advances = workbook.addWorksheet("Personel Avans");
  advances.columns = [
    { header: "Tarih", key: "date", width: 14 },
    { header: "Personel", key: "staffName", width: 28 },
    { header: "Tutar", key: "amount", width: 16 },
    { header: "Not", key: "note", width: 32 },
  ];
  styleHeader(advances.getRow(1));
  report.advances.forEach((row) => {
    const added = advances.addRow(row);
    added.getCell("amount").numFmt = MONEY_FMT;
  });
  if (report.advances.length > 0) {
    const total = advances.addRow({
      date: "",
      staffName: "TOPLAM",
      amount: report.advanceTotal,
      note: "",
    });
    total.font = { bold: true };
    total.getCell("amount").numFmt = MONEY_FMT;
  }

  const credit = workbook.addWorksheet("Veresiye Hareket");
  credit.columns = [
    { header: "Tarih", key: "date", width: 14 },
    { header: "Müşteri", key: "customerName", width: 28 },
    { header: "İşlem", key: "kind", width: 16 },
    { header: "Ürün", key: "productName", width: 28 },
    { header: "Tutar", key: "amount", width: 14 },
    { header: "KDV", key: "vatLabel", width: 10 },
    { header: "Ödeme", key: "paymentMethod", width: 12 },
    { header: "Vade", key: "dueDate", width: 12 },
    { header: "Not", key: "note", width: 24 },
  ];
  styleHeader(credit.getRow(1));
  report.credit.forEach((row) => {
    const added = credit.addRow(row);
    added.getCell("amount").numFmt = MONEY_FMT;
  });

  const customers = workbook.addWorksheet("Müşteri Bakiyeleri");
  customers.columns = [
    { header: "Müşteri", key: "name", width: 28 },
    { header: "T.C.", key: "tc", width: 16 },
    { header: "Telefon", key: "phone", width: 16 },
    { header: "Adres", key: "address", width: 36 },
    { header: "Dönem borç", key: "periodPurchases", width: 14 },
    { header: "Dönem tahsilat", key: "periodPayments", width: 16 },
    { header: "Güncel bakiye", key: "balance", width: 16 },
    { header: "Sonraki vade", key: "nextDueDate", width: 14 },
    { header: "Geciken tutar", key: "overdueAmount", width: 16 },
    { header: "Gecikme (gün)", key: "overdueDays", width: 14 },
  ];
  styleHeader(customers.getRow(1));
  report.customers.forEach((row) => {
    const added = customers.addRow(row);
    added.getCell("periodPurchases").numFmt = MONEY_FMT;
    added.getCell("periodPayments").numFmt = MONEY_FMT;
    added.getCell("balance").numFmt = MONEY_FMT;
    added.getCell("overdueAmount").numFmt = MONEY_FMT;
  });

  const expenses = workbook.addWorksheet("Giderler");
  expenses.columns = [
    { header: "Tarih", key: "date", width: 14 },
    { header: "Kategori", key: "category", width: 18 },
    { header: "Açıklama", key: "title", width: 32 },
    { header: "Tutar", key: "amount", width: 14 },
    { header: "KDV", key: "vatLabel", width: 10 },
    { header: "Ödeme", key: "paymentMethod", width: 14 },
    { header: "Not", key: "note", width: 24 },
  ];
  styleHeader(expenses.getRow(1));
  report.expenses.forEach((row) => {
    const added = expenses.addRow(row);
    added.getCell("amount").numFmt = MONEY_FMT;
  });
  if (report.expenses.length > 0) {
    const total = expenses.addRow({
      date: "",
      category: "",
      title: "TOPLAM",
      amount: report.expenseTotals.total,
      vatLabel: "",
      paymentMethod: "",
      note: "",
    });
    total.font = { bold: true };
    total.getCell("amount").numFmt = MONEY_FMT;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
