import { customerBalance, customerCreditStatus, monthCashSummary, roundMoney, saleSignedGross, splitVat } from "@/lib/accounting-money";
import {
  CASH_ZERO_TITLE,
  customerFullName,
  expenseCategoryLabel,
  formatIsoDateTr,
  formatYearMonthTr,
  istanbulIsoDate,
  PAYMENT_METHODS,
  paymentMethodLabel,
  saleKindLabel,
  VAT_RATES,
  type AccountingStore,
  type PaymentMethod,
  type ReportFormat,
  type Sale,
} from "@/lib/accounting-types";

const TOP_PRODUCT_LIMIT = 15;

export type ReportGroupRow = {
  label: string;
  count: number;
  total: number;
};

type ReportProductRow = {
  productName: string;
  count: number;
  quantity: number;
  gross: number;
};

type ReportVatRow = {
  label: string;
  net: number;
  vat: number;
  gross: number;
};

type ReportWeekRow = {
  label: string;
  saleCount: number;
  salesGross: number;
  expenseTotal: number;
  supplierTotal: number;
};

type ReportCustomerRow = {
  name: string;
  tc: string;
  phone: string;
  address: string;
  periodPurchases: number;
  periodPayments: number;
  balance: number;
  nextDueDate: string;
  overdueAmount: number;
  overdueDays: number;
};

type MonthTotals = {
  saleCount: number;
  salesGross: number;
  expenseTotal: number;
  supplierPaymentTotal: number;
  advanceTotal: number;
  cashNet: number;
};

export type ReportComparisonRow = {
  label: string;
  isCount: boolean;
  current: number;
  previous: number;
  /** Yüzde değişim; önceki ay 0 ise null. */
  changePercent: number | null;
};

export type MonthlyReport = {
  yearMonth: string;
  label: string;
  previousLabel: string;
  generatedAt: string;
  salesTotals: {
    count: number;
    gross: number;
    net: number;
    vat: number;
    cash: number;
    card: number;
    transfer: number;
    averageTicket: number;
    activeDays: number;
  };
  salesByKind: ReportGroupRow[];
  salesByVat: ReportVatRow[];
  topProducts: ReportProductRow[];
  otherProducts: ReportProductRow | null;
  weeks: ReportWeekRow[];
  expenseTotals: {
    count: number;
    total: number;
    cash: number;
    card: number;
    transfer: number;
  };
  expensesByCategory: ReportGroupRow[];
  supplierPayments: ReportGroupRow[];
  advanceTotal: number;
  advancesByStaff: ReportGroupRow[];
  creditTotals: {
    purchases: number;
    payments: number;
  };
  customers: ReportCustomerRow[];
  outstanding: number;
  overdueTotal: number;
  overdueCount: number;
  cash: {
    cashIn: number;
    cashOut: number;
    cashNet: number;
    supplierPaymentTotal: number;
  };
  comparison: ReportComparisonRow[];
  salesComparison: ReportComparisonRow;
};

function inMonth(date: string, yearMonth: string) {
  return date.startsWith(yearMonth);
}

function previousYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 2, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function dayOf(date: string): number {
  return Number(date.slice(8, 10));
}

/** Gruplanmış satırları tutara göre büyükten küçüğe sıralar. */
function groupRows<T>(
  items: T[],
  keyOf: (item: T) => string,
  amountOf: (item: T) => number,
): ReportGroupRow[] {
  const groups = new Map<string, ReportGroupRow>();
  for (const item of items) {
    const label = keyOf(item);
    const row = groups.get(label) ?? { label, count: 0, total: 0 };
    row.count += 1;
    row.total += amountOf(item);
    groups.set(label, row);
  }
  return [...groups.values()]
    .map((row) => ({ ...row, total: roundMoney(row.total) }))
    .sort((a, b) => b.total - a.total);
}

function saleKindKey(sale: Sale): string {
  return sale.kind === "exchange" && sale.exchangeRefund
    ? "Değişim (iade)"
    : saleKindLabel(sale.kind);
}

function emptyMethodTotals(): Record<PaymentMethod, number> {
  return { nakit: 0, kart: 0, havale: 0 };
}

function monthTotals(store: AccountingStore, yearMonth: string): MonthTotals {
  const sales = store.sales.filter((sale) => inMonth(sale.date, yearMonth));
  const cash = monthCashSummary(store, yearMonth);
  return {
    saleCount: sales.length,
    salesGross: roundMoney(
      sales.reduce((sum, sale) => sum + saleSignedGross(sale), 0),
    ),
    expenseTotal: cash.expenseTotal,
    supplierPaymentTotal: cash.supplierPaymentTotal,
    advanceTotal: cash.advances,
    cashNet: cash.cashNet,
  };
}

function comparisonRow(
  label: string,
  current: number,
  previous: number,
  isCount = false,
): ReportComparisonRow {
  return {
    label,
    isCount,
    current,
    previous,
    changePercent:
      previous === 0
        ? null
        : roundMoney(((current - previous) / Math.abs(previous)) * 100),
  };
}

function buildProductRows(sales: Sale[]): {
  top: ReportProductRow[];
  other: ReportProductRow | null;
} {
  const products = new Map<string, ReportProductRow>();
  for (const sale of sales) {
    const name = sale.productName.trim() || "Ürün adı yok";
    const key = name.toLocaleLowerCase("tr-TR");
    const row = products.get(key) ?? {
      productName: name,
      count: 0,
      quantity: 0,
      gross: 0,
    };
    const signed = saleSignedGross(sale);
    row.count += 1;
    row.quantity += signed < 0 ? -sale.quantity : sale.quantity;
    row.gross += signed;
    products.set(key, row);
  }
  const sorted = [...products.values()]
    .map((row) => ({
      ...row,
      quantity: Math.round(row.quantity * 1000) / 1000,
      gross: roundMoney(row.gross),
    }))
    .sort((a, b) => b.gross - a.gross);

  const top = sorted.slice(0, TOP_PRODUCT_LIMIT);
  const rest = sorted.slice(TOP_PRODUCT_LIMIT);
  if (rest.length === 0) return { top, other: null };
  return {
    top,
    other: {
      productName: `Diğer ${rest.length} ürün`,
      count: rest.reduce((sum, row) => sum + row.count, 0),
      quantity: 0,
      gross: roundMoney(rest.reduce((sum, row) => sum + row.gross, 0)),
    },
  };
}

function buildWeekRows(store: AccountingStore, yearMonth: string): ReportWeekRow[] {
  const lastDay = daysInMonth(yearMonth);
  const monthName = formatYearMonthTr(yearMonth).split(" ")[0] ?? "";
  const weeks: ReportWeekRow[] = [];
  for (let start = 1; start <= lastDay; start += 7) {
    const end = Math.min(start + 6, lastDay);
    const inWeek = (date: string) =>
      inMonth(date, yearMonth) && dayOf(date) >= start && dayOf(date) <= end;
    const sales = store.sales.filter((sale) => inWeek(sale.date));
    weeks.push({
      label: `${start}–${end} ${monthName}`,
      saleCount: sales.length,
      salesGross: roundMoney(
        sales.reduce((sum, sale) => sum + saleSignedGross(sale), 0),
      ),
      expenseTotal: roundMoney(
        store.expenses
          .filter((item) => inWeek(item.date))
          .reduce((sum, item) => sum + item.amount, 0),
      ),
      supplierTotal: roundMoney(
        store.supplierPayments
          .filter((item) => inWeek(item.date))
          .reduce((sum, item) => sum + item.amount, 0),
      ),
    });
  }
  return weeks;
}

export function buildMonthlyReport(
  store: AccountingStore,
  yearMonth: string,
): MonthlyReport {
  const monthSales = store.sales.filter((sale) => inMonth(sale.date, yearMonth));

  const methodTotals = emptyMethodTotals();
  const vatTotals = new Map<number, { net: number; vat: number; gross: number }>();
  let net = 0;
  let vat = 0;
  let gross = 0;
  for (const sale of monthSales) {
    const signed = saleSignedGross(sale);
    const sign = signed < 0 ? -1 : 1;
    const parts = splitVat(Math.abs(signed), sale.vatRate);
    gross += signed;
    net += sign * parts.net;
    vat += sign * parts.vatAmount;
    methodTotals[sale.paymentMethod] += signed;
    const bucket = vatTotals.get(sale.vatRate) ?? { net: 0, vat: 0, gross: 0 };
    bucket.net += sign * parts.net;
    bucket.vat += sign * parts.vatAmount;
    bucket.gross += signed;
    vatTotals.set(sale.vatRate, bucket);
  }
  const activeDays = new Set(monthSales.map((sale) => sale.date)).size;
  const saleOnlyCount = monthSales.filter((sale) => sale.kind === "sale").length;

  const salesByKind = groupRows(monthSales, saleKindKey, saleSignedGross);

  const salesByVat: ReportVatRow[] = VAT_RATES.flatMap((rate) => {
    const bucket = vatTotals.get(rate);
    if (!bucket) return [];
    return [
      {
        label: `%${rate}`,
        net: roundMoney(bucket.net),
        vat: roundMoney(bucket.vat),
        gross: roundMoney(bucket.gross),
      },
    ];
  });

  const products = buildProductRows(monthSales);

  const monthAdvances = store.advances.filter((item) =>
    inMonth(item.date, yearMonth),
  );
  const staffName = (staffId: string) =>
    store.staff.find((member) => member.id === staffId)?.name ??
    "Silinmiş personel";
  const advancesByStaff = groupRows(
    monthAdvances,
    (item) => staffName(item.staffId),
    (item) => item.amount,
  );

  const monthCredit = store.creditEntries.filter((entry) =>
    inMonth(entry.date, yearMonth),
  );
  const creditTotals = { purchases: 0, payments: 0 };
  for (const entry of monthCredit) {
    switch (entry.kind) {
      case "purchase":
        creditTotals.purchases += entry.amount;
        break;
      case "payment":
        creditTotals.payments += entry.amount;
        break;
      default: {
        const _exhaustive: never = entry.kind;
        throw new Error(`Bilinmeyen veresiye türü: ${String(_exhaustive)}`);
      }
    }
  }

  const asOf = istanbulIsoDate();
  const customerRows: ReportCustomerRow[] = store.customers
    .map((customer) => {
      const allEntries = store.creditEntries.filter(
        (entry) => entry.customerId === customer.id,
      );
      const periodEntries = allEntries.filter((entry) =>
        inMonth(entry.date, yearMonth),
      );
      const periodPurchases = periodEntries
        .filter((entry) => entry.kind === "purchase")
        .reduce((sum, entry) => sum + entry.amount, 0);
      const periodPayments = periodEntries
        .filter((entry) => entry.kind === "payment")
        .reduce((sum, entry) => sum + entry.amount, 0);
      const status = customerCreditStatus(allEntries, asOf);
      return {
        name: customerFullName(customer),
        tc: customer.tc,
        phone: customer.phone,
        address: customer.address,
        periodPurchases: roundMoney(periodPurchases),
        periodPayments: roundMoney(periodPayments),
        balance: status.balance,
        nextDueDate: status.nextDueDate
          ? formatIsoDateTr(status.nextDueDate)
          : status.isOverdue
            ? "Gecikmiş"
            : "—",
        overdueAmount: status.overdueAmount,
        overdueDays: status.overdueDays,
      };
    })
    .filter(
      (row) =>
        row.periodPurchases > 0 ||
        row.periodPayments > 0 ||
        row.balance !== 0,
    )
    .sort((a, b) => {
      if (b.overdueAmount !== a.overdueAmount) {
        return b.overdueAmount - a.overdueAmount;
      }
      return b.balance - a.balance;
    });

  const overdueRows = customerRows.filter((row) => row.overdueAmount > 0);

  const monthExpenses = store.expenses.filter((item) =>
    inMonth(item.date, yearMonth),
  );
  const expenseMethods = emptyMethodTotals();
  for (const item of monthExpenses) {
    expenseMethods[item.paymentMethod] += item.amount;
  }
  const expensesByCategory = groupRows(
    monthExpenses,
    (item) =>
      item.title === CASH_ZERO_TITLE
        ? CASH_ZERO_TITLE
        : expenseCategoryLabel(item.category),
    (item) => item.amount,
  );

  const supplierName = (supplierId: string) =>
    store.suppliers.find((item) => item.id === supplierId)?.name ??
    "Silinmiş firma";
  const supplierPayments = groupRows(
    store.supplierPayments.filter((item) => inMonth(item.date, yearMonth)),
    (item) => supplierName(item.supplierId),
    (item) => item.amount,
  );

  const cash = monthCashSummary(store, yearMonth);
  const previousMonth = previousYearMonth(yearMonth);
  const current = monthTotals(store, yearMonth);
  const previous = monthTotals(store, previousMonth);
  const salesComparison = comparisonRow(
    "Satış tutarı",
    current.salesGross,
    previous.salesGross,
  );

  return {
    yearMonth,
    label: formatYearMonthTr(yearMonth),
    previousLabel: formatYearMonthTr(previousMonth),
    generatedAt: istanbulIsoDate(),
    salesTotals: {
      count: monthSales.length,
      gross: roundMoney(gross),
      net: roundMoney(net),
      vat: roundMoney(vat),
      cash: roundMoney(methodTotals.nakit),
      card: roundMoney(methodTotals.kart),
      transfer: roundMoney(methodTotals.havale),
      averageTicket:
        saleOnlyCount > 0
          ? roundMoney(
              monthSales
                .filter((sale) => sale.kind === "sale")
                .reduce((sum, sale) => sum + saleSignedGross(sale), 0) /
                saleOnlyCount,
            )
          : 0,
      activeDays,
    },
    salesByKind,
    salesByVat,
    topProducts: products.top,
    otherProducts: products.other,
    weeks: buildWeekRows(store, yearMonth),
    expenseTotals: {
      count: monthExpenses.length,
      total: roundMoney(
        PAYMENT_METHODS.reduce((sum, method) => sum + expenseMethods[method], 0),
      ),
      cash: roundMoney(expenseMethods.nakit),
      card: roundMoney(expenseMethods.kart),
      transfer: roundMoney(expenseMethods.havale),
    },
    expensesByCategory,
    supplierPayments,
    advanceTotal: roundMoney(
      monthAdvances.reduce((sum, item) => sum + item.amount, 0),
    ),
    advancesByStaff,
    creditTotals: {
      purchases: roundMoney(creditTotals.purchases),
      payments: roundMoney(creditTotals.payments),
    },
    customers: customerRows,
    outstanding: roundMoney(
      store.customers.reduce((total, customer) => {
        return (
          total +
          customerBalance(
            store.creditEntries.filter(
              (entry) => entry.customerId === customer.id,
            ),
          )
        );
      }, 0),
    ),
    overdueTotal: roundMoney(
      overdueRows.reduce((sum, row) => sum + row.overdueAmount, 0),
    ),
    overdueCount: overdueRows.length,
    cash: {
      cashIn: cash.cashIn,
      cashOut: cash.cashOut,
      cashNet: cash.cashNet,
      supplierPaymentTotal: cash.supplierPaymentTotal,
    },
    comparison: [
      comparisonRow("Satış adedi", current.saleCount, previous.saleCount, true),
      salesComparison,
      comparisonRow("Gider", current.expenseTotal, previous.expenseTotal),
      comparisonRow(
        "Firma ödemeleri",
        current.supplierPaymentTotal,
        previous.supplierPaymentTotal,
      ),
      comparisonRow("Personel avansı", current.advanceTotal, previous.advanceTotal),
      comparisonRow("Net nakit kasa", current.cashNet, previous.cashNet),
    ],
    salesComparison,
  };
}

export function paymentMethodRows(
  report: MonthlyReport,
): { label: string; sales: number; expenses: number }[] {
  return PAYMENT_METHODS.map((method) => {
    switch (method) {
      case "nakit":
        return {
          label: paymentMethodLabel(method),
          sales: report.salesTotals.cash,
          expenses: report.expenseTotals.cash,
        };
      case "kart":
        return {
          label: paymentMethodLabel(method),
          sales: report.salesTotals.card,
          expenses: report.expenseTotals.card,
        };
      case "havale":
        return {
          label: paymentMethodLabel(method),
          sales: report.salesTotals.transfer,
          expenses: report.expenseTotals.transfer,
        };
      default: {
        const _exhaustive: never = method;
        return _exhaustive;
      }
    }
  });
}

export function formatChangePercent(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}%${value.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`;
}

export function reportFilename(yearMonth: string, format: ReportFormat) {
  switch (format) {
    case "xlsx":
      return `cevizogullari-aylik-rapor-${yearMonth}.xlsx`;
    case "pdf":
      return `cevizogullari-aylik-rapor-${yearMonth}.pdf`;
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}
