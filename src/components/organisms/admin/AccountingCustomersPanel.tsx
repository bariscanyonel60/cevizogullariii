"use client";

import { useState } from "react";
import { AccountingCustomerCardPage } from "@/components/organisms/admin/AccountingCustomerCardPage";
import { AccountingCustomerLedgerPage } from "@/components/organisms/admin/AccountingCustomerLedgerPage";
import { AccountingCustomerListPage } from "@/components/organisms/admin/AccountingCustomerListPage";
import type { CustomersView } from "@/components/organisms/admin/accounting-customer-shared";
import type { AccountingStore } from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onCreateCustomer: (payload: Record<string, unknown>) => Promise<boolean>;
  onUpdateCustomer: (
    id: string,
    payload: Record<string, unknown>,
  ) => Promise<boolean>;
  onCreateCredit: (payload: Record<string, unknown>) => Promise<boolean>;
  onDeleteCustomer: (id: string) => Promise<boolean>;
  onDeleteCredit: (id: string) => Promise<boolean>;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export function AccountingCustomersPanel({
  store,
  busy,
  onCreateCustomer,
  onUpdateCustomer,
  onCreateCredit,
  onDeleteCustomer,
  onDeleteCredit,
  onError,
  onMessage,
}: Props) {
  const [view, setView] = useState<CustomersView>({ name: "list" });

  async function deleteCustomerAndReturn(id: string) {
    const deleted = await onDeleteCustomer(id);
    if (deleted) setView({ name: "list" });
    return deleted;
  }

  switch (view.name) {
    case "list":
      return (
        <AccountingCustomerListPage
          store={store}
          busy={busy}
          onOpenView={setView}
          onDeleteCustomer={onDeleteCustomer}
          onError={onError}
          onMessage={onMessage}
        />
      );
    case "card":
      return (
        <AccountingCustomerCardPage
          store={store}
          busy={busy}
          customerId={view.customerId}
          onBack={() => setView({ name: "list" })}
          onCreateCustomer={onCreateCustomer}
          onUpdateCustomer={onUpdateCustomer}
          onDeleteCustomer={deleteCustomerAndReturn}
          onOpenLedger={(customerId) =>
            setView({ name: "ledger", customerId })
          }
        />
      );
    case "ledger":
      return (
        <AccountingCustomerLedgerPage
          store={store}
          busy={busy}
          customerId={view.customerId}
          onBack={() => setView({ name: "list" })}
          onEditCard={(customerId) => setView({ name: "card", customerId })}
          onCreateCredit={onCreateCredit}
          onDeleteCredit={onDeleteCredit}
          onError={onError}
          onMessage={onMessage}
        />
      );
    default: {
      const _exhaustive: never = view;
      return _exhaustive;
    }
  }
}
