import type { Customer } from "@/lib/accounting-types";

export const CUSTOMER_PAGE_SIZE = 20;

export type CustomerDraft = {
  firstName: string;
  lastName: string;
  tc: string;
  phone: string;
  address: string;
};

export const emptyCustomerDraft: CustomerDraft = {
  firstName: "",
  lastName: "",
  tc: "",
  phone: "",
  address: "",
};

export function draftFromCustomer(customer: Customer): CustomerDraft {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    tc: customer.tc,
    phone: customer.phone,
    address: customer.address,
  };
}

export type CustomerListFilter = "debtors" | "overdue" | "all";

export const CUSTOMER_LIST_FILTERS: {
  id: CustomerListFilter;
  label: string;
}[] = [
  { id: "debtors", label: "Borçlular" },
  { id: "overdue", label: "Gecikenler" },
  { id: "all", label: "Tümü" },
];

export function emptyCustomerListMessage(filter: CustomerListFilter): string {
  switch (filter) {
    case "debtors":
      return "Açık borcu olan müşteri yok.";
    case "overdue":
      return "Vadesi geçmiş borç yok.";
    case "all":
      return "Müşteri kartı yok.";
    default: {
      const _exhaustive: never = filter;
      return _exhaustive;
    }
  }
}

/**
 * Veresiye satışta isteğe bağlı birim önerileri.
 * İşletmeye özel birimleri buradan güncelleyin (ör. m³, mt, adet).
 */
export const CREDIT_UNIT_SUGGESTIONS = [
  "adet",
  "m³",
  "mt",
  "paket",
  "torba",
  "takım",
] as const;

export type CustomersView =
  | { name: "list" }
  | { name: "card"; customerId: string | null }
  | { name: "ledger"; customerId: string };
