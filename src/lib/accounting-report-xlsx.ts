import ExcelJS from "exceljs";
import { SITE } from "@/lib/constants";
import {
  formatChangePercent,
  paymentMethodRows,
  type MonthlyReport,
  type ReportGroupRow,
} from "@/lib/accounting-report";

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

type Column = {
  header: string;
  money?: boolean;
  quantity?: boolean;
};

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  row.height = 22;
}

/** Başlıklı tablo yazar, bitişteki satır numarasını döner. */
function writeTable(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  title: string,
  columns: Column[],
  rows: (string | number)[][],
  totalRow?: (string | number)[],
): number {
  sheet.getCell(startRow, 1).value = title;
  sheet.getCell(startRow, 1).font = { bold: true, size: 13, color: { argb: "FF295B2D" } };

  const headerRow = sheet.getRow(startRow + 1);
  columns.forEach((column, index) => {
    headerRow.getCell(index + 1).value = column.header;
  });
  styleHeader(headerRow);

  let rowNumber = startRow + 2;
  const writeRow = (values: (string | number)[], bold: boolean) => {
    const row = sheet.getRow(rowNumber);
    values.forEach((value, index) => {
      const cell = row.getCell(index + 1);
      cell.value = value;
      if (typeof value === "number") {
        if (columns[index]?.money) cell.numFmt = MONEY_FMT;
        if (columns[index]?.quantity) cell.numFmt = QTY_FMT;
      }
    });
    if (bold) row.font = { bold: true };
    rowNumber += 1;
  };

  if (rows.length === 0) {
    sheet.getCell(rowNumber, 1).value = "Bu dönemde kayıt yok.";
    sheet.getCell(rowNumber, 1).font = { italic: true, color: { argb: "FF6B7280" } };
    rowNumber += 1;
  } else {
    rows.forEach((values) => writeRow(values, false));
    if (totalRow) writeRow(totalRow, true);
  }
  return rowNumber + 1;
}

function groupTable(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  title: string,
  firstHeader: string,
  rows: ReportGroupRow[],
): number {
  return writeTable(
    sheet,
    startRow,
    title,
    [
      { header: firstHeader },
      { header: "Kayıt" },
      { header: "Tutar", money: true },
    ],
    rows.map((row) => [row.label, row.count, row.total]),
    [
      "TOPLAM",
      rows.reduce((sum, row) => sum + row.count, 0),
      rows.reduce((sum, row) => sum + row.total, 0),
    ],
  );
}

function setWidths(sheet: ExcelJS.Worksheet, widths: number[]) {
  sheet.columns = widths.map((width) => ({ width }));
}

export async function buildMonthlyExcel(report: MonthlyReport): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = SITE.shortName;
  workbook.created = new Date();
  workbook.title = `${SITE.shortName} aylık rapor — ${report.label}`;

  const summary = workbook.addWorksheet("Özet", {
    views: [{ showGridLines: false }],
  });
  setWidths(summary, [36, 22, 22, 14]);
  summary.mergeCells("A1:D1");
  summary.getCell("A1").value = `${SITE.name} — Aylık muhasebe raporu`;
  summary.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF295B2D" } };
  summary.getCell("A2").value = "Dönem";
  summary.getCell("B2").value = report.label;
  summary.getCell("A3").value = "Rapor tarihi";
  summary.getCell("B3").value = report.generatedAt;

  let row = writeTable(
    summary,
    5,
    "Genel özet",
    [
      { header: "Kalem" },
      { header: "Değer", money: true },
    ],
    [
      ["Toplam satış (KDV dahil)", report.salesTotals.gross],
      ["Net satış", report.salesTotals.net],
      ["KDV", report.salesTotals.vat],
      ["Ortalama satış tutarı", report.salesTotals.averageTicket],
      ["Gider toplam", report.expenseTotals.total],
      ["Firma ödemeleri", report.cash.supplierPaymentTotal],
      ["Personel avansı", report.advanceTotal],
      ["Nakit kasa giren", report.cash.cashIn],
      ["Nakit kasa çıkan", report.cash.cashOut],
      ["Net nakit kasa", report.cash.cashNet],
      ["Veresiye satış (dönem)", report.creditTotals.purchases],
      ["Veresiye tahsilat (dönem)", report.creditTotals.payments],
      ["Açık veresiye (güncel)", report.outstanding],
      ["Geciken veresiye", report.overdueTotal],
    ],
  );
  summary.getCell(row - 1, 1).value = `İşlem adedi: ${report.salesTotals.count} · Satış yapılan gün: ${report.salesTotals.activeDays} · Geciken müşteri: ${report.overdueCount}`;
  row += 1;

  row = writeTable(
    summary,
    row,
    `Önceki ayla karşılaştırma (${report.previousLabel})`,
    [
      { header: "Kalem" },
      { header: report.label, money: true },
      { header: report.previousLabel, money: true },
      { header: "Değişim" },
    ],
    report.comparison.map((item) => [
      item.label,
      item.isCount ? String(item.current) : item.current,
      item.isCount ? String(item.previous) : item.previous,
      formatChangePercent(item.changePercent),
    ]),
  );

  row = writeTable(
    summary,
    row,
    "Ödeme yöntemine göre",
    [
      { header: "Yöntem" },
      { header: "Satış", money: true },
      { header: "Gider", money: true },
    ],
    paymentMethodRows(report).map((item) => [item.label, item.sales, item.expenses]),
  );

  summary.getCell(row, 1).value =
    "Satış tutarları KDV dahildir. Net nakit kasa = nakit satış + nakit tahsilat − nakit gider − avans − nakit firma ödemesi. Bu rapor yalnızca yönetici paneli içindir.";
  summary.getCell(row, 1).font = { italic: true, size: 9, color: { argb: "FF6B7280" } };

  const sales = workbook.addWorksheet("Satış Özeti");
  setWidths(sales, [36, 14, 16, 16, 16]);
  let salesRow = writeTable(
    sales,
    1,
    "Haftalık gidişat",
    [
      { header: "Hafta" },
      { header: "İşlem" },
      { header: "Satış", money: true },
      { header: "Gider", money: true },
      { header: "Firma ödemesi", money: true },
    ],
    report.weeks.map((item) => [
      item.label,
      item.saleCount,
      item.salesGross,
      item.expenseTotal,
      item.supplierTotal,
    ]),
  );
  salesRow = groupTable(sales, salesRow, "İşlem türüne göre", "Tür", report.salesByKind);
  salesRow = writeTable(
    sales,
    salesRow,
    "KDV oranına göre",
    [
      { header: "KDV" },
      { header: "Net", money: true },
      { header: "KDV tutarı", money: true },
      { header: "Toplam", money: true },
    ],
    report.salesByVat.map((item) => [item.label, item.net, item.vat, item.gross]),
  );
  writeTable(
    sales,
    salesRow,
    "En çok satan ürünler",
    [
      { header: "Ürün" },
      { header: "İşlem" },
      { header: "Miktar", quantity: true },
      { header: "Tutar", money: true },
    ],
    [
      ...report.topProducts.map((item) => [
        item.productName,
        item.count,
        item.quantity,
        item.gross,
      ]),
      ...(report.otherProducts
        ? [[
            report.otherProducts.productName,
            report.otherProducts.count,
            "—",
            report.otherProducts.gross,
          ]]
        : []),
    ],
  );

  const expenses = workbook.addWorksheet("Gider ve Ödemeler");
  setWidths(expenses, [36, 14, 18]);
  let expenseRow = groupTable(
    expenses,
    1,
    "Gider kategorileri",
    "Kategori",
    report.expensesByCategory,
  );
  expenseRow = groupTable(
    expenses,
    expenseRow,
    "Firma ödemeleri",
    "Firma",
    report.supplierPayments,
  );
  groupTable(
    expenses,
    expenseRow,
    "Personel avansları",
    "Personel",
    report.advancesByStaff,
  );

  const customers = workbook.addWorksheet("Müşteri Bakiyeleri");
  customers.columns = [
    { header: "Müşteri", key: "name", width: 28 },
    { header: "T.C.", key: "tc", width: 16 },
    { header: "Telefon", key: "phone", width: 16 },
    { header: "Adres", key: "address", width: 36 },
    { header: "Dönem borç", key: "periodPurchases", width: 14 },
    { header: "Dönem tahsilat", key: "periodPayments", width: 16 },
    { header: "Güncel bakiye", key: "balance", width: 16 },
    { header: "Ödeme tarihi", key: "nextDueDate", width: 14 },
    { header: "Geciken tutar", key: "overdueAmount", width: 16 },
    { header: "Gecikme (gün)", key: "overdueDays", width: 14 },
  ];
  styleHeader(customers.getRow(1));
  report.customers.forEach((item) => {
    const added = customers.addRow(item);
    added.getCell("periodPurchases").numFmt = MONEY_FMT;
    added.getCell("periodPayments").numFmt = MONEY_FMT;
    added.getCell("balance").numFmt = MONEY_FMT;
    added.getCell("overdueAmount").numFmt = MONEY_FMT;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
