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
    entries.reduce((total, entry) => {
      switch (entry.kind) {
        case "purchase":
          return total + entry.amount;
        case "payment":
          return total - entry.amount;
        default: {
          const _exhaustive: never = entry.kind;
          return _exhaustive;
        }
      }
    }, 0),
  );
}
