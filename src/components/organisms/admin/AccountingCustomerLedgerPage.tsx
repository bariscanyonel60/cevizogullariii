"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Check,
  FileDown,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { MoneyInput } from "@/components/atoms/MoneyInput";
import { Select } from "@/components/atoms/Select";
import { CREDIT_UNIT_SUGGESTIONS } from "@/components/organisms/admin/accounting-customer-shared";
import {
  creditLedgerNewestFirst,
  customerCreditStatus,
  formatQuantity,
  formatTry,
  moneyToInput,
  parseMoneyInput,
  purchaseDueDatePayload,
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
  type CreditEntry,
  type PaymentMethod,
  type VatRate,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  customerId: string;
  onBack: () => void;
  onEditCard: (customerId: string) => void;
  onCreateCredit: (payload: Record<string, unknown>) => Promise<boolean>;
  onUpdateCredit: (
    id: string,
    payload: Record<string, unknown>,
  ) => Promise<boolean>;
  onDeleteCredit: (id: string) => Promise<boolean>;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export function AccountingCustomerLedgerPage({
  store,
  busy,
  customerId,
  onBack,
  onEditCard,
  onCreateCredit,
  onUpdateCredit,
  onDeleteCredit,
  onError,
  onMessage,
}: Props) {
  const customer =
    store.customers.find((item) => item.id === customerId) ?? null;
  const today = istanbulIsoDate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKind, setEditingKind] = useState<"purchase" | "payment" | null>(
    null,
  );
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState<VatRate>(20);
  const [date, setDate] = useState(istanbulIsoDate());
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("nakit");
  const [payNote, setPayNote] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [dueEditId, setDueEditId] = useState<string | null>(null);
  const [dueEditValue, setDueEditValue] = useState("");

  const ledger = useMemo(() => {
    if (!customer) return [];
    return creditLedgerNewestFirst(
      store.creditEntries.filter((entry) => entry.customerId === customer.id),
    );
  }, [customer, store.creditEntries]);

  const status = useMemo(() => {
    if (!customer) return null;
    return customerCreditStatus(
      store.creditEntries.filter((entry) => entry.customerId === customer.id),
      today,
    );
  }, [customer, store.creditEntries, today]);

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

  if (!customer) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="secondary" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Listeye dön
        </Button>
        <p className="rounded-2xl bg-white p-6 text-sm text-ink-500 shadow-sm">
          Kart bulunamadı. Silinmiş veya geçersiz olabilir.
        </p>
      </div>
    );
  }

  const balance = status?.balance ?? 0;

  async function downloadCreditPdf() {
    setPdfBusy(true);
    onError(null);
    onMessage(null);
    try {
      const res = await fetch(
        `/api/admin/accounting/customer-pdf?id=${encodeURIComponent(customerId)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        let message = "PDF indirilemedi";
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          /* non-JSON error body */
        }
        if (/pdfkit|Helvetica|standard-fonts/i.test(message)) {
          message =
            "PDF sunucuda oluşturulamadı (yazı tipi paketi eksik). Deploy sonrası düzelir.";
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      if (!blob.size || blob.type.includes("json")) {
        throw new Error("PDF indirilemedi");
      }
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

  function resetFormFields() {
    setEditingId(null);
    setEditingKind(null);
    setDueEditId(null);
    setDueEditValue("");
    setProductName("");
    setQuantity("");
    setUnit("");
    setAmount("");
    setNote("");
    setDueDate("");
    setPayAmount("");
    setPayNote("");
    setVatRate(20);
    setPayMethod("nakit");
    setDate(istanbulIsoDate());
  }

  function clearEditing() {
    resetFormFields();
    onMessage(null);
    onError(null);
  }

  function startEdit(entry: CreditEntry) {
    setDueEditId(null);
    setDueEditValue("");
    setEditingId(entry.id);
    setEditingKind(entry.kind);
    setDate(entry.date);
    if (entry.kind === "purchase") {
      setProductName(entry.productName);
      setQuantity(entry.quantity != null ? String(entry.quantity) : "");
      setUnit(entry.unit);
      setAmount(moneyToInput(entry.amount));
      setVatRate(entry.vatRate ?? 20);
      setDueDate(entry.dueDate ?? "");
      setNote(entry.note);
      setPayAmount("");
      setPayNote("");
    } else {
      setPayAmount(moneyToInput(entry.amount));
      setPayMethod(entry.paymentMethod ?? "nakit");
      setPayNote(entry.note);
      setProductName("");
      setQuantity("");
      setUnit("");
      setAmount("");
      setNote("");
      setDueDate("");
    }
    onMessage(null);
    onError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startDueEdit(entry: CreditEntry) {
    if (entry.kind !== "purchase") return;
    resetFormFields();
    setDueEditId(entry.id);
    setDueEditValue(entry.dueDate ?? "");
    onMessage(null);
    onError(null);
  }

  function cancelDueEdit() {
    setDueEditId(null);
    setDueEditValue("");
  }

  async function persistDueDate(entry: CreditEntry, nextDue: string | null) {
    if (entry.kind !== "purchase") return false;
    if (nextDue && nextDue < entry.date) {
      onError("Ödeme tarihi, satış tarihinden önce olamaz");
      return false;
    }
    const saved = await onUpdateCredit(
      entry.id,
      purchaseDueDatePayload(entry, nextDue),
    );
    if (saved) {
      cancelDueEdit();
      onMessage(
        nextDue
          ? "Ödeme tarihi güncellendi"
          : "Gecikmeden çıkarıldı (ödeme tarihi kaldırıldı)",
      );
    }
    return saved;
  }

  async function saveDueEdit(entry: CreditEntry) {
    await persistDueDate(entry, dueEditValue.trim() || null);
  }

  async function submitPurchase(event: React.FormEvent) {
    event.preventDefault();
    const qtyRaw = quantity.trim();
    const payload = {
      customerId,
      kind: "purchase" as const,
      date,
      dueDate: dueDate || null,
      productName,
      quantity: qtyRaw ? parseMoneyInput(qtyRaw) : null,
      unit: unit.trim() || "",
      amount: parseMoneyInput(amount),
      vatRate,
      note,
    };
    const saved =
      editingId && editingKind === "purchase"
        ? await onUpdateCredit(editingId, payload)
        : await onCreateCredit(payload);
    if (saved) {
      resetFormFields();
    }
  }

  async function submitPayment(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      customerId,
      kind: "payment" as const,
      date,
      amount: parseMoneyInput(payAmount),
      paymentMethod: payMethod,
      note: payNote,
    };
    const saved =
      editingId && editingKind === "payment"
        ? await onUpdateCredit(editingId, payload)
        : await onCreateCredit(payload);
    if (saved) {
      resetFormFields();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Listeye dön
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={busy || pdfBusy}
            onClick={() => onEditCard(customer.id)}
          >
            <Pencil className="size-4" />
            Kartı düzenle
          </Button>
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
        </div>
      </div>

      <header className="rounded-3xl border border-earth-400/15 bg-white p-6 shadow-sm">
        <h3 className="font-display text-xl font-semibold text-ink-900">
          {customerFullName(customer)} — hareketler
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          {balance < 0 ? "Güncel bakiye: " : "Güncel borç: "}
          <span className="font-semibold text-ink-900">
            {balance < 0
              ? `Alacak ${formatTry(-balance)}`
              : formatTry(balance)}
          </span>
        </p>
        {status?.isOverdue ? (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Ödeme tarihi gecikti</p>
              <p className="mt-0.5">
                {status.overdueDays} gün · {formatTry(status.overdueAmount)}{" "}
                tahsil edilmedi
              </p>
            </div>
          </div>
        ) : status?.nextDueDate ? (
          <p className="mt-1 text-sm text-ink-500">
            Sonraki ödeme tarihi: {formatIsoDateTr(status.nextDueDate)}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-ink-400">
          {customer.phone}
          {customer.tc ? ` · ${customer.tc}` : ""}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(event) => void submitPurchase(event)}
          className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-ink-900">
              {editingKind === "purchase"
                ? "Veresiye satışı düzenle"
                : "Veresiye satış (borç ekle)"}
            </h4>
            {editingKind === "purchase" ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={clearEditing}
              >
                <X className="size-4" />
                Vazgeç
              </Button>
            ) : null}
          </div>
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
              <Label htmlFor="credit-qty">
                Adet / miktar{" "}
                <span className="font-normal text-ink-400">(isteğe bağlı)</span>
              </Label>
              <Input
                id="credit-qty"
                inputMode="decimal"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="örn. 12"
              />
            </div>
            <div>
              <Label htmlFor="credit-unit">
                Birim{" "}
                <span className="font-normal text-ink-400">(isteğe bağlı)</span>
              </Label>
              <Input
                id="credit-unit"
                list="credit-unit-suggestions"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="adet, m³, mt…"
                maxLength={32}
              />
              <datalist id="credit-unit-suggestions">
                {CREDIT_UNIT_SUGGESTIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
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
                Ödeme tarihi{" "}
                <span className="font-normal text-ink-400">(isteğe bağlı)</span>
              </Label>
              <Input
                id="credit-due"
                type="date"
                min={date}
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
              <p className="mt-1 text-xs text-ink-400">
                Boş bırakılabilir. Bu tarih geçerse kart Gecikenler’de uyarılır.
                Kayıtlı satırlarda ödeme tarihine tıklayarak da
                değiştirebilirsiniz.
              </p>
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
          <Button type="submit" size="sm" disabled={busy || editingKind === "payment"}>
            {editingKind === "purchase" ? "Değişiklikleri kaydet" : "Borca işle"}
          </Button>
        </form>

        <form
          onSubmit={(event) => void submitPayment(event)}
          className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-ink-900">
              {editingKind === "payment"
                ? "Tahsilatı düzenle"
                : "Tahsilat (borç düş)"}
            </h4>
            {editingKind === "payment" ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={clearEditing}
              >
                <X className="size-4" />
                Vazgeç
              </Button>
            ) : null}
          </div>
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
          <Button type="submit" size="sm" disabled={busy || editingKind === "purchase"}>
            {editingKind === "payment" ? "Değişiklikleri kaydet" : "Tahsilatı kaydet"}
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
                  <th className="px-4 py-3">Ürün / miktar / not</th>
                  <th className="px-4 py-3">Ödeme tarihi</th>
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
                  const remaining = status?.remainingById[entry.id] ?? 0;
                  const due = entry.dueDate;
                  const rowOverdue =
                    entry.kind === "purchase" &&
                    remaining > 0 &&
                    due !== null &&
                    due < today;
                  const qtyLabel =
                    entry.kind === "purchase" && entry.quantity
                      ? `${formatQuantity(entry.quantity)}${
                          entry.unit ? ` ${entry.unit}` : ""
                        }`
                      : null;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-t border-earth-400/10 ${
                        rowOverdue ? "bg-red-50/70" : ""
                      } ${editingId === entry.id ? "bg-forest-50/80" : ""}`}
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
                        {qtyLabel ? (
                          <p className="text-xs text-ink-500">{qtyLabel}</p>
                        ) : null}
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
                        {entry.kind !== "purchase" ? (
                          "—"
                        ) : dueEditId === entry.id ? (
                          <div className="flex min-w-[11rem] flex-col gap-2">
                            <Input
                              type="date"
                              min={entry.date}
                              value={dueEditValue}
                              disabled={busy}
                              onChange={(event) =>
                                setDueEditValue(event.target.value)
                              }
                              aria-label="Ödeme tarihini düzenle"
                              autoFocus
                            />
                            <div className="flex flex-wrap gap-1">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-lg bg-forest-800 px-2 py-1 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-40"
                                disabled={busy}
                                onClick={() => void saveDueEdit(entry)}
                              >
                                <Check className="size-3.5" aria-hidden />
                                Kaydet
                              </button>
                              <button
                                type="button"
                                className="rounded-lg px-2 py-1 text-xs font-medium text-ink-500 hover:bg-forest-50 disabled:opacity-40"
                                disabled={busy}
                                onClick={cancelDueEdit}
                              >
                                Vazgeç
                              </button>
                              {entry.dueDate || dueEditValue ? (
                                <button
                                  type="button"
                                  className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                                  disabled={busy}
                                  onClick={() => void persistDueDate(entry, null)}
                                >
                                  {entry.dueDate &&
                                  entry.dueDate < today &&
                                  remaining > 0
                                    ? "Gecikmeden çıkar"
                                    : "Tarihi kaldır"}
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-1">
                            <button
                              type="button"
                              className={`inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-left transition hover:bg-forest-50 disabled:opacity-40 ${
                                rowOverdue
                                  ? "font-semibold text-red-700"
                                  : entry.dueDate
                                    ? "text-ink-700"
                                    : "text-ink-400"
                              }`}
                              disabled={busy || Boolean(editingId)}
                              onClick={() => startDueEdit(entry)}
                              aria-label={
                                entry.dueDate
                                  ? "Ödeme tarihini düzenle"
                                  : "Ödeme tarihi ekle"
                              }
                              title="Ödeme tarihini düzenle"
                            >
                              {rowOverdue ? (
                                <AlertTriangle
                                  className="size-3.5 shrink-0"
                                  aria-hidden
                                />
                              ) : (
                                <CalendarClock
                                  className="size-3.5 shrink-0 opacity-60"
                                  aria-hidden
                                />
                              )}
                              {entry.dueDate
                                ? `${formatIsoDateTr(entry.dueDate)}${
                                    rowOverdue ? " · gecikti" : ""
                                  }`
                                : "Tarih ekle"}
                            </button>
                            {rowOverdue ? (
                              <button
                                type="button"
                                className="rounded-lg px-1.5 py-0.5 text-[11px] font-semibold text-red-700 underline-offset-2 hover:underline disabled:opacity-40"
                                disabled={busy || Boolean(editingId)}
                                onClick={() => void persistDueDate(entry, null)}
                              >
                                Gecikmeden çıkar
                              </button>
                            ) : null}
                          </div>
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
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-forest-800 hover:bg-forest-50 disabled:opacity-40"
                            disabled={busy || Boolean(dueEditId)}
                            onClick={() => startEdit(entry)}
                            aria-label="Hareketi düzenle"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                            disabled={
                              busy || Boolean(editingId) || Boolean(dueEditId)
                            }
                            onClick={() => void onDeleteCredit(entry.id)}
                            aria-label="Hareketi sil"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
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
  );
}
