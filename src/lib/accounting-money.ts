import type { CreditEntry, VatRate } from "@/lib/accounting-types";

export function formatTry(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
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

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
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
