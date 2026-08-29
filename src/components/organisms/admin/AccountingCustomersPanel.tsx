"use client";

import { useMemo, useState, useEffect } from "react";
import { FileDown, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import {
  creditLedgerNewestFirst,
  customerBalance,
  formatOpenBalance,
  formatTry,
  splitVat,
} from "@/lib/accounting-money";
import {
  VAT_RATES,
  creditKindLabel,
  customerFullName,
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
  const [pdfBusy, setPdfBusy] = useState(false);

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

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    return store.customers
      .map((customer) => {
        const entries = store.creditEntries.filter(
          (entry) => entry.customerId === customer.id,
        );
        return {
          customer,
          balance: customerBalance(entries),
        };
      })
      .filter(({ customer }) => {
        if (!needle) return true;
        const haystack =
          `${customerFullName(customer)} ${customer.tc} ${customer.phone} ${customer.address}`.toLocaleLowerCase(
            "tr-TR",
          );
        return haystack.includes(needle);
      });
  }, [query, store.creditEntries, store.customers]);

  const ledger = useMemo(() => {
    if (!selected) return [];
    return creditLedgerNewestFirst(
      store.creditEntries.filter((entry) => entry.customerId === selected.id),
    );
  }, [selected, store.creditEntries]);

  const balance = selected ? customerBalance(ledger) : 0;

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

  async function downloadCreditPdf() {
    if (!selected) return;
    setPdfBusy(true);
    onError(null);
    onMessage(null);
    try {
      const res = await fetch(
        `/api/admin/accounting/customer-pdf?id=${encodeURIComponent(selected.id)}`,
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
      setPdfBusy(false);
    }
  }

  async function submitCustomer(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreateCustomer(createDraft);
    if (saved) {
      setCreateDraft(emptyDraft);
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
      productName,
      amount: Number(amount),
      vatRate,
      note,
    });
    if (saved) {
      setProductName("");
      setAmount("");
      setNote("");
    }
  }

  async function submitPayment(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const saved = await onCreateCredit({
      customerId: selected.id,
      kind: "payment",
      date,
      amount: Number(payAmount),
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <aside className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ad, TC veya telefon ara"
              className="pl-10"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-sm text-ink-500 shadow-sm">
              Müşteri kartı yok.
            </p>
          ) : (
            <ul className="space-y-2">
              {filtered.map(({ customer, balance: cardBalance }) => (
                <li key={customer.id}>
                  <button
                    type="button"
                    onClick={() => selectCustomer(customer)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected?.id === customer.id
                        ? "border-forest-700 bg-forest-800 text-white"
                        : "border-earth-400/10 bg-white hover:border-forest-800/25"
                    }`}
                  >
                    <span className="block font-semibold">
                      {customerFullName(customer)}
                    </span>
                    <span
                      className={`mt-1 block text-xs ${
                        selected?.id === customer.id ? "text-white/70" : "text-ink-400"
                      }`}
                    >
                      {formatOpenBalance(cardBalance)}
                    </span>
                  </button>
                </li>
              ))}
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
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={busy || pdfBusy}
                    onClick={() => void downloadCreditPdf()}
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
                    <Label htmlFor="credit-amount">Tutar (KDV dahil)</Label>
                    <Input
                      id="credit-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
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
                  <Input
                    id="pay-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={payAmount}
                    onChange={(event) => setPayAmount(event.target.value)}
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
                    <option value="nakit">Nakit</option>
                    <option value="kart">Kart</option>
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
                        return (
                          <tr key={entry.id} className="border-t border-earth-400/10">
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
