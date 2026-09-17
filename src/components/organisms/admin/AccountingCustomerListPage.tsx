"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, Pencil, Search, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { AccountingPdfButton } from "@/components/organisms/admin/AccountingPdfButton";
import {
  CUSTOMER_LIST_FILTERS,
  CUSTOMER_PAGE_SIZE,
  emptyCustomerListMessage,
  type CustomerListFilter,
  type CustomersView,
} from "@/components/organisms/admin/accounting-customer-shared";
import {
  creditPortfolioTotals,
  customerCreditStatus,
  formatCreditDueHint,
  formatOpenBalance,
  formatTry,
} from "@/lib/accounting-money";
import {
  customerFullName,
  istanbulIsoDate,
  type AccountingStore,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onOpenView: (view: CustomersView) => void;
  onDeleteCustomer: (id: string) => Promise<boolean>;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export function AccountingCustomerListPage({
  store,
  busy,
  onOpenView,
  onDeleteCustomer,
  onError,
  onMessage,
}: Props) {
  const [query, setQuery] = useState("");
  const [listFilter, setListFilter] = useState<CustomerListFilter>("debtors");
  const [page, setPage] = useState(1);
  const [pdfBusyId, setPdfBusyId] = useState<string | null>(null);
  const today = istanbulIsoDate();

  const totals = useMemo(
    () => creditPortfolioTotals(store, today),
    [store, today],
  );

  const cards = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    return store.customers
      .map((customer) => {
        const entries = store.creditEntries.filter(
          (entry) => entry.customerId === customer.id,
        );
        const status = customerCreditStatus(entries, today);
        return { customer, status };
      })
      .filter(({ customer, status }) => {
        if (needle) {
          const haystack =
            `${customerFullName(customer)} ${customer.tc} ${customer.phone} ${customer.address}`.toLocaleLowerCase(
              "tr-TR",
            );
          if (!haystack.includes(needle)) return false;
        }
        switch (listFilter) {
          case "debtors":
            return status.balance > 0;
          case "overdue":
            return status.isOverdue;
          case "all":
            return true;
          default: {
            const _exhaustive: never = listFilter;
            return _exhaustive;
          }
        }
      })
      .sort((a, b) =>
        customerFullName(a.customer).localeCompare(
          customerFullName(b.customer),
          "tr-TR",
          { sensitivity: "base" },
        ),
      );
  }, [listFilter, query, store.creditEntries, store.customers, today]);

  const pageCount = Math.max(1, Math.ceil(cards.length / CUSTOMER_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    setPage(1);
  }, [listFilter, query]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const pageCards = useMemo(() => {
    const start = (safePage - 1) * CUSTOMER_PAGE_SIZE;
    return cards.slice(start, start + CUSTOMER_PAGE_SIZE);
  }, [cards, safePage]);

  async function downloadCreditPdf(customerId: string) {
    setPdfBusyId(customerId);
    onError(null);
    onMessage(null);
    try {
      const res = await fetch(
        `/api/admin/accounting/customer-pdf?id=${encodeURIComponent(customerId)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "PDF indirilemedi");
      }
      const blob = await res.blob();
      const header = res.headers.get("Content-Disposition") ?? "";
      const match = header.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "cevizogullari-veresiye.pdf";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      onMessage("Hesap hareketleri PDF indirildi");
    } catch (err) {
      onError(err instanceof Error ? err.message : "PDF indirilemedi");
    } finally {
      setPdfBusyId(null);
    }
  }

  const pdfBusy = pdfBusyId !== null;
  const rangeStart = cards.length === 0 ? 0 : (safePage - 1) * CUSTOMER_PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * CUSTOMER_PAGE_SIZE, cards.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Veresiye kartları
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Kart bilgisi ayrı sayfada; borç ekleme / tahsilat ayrı sayfada.
          </p>
        </div>
        <Button
          type="button"
          disabled={busy}
          onClick={() => onOpenView({ name: "card", customerId: null })}
        >
          Yeni kart
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Toplam açık veresiye
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900">
            {formatTry(totals.openCredit)}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            {totals.debtorCount} borçlu kart · {totals.cardCount} kart
          </p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Toplam veresiye satış
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900">
            {formatTry(totals.purchases)}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Tahsilat {formatTry(totals.payments)}
          </p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Geciken veresiye
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900">
            {formatTry(totals.overdueTotal)}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            {totals.overdueCount === 0
              ? "Vadesi geçmiş borç yok"
              : `${totals.overdueCount} müşteri kartı`}
          </p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Net bakiye
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900">
            {totals.outstanding < 0
              ? `Alacak ${formatTry(-totals.outstanding)}`
              : formatTry(totals.outstanding)}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Fazla tahsilat düşülmüş tutar
          </p>
        </article>
      </div>

      <div className="space-y-3 rounded-3xl border border-earth-400/10 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 rounded-2xl bg-forest-50/80 p-1">
            {CUSTOMER_LIST_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setListFilter(item.id)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  listFilter === item.id
                    ? "bg-forest-800 text-white"
                    : "text-ink-500 hover:bg-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <AccountingPdfButton
            kind="customers"
            disabled={busy || pdfBusy}
            onError={onError}
            onMessage={onMessage}
            label="Liste PDF"
          />
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ad, TC veya telefon ara"
            className="pl-10"
          />
        </div>

        {cards.length === 0 ? (
          <p className="rounded-2xl bg-forest-50/50 p-6 text-sm text-ink-500">
            {emptyCustomerListMessage(listFilter)}
          </p>
        ) : (
          <>
            <ul className="divide-y divide-earth-400/10 rounded-2xl border border-earth-400/10">
              {pageCards.map(({ customer, status }) => {
                const hint = formatCreditDueHint(status);
                const cardPdfBusy = pdfBusyId === customer.id;
                return (
                  <li
                    key={customer.id}
                    className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                      status.isOverdue ? "bg-red-50/60" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink-900">
                          {customerFullName(customer)}
                        </p>
                        {status.isOverdue ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                            Gecikmiş
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          status.isOverdue ? "text-red-700" : "text-ink-500"
                        }`}
                      >
                        {formatOpenBalance(status.balance)}
                        {hint ? ` · ${hint}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {customer.phone}
                        {customer.tc ? ` · ${customer.tc}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={busy || pdfBusy}
                        onClick={() =>
                          onOpenView({
                            name: "ledger",
                            customerId: customer.id,
                          })
                        }
                      >
                        <Wallet className="size-4" />
                        Hareketler
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={busy || pdfBusy}
                        onClick={() =>
                          onOpenView({
                            name: "card",
                            customerId: customer.id,
                          })
                        }
                      >
                        <Pencil className="size-4" />
                        Kart
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={busy || pdfBusy}
                        onClick={() => void downloadCreditPdf(customer.id)}
                      >
                        <FileDown className="size-4" />
                        {cardPdfBusy ? "…" : "PDF"}
                      </Button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        disabled={busy || pdfBusy}
                        onClick={() => void onDeleteCustomer(customer.id)}
                        aria-label="Müşteri kartını sil"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-ink-400">
                {rangeStart}–{rangeEnd} / {cards.length} kart · sayfa başına{" "}
                {CUSTOMER_PAGE_SIZE}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={busy || safePage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Önceki
                </Button>
                <span className="text-sm font-medium text-ink-700">
                  {safePage} / {pageCount}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={busy || safePage >= pageCount}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                >
                  Sonraki
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
