export const VAT_RATES = [1, 10, 20] as const;
export type VatRate = (typeof VAT_RATES)[number];

export const PAYMENT_METHODS = ["nakit", "kart"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const CREDIT_KINDS = ["purchase", "payment"] as const;
export type CreditKind = (typeof CREDIT_KINDS)[number];

export const ACCOUNTING_ENTITIES = [
  "sale",
  "staff",
  "advance",
  "customer",
  "credit",
] as const;
export type AccountingEntity = (typeof ACCOUNTING_ENTITIES)[number];

export type Sale = {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: VatRate;
  paymentMethod: PaymentMethod;
  note: string;
  createdAt: string;
};

export type StaffMember = {
  id: string;
  name: string;
  createdAt: string;
};

export type Advance = {
  id: string;
  staffId: string;
  date: string;
  amount: number;
  note: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  tc: string;
  address: string;
  phone: string;
  createdAt: string;
};

export type CreditEntry = {
  id: string;
  customerId: string;
  kind: CreditKind;
  date: string;
  productName: string;
  amount: number;
  vatRate: VatRate | null;
  paymentMethod: PaymentMethod | null;
  note: string;
  createdAt: string;
};

export type AccountingStore = {
  sales: Sale[];
  staff: StaffMember[];
  advances: Advance[];
  customers: Customer[];
  creditEntries: CreditEntry[];
};

export function emptyAccountingStore(): AccountingStore {
  return {
    sales: [],
    staff: [],
    advances: [],
    customers: [],
    creditEntries: [],
  };
}

export function isVatRate(value: unknown): value is VatRate {
  return VAT_RATES.includes(value as VatRate);
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return PAYMENT_METHODS.includes(value as PaymentMethod);
}

export function isCreditKind(value: unknown): value is CreditKind {
  return CREDIT_KINDS.includes(value as CreditKind);
}

export function isAccountingEntity(value: unknown): value is AccountingEntity {
  return ACCOUNTING_ENTITIES.includes(value as AccountingEntity);
}

export function paymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "nakit":
      return "Nakit";
    case "kart":
      return "Kart";
    default: {
      const _exhaustive: never = method;
      return _exhaustive;
    }
  }
}

export function creditKindLabel(kind: CreditKind): string {
  switch (kind) {
    case "purchase":
      return "Veresiye satış";
    case "payment":
      return "Tahsilat";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function customerFullName(customer: Pick<Customer, "firstName" | "lastName">) {
  return `${customer.firstName} ${customer.lastName}`.trim();
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00+03:00`);
  return !Number.isNaN(parsed.getTime());
}

/** Europe/Istanbul takvim günü (YYYY-MM-DD) */
export function istanbulIsoDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export function istanbulYearMonth(date = new Date()): string {
  return istanbulIsoDate(date).slice(0, 7);
}

export function isYearMonth(value: string): boolean {
  return /^\d{4}-\d{2}$/.test(value);
}

/** Örn. 2026-08 → Ağustos 2026 */
export function formatYearMonthTr(yearMonth: string): string {
  if (!isYearMonth(yearMonth)) return yearMonth;
  const [year, month] = yearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export const REPORT_FORMATS = ["xlsx", "pdf"] as const;
export type ReportFormat = (typeof REPORT_FORMATS)[number];

export function isReportFormat(value: unknown): value is ReportFormat {
  return REPORT_FORMATS.includes(value as ReportFormat);
}

export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "").trim();
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

/** T.C. kimlik numarası algoritması */
export function isValidTc(value: string): boolean {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const digits = value.split("").map(Number);
  const odd =
    digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const even = digits[1] + digits[3] + digits[5] + digits[7];
  const tenth = ((odd * 7 - even) % 10 + 10) % 10;
  if (tenth !== digits[9]) return false;
  const sum = digits.slice(0, 10).reduce((total, digit) => total + digit, 0);
  return sum % 10 === digits[10];
}
