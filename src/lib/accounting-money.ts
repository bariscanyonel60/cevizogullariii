import {
  formatIsoDateTr,
  type AccountingStore,
  type CreditEntry,
  type Sale,
  type VatRate,
} from "@/lib/accounting-types";

export function formatTry(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
}

/** Yazarken 1500000 → 1.500.000 ; kuruş için virgül (1.500,50). */
export function formatMoneyInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  let integerDigits: string;
  let fraction: string | null = null;
  let keepComma = false;

  if (trimmed.includes(",")) {
    const [intPart, ...rest] = trimmed.replace(/[^\d,]/g, "").split(",");
    integerDigits = intPart ?? "";
    fraction = rest.join("").slice(0, 2);
    keepComma = true;
  } else if (/^\d+[.,]\d{1,2}$/.test(trimmed.replace(/\s/g, ""))) {
    const normalized = trimmed.replace(/\s/g, "").replace(",", ".");
    const [intPart, fracPart] = normalized.split(".");
    integerDigits = intPart ?? "";
    fraction = (fracPart ?? "").slice(0, 2);
    keepComma = true;
  } else {
    integerDigits = trimmed.replace(/\D/g, "");
  }

  if (!integerDigits && !keepComma) return "";
  const stripped = integerDigits.replace(/^0+(?=\d)/, "") || (keepComma || integerDigits ? "0" : "");
  if (!stripped && !keepComma) return "";
  const grouped = stripped.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (!keepComma) return grouped;
  return fraction === null ? `${grouped},` : `${grouped},${fraction}`;
}

/** 1.500,50 veya 1500.50 → 1500.5 */
export function parseMoneyInput(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;
  let normalized: string;
  if (trimmed.includes(",")) {
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+\.\d{1,2}$/.test(trimmed.replace(/\s/g, ""))) {
    normalized = trimmed.replace(/\s/g, "");
  } else {
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  }
  normalized = normalized.replace(/[^\d.]/g, "");
  if (!normalized || normalized === ".") return Number.NaN;
  return Number(normalized);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 3,
  }).format(value);
}

/** KDV dahil tutardan net ve KDV payını ayırır */
export function splitVat(grossInclusive: number, vatRate: VatRate) {
  const gross = roundMoney(grossInclusive);
  const net = roundMoney(gross / (1 + vatRate / 100));
  const vatAmount = roundMoney(gross - net);
  return { gross, net, vatAmount };
}

export function saleGross(quantity: number, unitPrice: number): number {
  return roundMoney(quantity * unitPrice);
}

/** Satış +, iade −, değişim fark tahsilatı + / fark iadesi −. */
export function saleSignedGross(sale: Sale): number {
  const gross = saleGross(sale.quantity, sale.unitPrice);
  switch (sale.kind) {
    case "sale":
      return gross;
    case "return":
      return -gross;
    case "exchange":
      return sale.exchangeRefund ? -gross : gross;
    default: {
      const _exhaustive: never = sale.kind;
      return _exhaustive;
    }
  }
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Sayı → MoneyInput değeri (1.500,50). */
export function moneyToInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  const rounded = roundMoney(value);
  const [intPart, frac = "00"] = rounded.toFixed(2).split(".");
  const grouped = (intPart ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (frac === "00") return grouped;
  return `${grouped},${frac}`;
}

export function customerBalance(entries: CreditEntry[]): number {
  return roundMoney(
    entries.reduce((total, entry) => applyCreditDelta(total, entry), 0),
  );
}

function applyCreditDelta(total: number, entry: CreditEntry): number {
  switch (entry.kind) {
    case "purchase":
      return roundMoney(total + entry.amount);
    case "payment":
      return roundMoney(total - entry.amount);
    default: {
      const _exhaustive: never = entry.kind;
      return _exhaustive;
    }
  }
}

export type CreditLedgerRow = CreditEntry & { runningDebt: number };

/** En yeni hareket üstte; runningDebt o satır işlendikten sonraki kalan borç. */
export function creditLedgerNewestFirst(
  entries: CreditEntry[],
): CreditLedgerRow[] {
  const chronological = [...entries].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return a.createdAt.localeCompare(b.createdAt);
  });
  let debt = 0;
  const rows = chronological.map((entry) => {
    debt = applyCreditDelta(debt, entry);
    return { ...entry, runningDebt: debt };
  });
  return rows.reverse();
}

export function formatOpenBalance(balance: number): string {
  if (balance > 0) return `Borç ${formatTry(balance)}`;
  if (balance < 0) return `Alacak ${formatTry(-balance)}`;
  return "Bakiyesi yok";
}

function chronologicalCredit(entries: CreditEntry[]): CreditEntry[] {
  return [...entries].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function calendarDaysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso}T00:00:00+03:00`);
  const to = Date.parse(`${toIso}T00:00:00+03:00`);
  return Math.round((to - from) / 86_400_000);
}

export type CustomerCreditStatus = {
  balance: number;
  overdueAmount: number;
  overdueDays: number;
  nextDueDate: string | null;
  isOverdue: boolean;
  remainingById: Record<string, number>;
};

/**
 * Tahsilatlar eski satışlara FIFO uygulanır. Vadesi geçmiş kalan tutar gecikmiş sayılır.
 * Vadesi boş satışlar açık borçtur ama gecikmez.
 */
export function customerCreditStatus(
  entries: CreditEntry[],
  asOfDate: string,
): CustomerCreditStatus {
  const remainingById: Record<string, number> = {};
  const open: {
    id: string;
    dueDate: string | null;
    remaining: number;
  }[] = [];

  for (const entry of chronologicalCredit(entries)) {
    switch (entry.kind) {
      case "purchase": {
        const remaining = roundMoney(entry.amount);
        remainingById[entry.id] = remaining;
        open.push({
          id: entry.id,
          dueDate: entry.dueDate,
          remaining,
        });
        break;
      }
      case "payment": {
        let leftover = roundMoney(entry.amount);
        for (const purchase of open) {
          if (leftover <= 0) break;
          if (purchase.remaining <= 0) continue;
          const applied = Math.min(purchase.remaining, leftover);
          purchase.remaining = roundMoney(purchase.remaining - applied);
          remainingById[purchase.id] = purchase.remaining;
          leftover = roundMoney(leftover - applied);
        }
        break;
      }
      default: {
        const _exhaustive: never = entry.kind;
        return _exhaustive;
      }
    }
  }

  let overdueAmount = 0;
  let overdueDays = 0;
  let nextDueDate: string | null = null;

  for (const purchase of open) {
    if (purchase.remaining <= 0) continue;
    if (purchase.dueDate && purchase.dueDate < asOfDate) {
      overdueAmount = roundMoney(overdueAmount + purchase.remaining);
      overdueDays = Math.max(
        overdueDays,
        calendarDaysBetween(purchase.dueDate, asOfDate),
      );
      continue;
    }
    if (
      purchase.dueDate &&
      purchase.dueDate >= asOfDate &&
      (!nextDueDate || purchase.dueDate < nextDueDate)
    ) {
      nextDueDate = purchase.dueDate;
    }
  }

  return {
    balance: customerBalance(entries),
    overdueAmount,
    overdueDays,
    nextDueDate,
    isOverdue: overdueAmount > 0,
    remainingById,
  };
}

export function formatCreditDueHint(
  status: CustomerCreditStatus,
): string | null {
  if (status.isOverdue) {
    return `Gecikmiş ${status.overdueDays} gün · ${formatTry(status.overdueAmount)}`;
  }
  if (status.nextDueDate) {
    return `Vade ${formatIsoDateTr(status.nextDueDate)}`;
  }
  if (status.balance > 0) return "Vade tarihi yok";
  return null;
}

export type CreditPortfolioTotals = {
  cardCount: number;
  debtorCount: number;
  overdueCount: number;
  purchases: number;
  payments: number;
  outstanding: number;
  openCredit: number;
  overdueTotal: number;
};

/** Tüm kartların veresiye satışı, tahsilatı ve açık bakiyesi. */
export function creditPortfolioTotals(
  store: AccountingStore,
  asOfDate: string,
): CreditPortfolioTotals {
  let purchases = 0;
  let payments = 0;
  for (const entry of store.creditEntries) {
    switch (entry.kind) {
      case "purchase":
        purchases = roundMoney(purchases + entry.amount);
        break;
      case "payment":
        payments = roundMoney(payments + entry.amount);
        break;
      default: {
        const _exhaustive: never = entry.kind;
        return _exhaustive;
      }
    }
  }

  let outstanding = 0;
  let openCredit = 0;
  let overdueTotal = 0;
  let debtorCount = 0;
  let overdueCount = 0;
  for (const customer of store.customers) {
    const status = customerCreditStatus(
      store.creditEntries.filter((entry) => entry.customerId === customer.id),
      asOfDate,
    );
    outstanding = roundMoney(outstanding + status.balance);
    if (status.balance > 0) {
      openCredit = roundMoney(openCredit + status.balance);
      debtorCount += 1;
    }
    overdueTotal = roundMoney(overdueTotal + status.overdueAmount);
    if (status.isOverdue) overdueCount += 1;
  }

  return {
    cardCount: store.customers.length,
    debtorCount,
    overdueCount,
    purchases,
    payments,
    outstanding,
    openCredit,
    overdueTotal,
  };
}

export type CashSummary = {
  cashSales: number;
  cashCollections: number;
  cashIn: number;
  cashExpenses: number;
  advances: number;
  cashOut: number;
  cashNet: number;
  cardSales: number;
  cardCollections: number;
  cardExpenses: number;
  transferSales: number;
  transferCollections: number;
  transferExpenses: number;
  expenseTotal: number;
};

function inPeriod(date: string, period: string) {
  return period.length === 7 ? date.startsWith(period) : date === period;
}

/** Gun veya ay (YYYY-MM-DD / YYYY-MM): nakit kasa = nakit satis + nakit tahsilat - nakit gider - avans. */
export function cashSummary(store: AccountingStore, period: string): CashSummary {
  const sales = store.sales.filter((item) => inPeriod(item.date, period));
  const payments = store.creditEntries.filter(
    (item) => item.kind === "payment" && inPeriod(item.date, period),
  );
  const expenses = (store.expenses ?? []).filter((item) =>
    inPeriod(item.date, period),
  );
  const advances = store.advances.filter((item) => inPeriod(item.date, period));

  const cashSales = roundMoney(
    sales
      .filter((item) => item.paymentMethod === "nakit")
      .reduce((sum, item) => sum + saleSignedGross(item), 0),
  );
  const cardSales = roundMoney(
    sales
      .filter((item) => item.paymentMethod === "kart")
      .reduce((sum, item) => sum + saleSignedGross(item), 0),
  );
  const transferSales = roundMoney(
    sales
      .filter((item) => item.paymentMethod === "havale")
      .reduce((sum, item) => sum + saleSignedGross(item), 0),
  );

  const cashCollections = roundMoney(
    payments
      .filter((item) => item.paymentMethod === "nakit")
      .reduce((sum, item) => sum + item.amount, 0),
  );
  const cardCollections = roundMoney(
    payments
      .filter((item) => item.paymentMethod === "kart")
      .reduce((sum, item) => sum + item.amount, 0),
  );
  const transferCollections = roundMoney(
    payments
      .filter((item) => item.paymentMethod === "havale")
      .reduce((sum, item) => sum + item.amount, 0),
  );

  const cashExpenses = roundMoney(
    expenses
      .filter((item) => item.paymentMethod === "nakit")
      .reduce((sum, item) => sum + item.amount, 0),
  );
  const cardExpenses = roundMoney(
    expenses
      .filter((item) => item.paymentMethod === "kart")
      .reduce((sum, item) => sum + item.amount, 0),
  );
  const transferExpenses = roundMoney(
    expenses
      .filter((item) => item.paymentMethod === "havale")
      .reduce((sum, item) => sum + item.amount, 0),
  );
  const expenseTotal = roundMoney(
    cashExpenses + cardExpenses + transferExpenses,
  );
  const advanceTotal = roundMoney(
    advances.reduce((sum, item) => sum + item.amount, 0),
  );
  const cashIn = roundMoney(cashSales + cashCollections);
  const cashOut = roundMoney(cashExpenses + advanceTotal);

  return {
    cashSales,
    cashCollections,
    cashIn,
    cashExpenses,
    advances: advanceTotal,
    cashOut,
    cashNet: roundMoney(cashIn - cashOut),
    cardSales,
    cardCollections,
    cardExpenses,
    transferSales,
    transferCollections,
    transferExpenses,
    expenseTotal,
  };
}

export function dayCashSummary(store: AccountingStore, isoDate: string) {
  return cashSummary(store, isoDate);
}

export function cashZeroConfirmMessage(amount: number): string {
  return `${formatTry(amount)} nakit gider (Kasa çekimi) olarak işlenecek. Satışlar silinmez; o günün kasası 0 görünür. Devam?`;
}

export function cashZeroMonthConfirmMessage(amount: number): string {
  return `${formatTry(amount)} bu ayın net nakit kasası bugüne Kasa çekimi olarak işlenecek. Ay özeti 0 görünür. Satışlar silinmez. Devam?`;
}

export function monthCashSummary(store: AccountingStore, yearMonth: string) {
  return cashSummary(store, yearMonth);
}
