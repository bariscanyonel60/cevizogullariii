import { customerBalance, customerCreditStatus, monthCashSummary, roundMoney, saleGross, splitVat } from "@/lib/accounting-money";
import {
  creditKindLabel,
  customerFullName,
  expenseCategoryLabel,
  formatIsoDateTr,
  formatYearMonthTr,
  istanbulIsoDate,
  paymentMethodLabel,
  type AccountingStore,
  type ReportFormat,
} from "@/lib/accounting-types";

export type ReportSaleRow = {
  date: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  net: number;
  gross: number;
  paymentMethod: string;
  note: string;
};

export type ReportAdvanceRow = {
  date: string;
  staffName: string;
  amount: number;
  note: string;
};

export type ReportCreditRow = {
  date: string;
  customerName: string;
  kind: string;
  productName: string;
  amount: number;
  vatLabel: string;
  paymentMethod: string;
  dueDate: string;
  note: string;
};

export type ReportCustomerRow = {
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

export type ReportExpenseRow = {
  date: string;
  category: string;
  title: string;
  amount: number;
  vatLabel: string;
  paymentMethod: string;
  note: string;
};

export type MonthlyReport = {
  yearMonth: string;
  label: string;
  generatedAt: string;
  sales: ReportSaleRow[];
  salesTotals: {
    count: number;
    gross: number;
    net: number;
    vat: number;
    cash: number;
    card: number;
    transfer: number;
  };
  advances: ReportAdvanceRow[];
  advanceTotal: number;
  credit: ReportCreditRow[];
  creditTotals: {
    purchases: number;
    payments: number;
  };
  customers: ReportCustomerRow[];
  outstanding: number;
  overdueTotal: number;
  overdueCount: number;
  expenses: ReportExpenseRow[];
  expenseTotals: {
    count: number;
    total: number;
    cash: number;
    card: number;
    transfer: number;
  };
  cash: {
    cashIn: number;
    cashOut: number;
    cashNet: number;
  };
};

function inMonth(date: string, yearMonth: string) {
  return date.startsWith(yearMonth);
}

function sortByDate<T extends { date: string }>(rows: T[]): T[] {
  return rows.slice().sort((a, b) => a.date.localeCompare(b.date));
}

export function buildMonthlyReport(
  store: AccountingStore,
  yearMonth: string,
): MonthlyReport {
  const monthSales = sortByDate(
    store.sales.filter((sale) => inMonth(sale.date, yearMonth)),
  );
  const saleRows: ReportSaleRow[] = monthSales.map((sale) => {
    const gross = saleGross(sale.quantity, sale.unitPrice);
    const parts = splitVat(gross, sale.vatRate);
    return {
      date: sale.date,
      productName: sale.productName,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      vatRate: sale.vatRate,
      vatAmount: parts.vatAmount,
      net: parts.net,
      gross: parts.gross,
      paymentMethod: paymentMethodLabel(sale.paymentMethod),
      note: sale.note,
    };
  });

  const salesTotals = monthSales.reduce(
    (acc, sale) => {
      const gross = saleGross(sale.quantity, sale.unitPrice);
      const parts = splitVat(gross, sale.vatRate);
      acc.count += 1;
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
    { count: 0, gross: 0, net: 0, vat: 0, cash: 0, card: 0, transfer: 0 },
  );

  const monthAdvances = sortByDate(
    store.advances.filter((item) => inMonth(item.date, yearMonth)),
  );
  const advanceRows: ReportAdvanceRow[] = monthAdvances.map((item) => {
    const staff = store.staff.find((member) => member.id === item.staffId);
    return {
      date: item.date,
      staffName: staff?.name ?? "Silinmiş personel",
      amount: item.amount,
      note: item.note,
    };
  });

  const monthCredit = sortByDate(
    store.creditEntries.filter((entry) => inMonth(entry.date, yearMonth)),
  );
  const creditRows: ReportCreditRow[] = monthCredit.map((entry) => {
    const customer = store.customers.find((item) => item.id === entry.customerId);
    return {
      date: entry.date,
      customerName: customer
        ? customerFullName(customer)
        : "Silinmiş müşteri",
      kind: creditKindLabel(entry.kind),
      productName: entry.productName,
      amount: entry.amount,
      vatLabel: entry.vatRate ? `%${entry.vatRate}` : "—",
      paymentMethod: entry.paymentMethod
        ? paymentMethodLabel(entry.paymentMethod)
        : "—",
      dueDate: entry.kind === "purchase" && entry.dueDate
        ? formatIsoDateTr(entry.dueDate)
        : "—",
      note: entry.note,
    };
  });

  const creditTotals = monthCredit.reduce(
    (acc, entry) => {
      switch (entry.kind) {
        case "purchase":
          acc.purchases += entry.amount;
          break;
        case "payment":
          acc.payments += entry.amount;
          break;
        default: {
          const _exhaustive: never = entry.kind;
          return _exhaustive;
        }
      }
      return acc;
    },
    { purchases: 0, payments: 0 },
  );

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

  const monthExpenses = sortByDate(
    store.expenses.filter((item) => inMonth(item.date, yearMonth)),
  );
  const expenseRows: ReportExpenseRow[] = monthExpenses.map((item) => ({
    date: item.date,
    category: expenseCategoryLabel(item.category),
    title: item.title,
    amount: item.amount,
    vatLabel: item.vatRate ? `%${item.vatRate}` : "—",
    paymentMethod: paymentMethodLabel(item.paymentMethod),
    note: item.note,
  }));
  const expenseTotals = monthExpenses.reduce(
    (acc, item) => {
      acc.count += 1;
      acc.total += item.amount;
      switch (item.paymentMethod) {
        case "nakit":
          acc.cash += item.amount;
          break;
        case "kart":
          acc.card += item.amount;
          break;
        case "havale":
          acc.transfer += item.amount;
          break;
        default: {
          const _exhaustive: never = item.paymentMethod;
          return _exhaustive;
        }
      }
      return acc;
    },
    { count: 0, total: 0, cash: 0, card: 0, transfer: 0 },
  );
  const cash = monthCashSummary(store, yearMonth);

  return {
    yearMonth,
    label: formatYearMonthTr(yearMonth),
    generatedAt: istanbulIsoDate(),
    sales: saleRows,
    salesTotals: {
      count: salesTotals.count,
      gross: roundMoney(salesTotals.gross),
      net: roundMoney(salesTotals.net),
      vat: roundMoney(salesTotals.vat),
      cash: roundMoney(salesTotals.cash),
      card: roundMoney(salesTotals.card),
      transfer: roundMoney(salesTotals.transfer),
    },
    advances: advanceRows,
    advanceTotal: roundMoney(
      advanceRows.reduce((sum, row) => sum + row.amount, 0),
    ),
    credit: creditRows,
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
    expenses: expenseRows,
    expenseTotals: {
      count: expenseTotals.count,
      total: roundMoney(expenseTotals.total),
      cash: roundMoney(expenseTotals.cash),
      card: roundMoney(expenseTotals.card),
      transfer: roundMoney(expenseTotals.transfer),
    },
    cash: {
      cashIn: cash.cashIn,
      cashOut: cash.cashOut,
      cashNet: cash.cashNet,
    },
  };
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
