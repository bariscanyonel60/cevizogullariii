"use client";

import { useMemo, useState, useEffect } from "react";
import { FileDown, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { MoneyInput } from "@/components/atoms/MoneyInput";
import { AccountingPdfButton } from "@/components/organisms/admin/AccountingPdfButton";
import {
  creditLedgerNewestFirst,
  creditPortfolioTotals,
  customerCreditStatus,
  formatCreditDueHint,
  formatOpenBalance,
  formatTry,
  parseMoneyInput,
  splitVat,
} from "@/lib/accounting-money";
import {
  PAYMENT_METHODS,
  VAT_RATES,
  creditKindLabel,
  customerFullName,
  formatIsoDateTr,
  istanbulIsoDate,
  paymentMethodLabel,
  type AccountingStore,
  type Customer,
  type PaymentMethod,
  type VatRate,
} from "@/lib/accounting-types";

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

type CustomerDraft = {
  firstName: string;
  lastName: string;
  tc: string;
  phone: string;
  address: string;
};

type ListFilter = "debtors" | "overdue" | "all";

const LIST_FILTERS: { id: ListFilter; label: string }[] = [
  { id: "debtors", label: "Borçlular" },
  { id: "overdue", label: "Gecikenler" },
  { id: "all", label: "Tümü" },
];

function emptyListMessage(filter: ListFilter): string {
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

const emptyDraft: CustomerDraft = {
  firstName: "",
  lastName: "",
  tc: "",
  phone: "",
  address: "",
};

function draftFrom(customer: Customer): CustomerDraft {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    tc: customer.tc,
    phone: customer.phone,
    address: customer.address,
  };
}

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
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    store.customers[0]?.id ?? null,
  );
  const [createDraft, setCreateDraft] = useState<CustomerDraft>(emptyDraft);
  const [editDraft, setEditDraft] = useState<CustomerDraft>(
    store.customers[0] ? draftFrom(store.customers[0]) : emptyDraft,
  );
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState<VatRate>(20);
  const [date, setDate] = useState(istanbulIsoDate());
  const [note, setNote] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("nakit");
  const [payNote, setPayNote] = useState("");
  const [pdfBusyId, setPdfBusyId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [listFilter, setListFilter] = useState<ListFilter>("debtors");
  const [selectNewest, setSelectNewest] = useState(false);
  const today = istanbulIsoDate();

  const selected = store.customers.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId && store.customers.some((item) => item.id === selectedId)) {
      return;
    }
    const next = store.customers[0];
    if (next) {
      setSelectedId(next.id);
      setEditDraft(draftFrom(next));
      return;
    }
    setSelectedId(null);
    setEditDraft(emptyDraft);
  }, [selectedId, store.customers]);

  useEffect(() => {
    if (!selectNewest) return;
    const next = store.customers[0];
    if (next) {
      setSelectedId(next.id);
      setEditDraft(draftFrom(next));
    }
    setSelectNewest(false);
  }, [selectNewest, store.customers]);

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
            return status.balance > 0 || customer.id === selectedId;
          case "overdue":
            return status.isOverdue || customer.id === selectedId;
          case "all":
            return true;
          default: {
            const _exhaustive: never = listFilter;
            return _exhaustive;
          }
        }
      })
      .sort((a, b) => {
        if (a.status.isOverdue !== b.status.isOverdue) {
          return a.status.isOverdue ? -1 : 1;
        }
        if (b.status.overdueAmount !== a.status.overdueAmount) {
          return b.status.overdueAmount - a.status.overdueAmount;
        }
        if (b.status.balance !== a.status.balance) {
          return b.status.balance - a.status.balance;
        }
        return customerFullName(a.customer).localeCompare(
          customerFullName(b.customer),
          "tr-TR",
        );
      });
  }, [listFilter, query, selectedId, store.creditEntries, store.customers, today]);

  const ledger = useMemo(() => {
    if (!selected) return [];
    return creditLedgerNewestFirst(
      store.creditEntries.filter((entry) => entry.customerId === selected.id),
    );
  }, [selected, store.creditEntries]);

  const selectedStatus = useMemo(() => {
    if (!selected) return null;
    return customerCreditStatus(
      store.creditEntries.filter((entry) => entry.customerId === selected.id),
      today,
    );
  }, [selected, store.creditEntries, today]);

  const balance = selectedStatus?.balance ?? 0;
  const pdfBusy = pdfBusyId !== null;
  const totals = useMemo(
    () => creditPortfolioTotals(store, today),
    [store, today],
  );

  const productSuggestions = useMemo(() => {
    return [
      ...new Set(
        store.creditEntries
          .map((entry) => entry.productName)
          .filter(Boolean)
          .concat(store.sales.map((sale) => sale.productName)),
      ),
    ].slice(0, 40);
  }, [store.creditEntries, store.sales]);

  function selectCustomer(customer: Customer) {
    setSelectedId(customer.id);
    setEditDraft(draftFrom(customer));
  }

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

  async function submitCustomer(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreateCustomer(createDraft);
    if (saved) {
      setCreateDraft(emptyDraft);
      setListFilter("all");
      setSelectNewest(true);
    }
  }

  async function saveCard(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    await onUpdateCustomer(selected.id, editDraft);
  }

  async function submitPurchase(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const saved = await onCreateCredit({
      customerId: selected.id,
      kind: "purchase",
      date,
      dueDate: dueDate || null,
      productName,
      amount: parseMoneyInput(amount),
      vatRate,
      note,
    });
    if (saved) {
      setProductName("");
      setAmount("");
      setNote("");
      setDueDate("");
    }
  }

  async function submitPayment(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const saved = await onCreateCredit({
      customerId: selected.id,
      kind: "payment",
      date,
      amount: parseMoneyInput(payAmount),
      paymentMethod: payMethod,
      note: payNote,
    });
    if (saved) {
      setPayAmount("");
      setPayNote("");
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => void submitCustomer(event)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Yeni müşteri kartı
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cust-first">Ad</Label>
            <Input
              id="cust-first"
              value={createDraft.firstName}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-last">Soyad</Label>
            <Input
              id="cust-last"
              value={createDraft.lastName}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-tc">
              T.C. kimlik no{" "}
              <span className="font-normal text-ink-400">(isteğe bağlı)</span>
            </Label>
            <Input
              id="cust-tc"
              maxLength={64}
              value={createDraft.tc}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  tc: event.target.value.slice(0, 64),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="cust-phone">Telefon</Label>
            <Input
              id="cust-phone"
              value={createDraft.phone}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="cust-address">Adres</Label>
            <Textarea
              id="cust-address"
              value={createDraft.address}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={busy}>
          Kartı oluştur
        </Button>
      </form>

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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <aside className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm">
              {LIST_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setListFilter(item.id)}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    listFilter === item.id
                      ? "bg-forest-800 text-white"
                      : "text-ink-500 hover:bg-forest-50"
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
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ad, TC veya telefon ara"
              className="pl-10"
            />
          </div>
          {cards.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-sm text-ink-500 shadow-sm">
              {emptyListMessage(listFilter)}
            </p>
          ) : (
            <ul className="space-y-2">
              {cards.map(({ customer, status }) => {
                const selectedCard = selected?.id === customer.id;
                const hint = formatCreditDueHint(status);
                const cardPdfBusy = pdfBusyId === customer.id;
                return (
                  <li key={customer.id} className="flex items-stretch gap-1.5">
                    <button
                      type="button"
                      onClick={() => selectCustomer(customer)}
                      className={`min-w-0 flex-1 rounded-2xl border p-4 text-left transition ${
                        selectedCard
                          ? "border-forest-700 bg-forest-800 text-white"
                          : status.isOverdue
                            ? "border-red-200 bg-red-50 hover:border-red-300"
                            : "border-earth-400/10 bg-white hover:border-forest-800/25"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="block font-semibold">
                          {customerFullName(customer)}
                        </span>
                        {status.isOverdue ? (
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                              selectedCard
                                ? "bg-white/15 text-white"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            Gecikmiş
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`mt-1 block text-xs ${
                          selectedCard
                            ? "text-white/80"
                            : status.isOverdue
                              ? "text-red-700"
                              : "text-ink-400"
                        }`}
                      >
                        {formatOpenBalance(status.balance)}
                      </span>
                      {hint ? (
                        <span
                          className={`mt-0.5 block text-xs ${
                            selectedCard
                              ? "text-white/70"
                              : status.isOverdue
                                ? "text-red-600"
                                : "text-ink-400"
                          }`}
                        >
                          {hint}
                        </span>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-earth-400/10 bg-white text-[10px] font-semibold text-forest-800 hover:border-forest-800/30 hover:bg-forest-50 disabled:opacity-40"
                      disabled={busy || pdfBusy}
                      onClick={() => void downloadCreditPdf(customer.id)}
                      aria-label={`${customerFullName(customer)} hesap PDF indir`}
                    >
                      <FileDown className="size-4" />
                      {cardPdfBusy ? "…" : "PDF"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {selected ? (
          <div className="space-y-6">
            <form
              onSubmit={(event) => void saveCard(event)}
              className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink-900">
                    {customerFullName(selected)}
                  </h3>
                  <p className="mt-1 text-sm text-ink-500">
                    {balance < 0 ? "Güncel bakiye: " : "Güncel borç: "}
                    <span className="font-semibold text-ink-900">
                      {balance < 0
                        ? `Alacak ${formatTry(-balance)}`
                        : formatTry(balance)}
                    </span>
                  </p>
                  {selectedStatus?.isOverdue ? (
                    <p className="mt-1 text-sm font-medium text-red-700">
                      Gecikmiş {selectedStatus.overdueDays} gün ·{" "}
                      {formatTry(selectedStatus.overdueAmount)}
                    </p>
                  ) : selectedStatus?.nextDueDate ? (
                    <p className="mt-1 text-sm text-ink-500">
                      Sonraki vade: {formatIsoDateTr(selectedStatus.nextDueDate)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={busy || pdfBusy}
                    onClick={() => void downloadCreditPdf(selected.id)}
                  >
                    <FileDown className="size-4" />
                    {pdfBusy ? "PDF…" : "Hesap PDF"}
                  </Button>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    disabled={busy || pdfBusy}
                    onClick={() => void onDeleteCustomer(selected.id)}
                    aria-label="Müşteri kartını sil"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="edit-first">Ad</Label>
                  <Input
                    id="edit-first"
                    value={editDraft.firstName}
                    onChange={(event) =>
                      setEditDraft((current) => ({
                        ...current,
                        firstName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-last">Soyad</Label>
                  <Input
                    id="edit-last"
                    value={editDraft.lastName}
                    onChange={(event) =>
                      setEditDraft((current) => ({
                        ...current,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tc">
                    T.C. kimlik no{" "}
                    <span className="font-normal text-ink-400">(isteğe bağlı)</span>
                  </Label>
                  <Input
                    id="edit-tc"
                    maxLength={64}
                    value={editDraft.tc}
                    onChange={(event) =>
                      setEditDraft((current) => ({
                        ...current,
                        tc: event.target.value.slice(0, 64),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Telefon</Label>
                  <Input
                    id="edit-phone"
                    value={editDraft.phone}
                    onChange={(event) =>
                      setEditDraft((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-address">Adres</Label>
                  <Textarea
                    id="edit-address"
                    value={editDraft.address}
                    onChange={(event) =>
                      setEditDraft((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button type="submit" size="sm" disabled={busy}>
                Kartı güncelle
              </Button>
            </form>

            <div className="grid gap-6 lg:grid-cols-2">
              <form
                onSubmit={(event) => void submitPurchase(event)}
                className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-sm"
              >
                <h4 className="font-semibold text-ink-900">Veresiye satış</h4>
                <div>
                  <Label htmlFor="credit-product">Ne aldı</Label>
                  <Input
                    id="credit-product"
                    list="credit-product-suggestions"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    required
                  />
                  <datalist id="credit-product-suggestions">
                    {productSuggestions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="credit-date">Tarih</Label>
                    <Input
                      id="credit-date"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit-due">
                      Vade{" "}
                      <span className="font-normal text-ink-400">
                        (isteğe bağlı)
                      </span>
                    </Label>
                    <Input
                      id="credit-due"
                      type="date"
                      min={date}
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="credit-amount">Tutar (KDV dahil)</Label>
                    <MoneyInput
                      id="credit-amount"
                      value={amount}
                      onValueChange={setAmount}
                      placeholder="1.000"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="credit-vat">KDV</Label>
                  <Select
                    id="credit-vat"
                    value={vatRate}
                    onChange={(event) =>
                      setVatRate(Number(event.target.value) as VatRate)
                    }
                  >
                    {VAT_RATES.map((rate) => (
                      <option key={rate} value={rate}>
                        %{rate}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credit-note">Not</Label>
                  <Input
                    id="credit-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" disabled={busy}>
                  Borca işle
                </Button>
              </form>

              <form
                onSubmit={(event) => void submitPayment(event)}
                className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-sm"
              >
                <h4 className="font-semibold text-ink-900">Tahsilat</h4>
                <div>
                  <Label htmlFor="pay-amount">Alınan tutar</Label>
                  <MoneyInput
                    id="pay-amount"
                    value={payAmount}
                    onValueChange={setPayAmount}
                    placeholder="1.000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pay-method">Nasıl ödendi</Label>
                  <Select
                    id="pay-method"
                    value={payMethod}
                    onChange={(event) =>
                      setPayMethod(event.target.value as PaymentMethod)
                    }
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {paymentMethodLabel(method)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pay-note">Not</Label>
                  <Input
                    id="pay-note"
                    value={payNote}
                    onChange={(event) => setPayNote(event.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" disabled={busy}>
                  Tahsilatı kaydet
                </Button>
              </form>
            </div>

            <section className="space-y-3">
              <h4 className="font-display text-lg font-semibold text-ink-900">
                Kart hareketleri
              </h4>
              {ledger.length === 0 ? (
                <p className="rounded-2xl bg-white p-6 text-sm text-ink-500 shadow-sm">
                  Bu kartta henüz hareket yok.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-earth-400/10 bg-white shadow-sm">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-earth-400/10 text-xs uppercase tracking-wider text-ink-400">
                      <tr>
                        <th className="px-4 py-3">Tarih</th>
                        <th className="px-4 py-3">İşlem</th>
                        <th className="px-4 py-3">Ürün / not</th>
                        <th className="px-4 py-3">Vade</th>
                        <th className="px-4 py-3">Tutar</th>
                        <th className="px-4 py-3">Güncel borç</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map((entry) => {
                        const vat =
                          entry.kind === "purchase" && entry.vatRate
                            ? splitVat(entry.amount, entry.vatRate)
                            : null;
                        const isPayment = entry.kind === "payment";
                        const remaining =
                          selectedStatus?.remainingById[entry.id] ?? 0;
                        const due = entry.dueDate;
                        const rowOverdue =
                          entry.kind === "purchase" &&
                          remaining > 0 &&
                          due !== null &&
                          due < today;
                        return (
                          <tr
                            key={entry.id}
                            className={`border-t border-earth-400/10 ${
                              rowOverdue ? "bg-red-50/70" : ""
                            }`}
                          >
                            <td className="px-4 py-3">{entry.date}</td>
                            <td className="px-4 py-3">
                              {creditKindLabel(entry.kind)}
                              {entry.paymentMethod
                                ? ` · ${paymentMethodLabel(entry.paymentMethod)}`
                                : ""}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-ink-900">
                                {entry.productName || "—"}
                              </p>
                              {vat ? (
                                <p className="text-xs text-ink-400">
                                  KDV %{entry.vatRate} · {formatTry(vat.vatAmount)}
                                </p>
                              ) : null}
                              {entry.note ? (
                                <p className="text-xs text-ink-400">{entry.note}</p>
                              ) : null}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {entry.kind === "purchase" && entry.dueDate ? (
                                <span
                                  className={
                                    rowOverdue
                                      ? "font-medium text-red-700"
                                      : "text-ink-700"
                                  }
                                >
                                  {formatIsoDateTr(entry.dueDate)}
                                  {rowOverdue ? " · gecikmiş" : ""}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td
                              className={`px-4 py-3 font-semibold ${
                                isPayment ? "text-forest-800" : "text-ink-900"
                              }`}
                            >
                              {isPayment ? "+" : "−"}
                              {formatTry(entry.amount)}
                            </td>
                            <td className="px-4 py-3 font-medium text-ink-900">
                              {entry.runningDebt < 0
                                ? `Alacak ${formatTry(-entry.runningDebt)}`
                                : formatTry(entry.runningDebt)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                disabled={busy}
                                onClick={() => void onDeleteCredit(entry.id)}
                                aria-label="Hareketi sil"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-sm text-ink-500 shadow-sm">
            Soldan bir kart seçin veya yeni kart oluşturun.
          </p>
        )}
      </div>
    </div>
  );
}
