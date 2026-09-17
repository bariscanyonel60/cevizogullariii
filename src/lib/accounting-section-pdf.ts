import {
  customerCreditStatus,
  dayCashSummary,
  formatCreditDueHint,
  formatOpenBalance,
  formatQuantity,
  formatTry,
  monthCashSummary,
  saleGross,
  splitVat,
} from "@/lib/accounting-money";
import {
  drawPdfFooter,
  drawPdfSummaryRows,
  drawPdfTable,
} from "@/lib/accounting-pdf-layout";
import {
  accountingPdfFilename,
  creditKindLabel,
  customerFullName,
  expenseCategoryLabel,
  formatIsoDateTr,
  formatYearMonthTr,
  istanbulIsoDate,
  istanbulYearMonth,
  paymentMethodLabel,
  type AccountingPdfKind,
  type AccountingStore,
} from "@/lib/accounting-types";
import { SITE } from "@/lib/constants";
import { createBrandedPdf } from "@/lib/pdf-brand";

export type SectionPdfParams = {
  date?: string;
  month?: string;
};

export async function buildAccountingSectionPdf(
  store: AccountingStore,
  kind: AccountingPdfKind,
  params: SectionPdfParams,
): Promise<{ body: Buffer; filename: string }> {
  switch (kind) {
    case "summary":
      return buildSummaryPdf(store);
    case "sales":
      return buildSalesPdf(store, requiredDate(params.date));
    case "staff":
      return buildStaffPdf(store, requiredMonth(params.month));
    case "customers":
      return buildCustomersPdf(store);
    case "expenses":
      return buildExpensesPdf(store, requiredDate(params.date));
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function requiredDate(value: string | undefined): string {
  const date = value?.trim() || istanbulIsoDate();
  return date;
}

function requiredMonth(value: string | undefined): string {
  return value?.trim() || istanbulYearMonth();
}

async function buildSummaryPdf(store: AccountingStore) {
  const today = istanbulIsoDate();
  const month = istanbulYearMonth();
  const todaySales = store.sales.filter((sale) => sale.date === today);
  const monthSales = store.sales.filter((sale) => sale.date.startsWith(month));
  const todayCash = dayCashSummary(store, today);
  const monthCash = monthCashSummary(store, month);
  const monthAdvances = store.advances.filter((item) =>
    item.date.startsWith(month),
  );

  function saleTotals(list: typeof store.sales) {
    return list.reduce(
      (acc, sale) => {
        const gross = saleGross(sale.quantity, sale.unitPrice);
        const { vatAmount } = splitVat(gross, sale.vatRate);
        acc.gross += gross;
        acc.vat += vatAmount;
        switch (sale.paymentMethod) {
          case "nakit":
            acc.cash += gross;
            break;
          case "kart":
            acc.card += gross;
            break;
          case "havale":
            acc.transfer += gross;
            break;
          default: {
            const _exhaustive: never = sale.paymentMethod;
            return _exhaustive;
          }
        }
        return acc;
      },
      { gross: 0, vat: 0, cash: 0, card: 0, transfer: 0 },
    );
  }

  const todayTotals = saleTotals(todaySales);
  const monthTotals = saleTotals(monthSales);
  const cards = store.customers.map((customer) =>
    customerCreditStatus(
      store.creditEntries.filter((entry) => entry.customerId === customer.id),
      today,
    ),
  );
  const outstanding = cards.reduce((sum, item) => sum + item.balance, 0);
  const overdueTotal = cards.reduce((sum, item) => sum + item.overdueAmount, 0);
  const debtorCount = cards.filter((item) => item.balance > 0).length;
  const overdueCount = cards.filter((item) => item.isOverdue).length;
  const staffAdvances = store.staff
    .map((member) => ({
      name: member.name,
      amount: monthAdvances
        .filter((item) => item.staffId === member.id)
        .reduce((sum, item) => sum + item.amount, 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const { doc, done } = await createBrandedPdf({
    title: "Ön muhasebe özeti",
    subtitle: `${formatIsoDateTr(today)}  ·  ${formatYearMonthTr(month)}`,
    infoTitle: `${SITE.shortName} muhasebe özeti`,
  });

  drawPdfSummaryRows(doc, [
    ["Bugünkü satış", formatTry(todayTotals.gross)],
    ["Bugün KDV", formatTry(todayTotals.vat)],
    ["Bugün net nakit kasa", formatTry(todayCash.cashNet)],
    ["Bugünkü gider", formatTry(todayCash.expenseTotal)],
    ["Açık veresiye", formatTry(outstanding)],
    ["Borçlu / geciken", `${debtorCount} / ${overdueCount}`],
    ["Geciken tutar", formatTry(overdueTotal)],
    ["Bu ay satış", formatTry(monthTotals.gross)],
    ["Bu ay nakit / kart / havale", `${formatTry(monthTotals.cash)} / ${formatTry(monthTotals.card)} / ${formatTry(monthTotals.transfer)}`],
    ["Bu ay net nakit kasa", formatTry(monthCash.cashNet)],
    ["Bu ay gider", formatTry(monthCash.expenseTotal)],
    ["Bu ay personel avansı", formatTry(
      monthAdvances.reduce((sum, item) => sum + item.amount, 0),
    )],
  ]);

  drawPdfTable(
    doc,
    "Bu ay avans alan personel",
    ["Personel", "Tutar"],
    staffAdvances.map((item) => [item.name, formatTry(item.amount)]),
    [400, 140],
  );

  drawPdfFooter(
    doc,
    "Tutarlar KDV dahildir. Bu belge Cevizoğulları yönetici panelinden üretilmiştir.",
  );
  doc.end();
  return {
    body: await done,
    filename: accountingPdfFilename("summary", today),
  };
}

async function buildSalesPdf(store: AccountingStore, date: string) {
  const daySales = store.sales.filter((sale) => sale.date === date);
  const totals = daySales.reduce(
    (acc, sale) => {
      const gross = saleGross(sale.quantity, sale.unitPrice);
      const parts = splitVat(gross, sale.vatRate);
      acc.gross += parts.gross;
      acc.net += parts.net;
      acc.vat += parts.vatAmount;
      switch (sale.paymentMethod) {
        case "nakit":
          acc.cash += parts.gross;
          break;
        case "kart":
          acc.card += parts.gross;
          break;
        case "havale":
          acc.transfer += parts.gross;
          break;
        default: {
          const _exhaustive: never = sale.paymentMethod;
          return _exhaustive;
        }
      }
      return acc;
    },
    { gross: 0, net: 0, vat: 0, cash: 0, card: 0, transfer: 0 },
  );

  const { doc, done } = await createBrandedPdf({
    title: "Günlük satış",
    subtitle: formatIsoDateTr(date),
    layout: "landscape",
    infoTitle: `${SITE.shortName} günlük satış ${date}`,
  });

  drawPdfSummaryRows(doc, [
    ["İşlem", String(daySales.length)],
    ["Toplam (KDV dahil)", formatTry(totals.gross)],
    ["Net", formatTry(totals.net)],
    ["KDV", formatTry(totals.vat)],
    ["Nakit / kart / havale", `${formatTry(totals.cash)} / ${formatTry(totals.card)} / ${formatTry(totals.transfer)}`],
  ]);

  drawPdfTable(
    doc,
    "Satışlar",
    ["Ürün", "Miktar", "KDV", "Ödeme", "Not", "Tutar"],
    daySales.map((sale) => {
      const gross = saleGross(sale.quantity, sale.unitPrice);
      return [
        sale.productName,
        `${formatQuantity(sale.quantity)} × ${formatTry(sale.unitPrice)}`,
        `%${sale.vatRate}`,
        paymentMethodLabel(sale.paymentMethod),
        sale.note || "—",
        formatTry(gross),
      ];
    }),
    [220, 130, 60, 90, 160, 90],
  );

  drawPdfFooter(doc, "Birim fiyatlar KDV dahildir.");
  doc.end();
  return {
    body: await done,
    filename: accountingPdfFilename("sales", date),
  };
}

async function buildStaffPdf(store: AccountingStore, month: string) {
  const monthAdvances = store.advances.filter((item) =>
    item.date.startsWith(month),
  );
  const monthTotal = monthAdvances.reduce((sum, item) => sum + item.amount, 0);
  const perStaff = store.staff.map((member) => ({
    name: member.name,
    amount: monthAdvances
      .filter((item) => item.staffId === member.id)
      .reduce((sum, item) => sum + item.amount, 0),
  }));

  const { doc, done } = await createBrandedPdf({
    title: "Personel / avans",
    subtitle: formatYearMonthTr(month),
    layout: "landscape",
    infoTitle: `${SITE.shortName} personel avans ${month}`,
  });

  drawPdfSummaryRows(doc, [
    ["Personel sayısı", String(store.staff.length)],
    ["Avans kaydı", String(monthAdvances.length)],
    ["Dönem toplamı", formatTry(monthTotal)],
  ]);

  drawPdfTable(
    doc,
    "Personel özeti",
    ["Personel", "Dönem avansı"],
    perStaff.map((item) => [
      item.name,
      item.amount > 0 ? formatTry(item.amount) : "—",
    ]),
    [500, 140],
  );

  drawPdfTable(
    doc,
    "Avans hareketleri",
    ["Tarih", "Personel", "Tutar", "Not"],
    monthAdvances.map((item) => {
      const member = store.staff.find((candidate) => candidate.id === item.staffId);
      return [
        formatIsoDateTr(item.date),
        member?.name ?? "Silinmiş personel",
        formatTry(item.amount),
        item.note || "—",
      ];
    }),
    [90, 220, 100, 340],
  );

  drawPdfFooter(doc, "Avans nakit kasadan düşülür.");
  doc.end();
  return {
    body: await done,
    filename: accountingPdfFilename("staff", month),
  };
}

async function buildCustomersPdf(store: AccountingStore) {
  const today = istanbulIsoDate();
  const rows = store.customers
    .map((customer) => {
      const entries = store.creditEntries.filter(
        (entry) => entry.customerId === customer.id,
      );
      const status = customerCreditStatus(entries, today);
      return { customer, status, entries };
    })
    .sort((a, b) =>
      customerFullName(a.customer).localeCompare(
        customerFullName(b.customer),
        "tr-TR",
        { sensitivity: "base" },
      ),
    );

  const outstanding = rows.reduce((sum, item) => sum + item.status.balance, 0);
  const overdueTotal = rows.reduce(
    (sum, item) => sum + item.status.overdueAmount,
    0,
  );

  const { doc, done } = await createBrandedPdf({
    title: "Veresiye kartları",
    subtitle: `Çıktı: ${formatIsoDateTr(today)}`,
    layout: "landscape",
    infoTitle: `${SITE.shortName} veresiye listesi`,
  });

  drawPdfSummaryRows(doc, [
    ["Kart sayısı", String(store.customers.length)],
    ["Açık veresiye", formatTry(outstanding)],
    ["Geciken tutar", formatTry(overdueTotal)],
    [
      "Borçlu / geciken",
      `${rows.filter((item) => item.status.balance > 0).length} / ${rows.filter((item) => item.status.isOverdue).length}`,
    ],
  ]);

  drawPdfTable(
    doc,
    "Müşteri bakiyeleri",
    ["Müşteri", "Telefon", "Bakiye", "Vade / gecikme"],
    rows.map((item) => [
      customerFullName(item.customer),
      item.customer.phone || "—",
      formatOpenBalance(item.status.balance),
      formatCreditDueHint(item.status) ?? "—",
    ]),
    [220, 120, 160, 250],
  );

  const recent = [...store.creditEntries]
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, 40);

  drawPdfTable(
    doc,
    "Son hareketler",
    ["Tarih", "Müşteri", "İşlem", "Tutar"],
    recent.map((entry) => {
      const customer = store.customers.find(
        (item) => item.id === entry.customerId,
      );
      return [
        formatIsoDateTr(entry.date),
        customer ? customerFullName(customer) : "Silinmiş müşteri",
        creditKindLabel(entry.kind),
        formatTry(entry.amount),
      ];
    }),
    [90, 260, 160, 120],
  );

  drawPdfFooter(
    doc,
    "Gecikme, vadesi dolmuş ve henüz tahsil edilmemiş satışlara göre hesaplanır.",
  );
  doc.end();
  return {
    body: await done,
    filename: accountingPdfFilename("customers", today),
  };
}

async function buildExpensesPdf(store: AccountingStore, date: string) {
  const cash = dayCashSummary(store, date);
  const dayExpenses = (store.expenses ?? []).filter((item) => item.date === date);

  const { doc, done } = await createBrandedPdf({
    title: "Gider / kasa",
    subtitle: formatIsoDateTr(date),
    layout: "landscape",
    infoTitle: `${SITE.shortName} gider kasa ${date}`,
  });

  drawPdfSummaryRows(doc, [
    ["Nakit giren", formatTry(cash.cashIn)],
    ["Nakit çıkan", formatTry(cash.cashOut)],
    ["Net nakit kasa", formatTry(cash.cashNet)],
    ["Günün gideri", formatTry(cash.expenseTotal)],
    ["Nakit satış", formatTry(cash.cashSales)],
    ["Nakit tahsilat", formatTry(cash.cashCollections)],
    ["Nakit gider", formatTry(cash.cashExpenses)],
    ["Personel avansı", formatTry(cash.advances)],
  ]);

  drawPdfTable(
    doc,
    "Giderler",
    ["Açıklama", "Kategori", "KDV", "Ödeme", "Not", "Tutar"],
    dayExpenses.map((item) => [
      item.title,
      expenseCategoryLabel(item.category),
      item.vatRate === null ? "—" : `%${item.vatRate}`,
      paymentMethodLabel(item.paymentMethod),
      item.note || "—",
      formatTry(item.amount),
    ]),
    [200, 110, 60, 90, 180, 90],
  );

  drawPdfFooter(
    doc,
    "Net nakit kasa = nakit satış + nakit tahsilat − nakit gider − avans.",
  );
  doc.end();
  return {
    body: await done,
    filename: accountingPdfFilename("expenses", date),
  };
}
