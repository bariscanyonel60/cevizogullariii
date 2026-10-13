"use client";

import { useMemo, useState } from "react";
import { Building2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { MoneyInput } from "@/components/atoms/MoneyInput";
import { Select } from "@/components/atoms/Select";
import {
  formatTry,
  moneyToInput,
  parseMoneyInput,
  supplierTotals,
} from "@/lib/accounting-money";
import {
  PAYMENT_METHODS,
  formatIsoDateTr,
  istanbulIsoDate,
  paymentMethodLabel,
  type AccountingStore,
  type PaymentMethod,
  type Supplier,
  type SupplierPayment,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onCreateSupplier: (payload: Record<string, unknown>) => Promise<boolean>;
  onUpdateSupplier: (id: string, payload: Record<string, unknown>) => Promise<boolean>;
  onDeleteSupplier: (id: string) => Promise<boolean>;
  onCreatePayment: (payload: Record<string, unknown>) => Promise<boolean>;
  onUpdatePayment: (id: string, payload: Record<string, unknown>) => Promise<boolean>;
  onDeletePayment: (id: string) => Promise<boolean>;
};

type SupplierForm = {
  name: string;
  taxNumber: string;
  phone: string;
  iban: string;
  note: string;
};

const EMPTY_SUPPLIER_FORM: SupplierForm = {
  name: "",
  taxNumber: "",
  phone: "",
  iban: "",
  note: "",
};

function supplierToForm(supplier: Supplier): SupplierForm {
  return {
    name: supplier.name,
    taxNumber: supplier.taxNumber,
    phone: supplier.phone,
    iban: supplier.iban,
    note: supplier.note,
  };
}

export function AccountingSuppliersPanel({
  store,
  busy,
  onCreateSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onCreatePayment,
  onUpdatePayment,
  onDeletePayment,
}: Props) {
  const today = istanbulIsoDate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newSupplier, setNewSupplier] = useState<SupplierForm>(EMPTY_SUPPLIER_FORM);

  const paymentsBySupplier = useMemo(() => {
    const map = new Map<string, SupplierPayment[]>();
    for (const payment of store.supplierPayments) {
      const list = map.get(payment.supplierId) ?? [];
      list.push(payment);
      map.set(payment.supplierId, list);
    }
    return map;
  }, [store.supplierPayments]);

  const cards = useMemo(
    () =>
      store.suppliers.map((supplier) => ({
        supplier,
        totals: supplierTotals(paymentsBySupplier.get(supplier.id) ?? [], today),
      })),
    [paymentsBySupplier, store.suppliers, today],
  );

  const overall = useMemo(
    () => supplierTotals(store.supplierPayments, today),
    [store.supplierPayments, today],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return cards;
    return cards.filter(({ supplier }) =>
      [supplier.name, supplier.taxNumber, supplier.phone]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(needle),
    );
  }, [cards, query]);

  const selected =
    store.suppliers.find((item) => item.id === selectedId) ??
    (pendingName
      ? store.suppliers.find((item) => item.name === pendingName)
      : undefined);

  async function submitNewSupplier(event: React.FormEvent) {
    event.preventDefault();
    const name = newSupplier.name.trim();
    const saved = await onCreateSupplier({ ...newSupplier, name });
    if (saved) {
      setPendingName(name);
      setSelectedId(null);
      setNewSupplier(EMPTY_SUPPLIER_FORM);
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Firma ödemeleri
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          Tedarikçi ve firmalara yapılan ödemeler her firmanın kendi kartında
          tutulur. Nakit ödemeler günlük kasadan düşer; kart ve havale kasayı
          etkilemez.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Toplam ödenen" value={formatTry(overall.total)} />
        <MiniStat label="Bu yıl" value={formatTry(overall.year)} />
        <MiniStat label="Bu ay" value={formatTry(overall.month)} />
        <MiniStat
          label="Firma / ödeme"
          value={`${store.suppliers.length} firma · ${overall.count} ödeme`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <Input
                aria-label="Firma ara"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Firma ara"
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant={creating ? "secondary" : "primary"}
              className="h-12 shrink-0"
              onClick={() => setCreating((value) => !value)}
              aria-expanded={creating}
            >
              {creating ? <X className="size-4" /> : <Plus className="size-4" />}
              {creating ? "Kapat" : "Yeni firma"}
            </Button>
          </div>

          {creating && (
            <form
              onSubmit={(event) => void submitNewSupplier(event)}
              className="space-y-3 rounded-3xl border border-earth-400/15 bg-white p-5 shadow-premium"
            >
              <p className="font-display font-semibold text-ink-900">Yeni firma kartı</p>
              <SupplierFields
                idPrefix="new-supplier"
                value={newSupplier}
                onChange={setNewSupplier}
              />
              <Button type="submit" size="sm" disabled={busy}>
                Firmayı kaydet
              </Button>
            </form>
          )}

          {filtered.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-sm">
              {store.suppliers.length === 0
                ? "Henüz firma kartı yok. “Yeni firma” ile ekleyin."
                : "Aramayla eşleşen firma yok."}
            </p>
          ) : (
            <ul className="space-y-2">
              {filtered.map(({ supplier, totals }) => {
                const active = selected?.id === supplier.id;
                return (
                  <li key={supplier.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(supplier.id);
                        setPendingName(null);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-forest-700 bg-forest-800 text-white shadow-premium"
                          : "border-earth-400/10 bg-white text-ink-800 shadow-sm hover:border-forest-800/25"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-semibold">{supplier.name}</span>
                        <span className="shrink-0 font-semibold">
                          {formatTry(totals.total)}
                        </span>
                      </span>
                      <span
                        className={`mt-1 block text-xs ${active ? "text-white/70" : "text-ink-400"}`}
                      >
                        {totals.count} ödeme
                        {totals.lastDate
                          ? ` · son ${formatIsoDateTr(totals.lastDate)}`
                          : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {selected ? (
          <SupplierCard
            key={selected.id}
            supplier={selected}
            payments={paymentsBySupplier.get(selected.id) ?? []}
            today={today}
            busy={busy}
            onUpdateSupplier={onUpdateSupplier}
            onDeleteSupplier={async (id) => {
              const ok = await onDeleteSupplier(id);
              if (ok) {
                setSelectedId(null);
                setPendingName(null);
              }
              return ok;
            }}
            onCreatePayment={onCreatePayment}
            onUpdatePayment={onUpdatePayment}
            onDeletePayment={onDeletePayment}
          />
        ) : (
          <div className="grid place-items-center rounded-3xl border border-dashed border-earth-400/25 bg-white/60 p-10 text-center">
            <div>
              <Building2 className="mx-auto size-10 text-forest-700" aria-hidden />
              <p className="mt-3 font-display text-lg font-semibold text-ink-900">
                Bir firma kartı seçin
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Soldaki listeden firmayı seçerek ödemelerini görün ve yeni ödeme
                ekleyin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type PaymentForm = {
  date: string;
  amount: string;
  paymentMethod: PaymentMethod;
  description: string;
  note: string;
};

function SupplierCard({
  supplier,
  payments,
  today,
  busy,
  onUpdateSupplier,
  onDeleteSupplier,
  onCreatePayment,
  onUpdatePayment,
  onDeletePayment,
}: {
  supplier: Supplier;
  payments: SupplierPayment[];
  today: string;
  busy: boolean;
  onUpdateSupplier: Props["onUpdateSupplier"];
  onDeleteSupplier: Props["onDeleteSupplier"];
  onCreatePayment: Props["onCreatePayment"];
  onUpdatePayment: Props["onUpdatePayment"];
  onDeletePayment: Props["onDeletePayment"];
}) {
  const emptyPayment: PaymentForm = {
    date: today,
    amount: "",
    paymentMethod: "havale",
    description: "",
    note: "",
  };
  const [editingSupplier, setEditingSupplier] = useState(false);
  const [supplierForm, setSupplierForm] = useState<SupplierForm>(() =>
    supplierToForm(supplier),
  );
  const [payment, setPayment] = useState<PaymentForm>(emptyPayment);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState("");

  const totals = supplierTotals(payments, today);
  const years = [...new Set(payments.map((item) => item.date.slice(0, 4)))].sort(
    (a, b) => b.localeCompare(a),
  );
  const visiblePayments = [...payments]
    .filter((item) => !yearFilter || item.date.startsWith(yearFilter))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const visibleTotal = visiblePayments.reduce((sum, item) => sum + item.amount, 0);

  async function submitSupplier(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onUpdateSupplier(supplier.id, supplierForm);
    if (saved) setEditingSupplier(false);
  }

  async function submitPayment(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      supplierId: supplier.id,
      date: payment.date,
      amount: parseMoneyInput(payment.amount),
      paymentMethod: payment.paymentMethod,
      description: payment.description,
      note: payment.note,
    };
    const saved = editingPaymentId
      ? await onUpdatePayment(editingPaymentId, payload)
      : await onCreatePayment(payload);
    if (saved) {
      setPayment({ ...emptyPayment, date: payment.date, paymentMethod: payment.paymentMethod });
      setEditingPaymentId(null);
    }
  }

  function startEditPayment(item: SupplierPayment) {
    setEditingPaymentId(item.id);
    setPayment({
      date: item.date,
      amount: moneyToInput(item.amount),
      paymentMethod: item.paymentMethod,
      description: item.description,
      note: item.note,
    });
  }

  return (
    <section className="space-y-5" aria-label={`${supplier.name} firma kartı`}>
      <article className="rounded-3xl border border-earth-400/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Firma kartı
            </p>
            <h4 className="mt-1 font-display text-2xl font-bold text-ink-900">
              {supplier.name}
            </h4>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => {
                setSupplierForm(supplierToForm(supplier));
                setEditingSupplier((value) => !value);
              }}
            >
              <Pencil className="size-4" />
              {editingSupplier ? "Vazgeç" : "Düzenle"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              disabled={busy || payments.length > 0}
              title={
                payments.length > 0
                  ? "Ödemesi olan firma silinemez"
                  : "Firma kartını sil"
              }
              onClick={() => void onDeleteSupplier(supplier.id)}
            >
              <Trash2 className="size-4" />
              Sil
            </Button>
          </div>
        </div>

        {editingSupplier ? (
          <form onSubmit={(event) => void submitSupplier(event)} className="mt-5 space-y-3">
            <SupplierFields
              idPrefix="edit-supplier"
              value={supplierForm}
              onChange={setSupplierForm}
              wide
            />
            <Button type="submit" size="sm" disabled={busy}>
              Kartı güncelle
            </Button>
          </form>
        ) : (
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Vergi no" value={supplier.taxNumber} />
            <Detail label="Telefon" value={supplier.phone} />
            <Detail label="IBAN" value={supplier.iban} />
            {supplier.note ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <Detail label="Not" value={supplier.note} />
              </div>
            ) : null}
          </dl>
        )}
      </article>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Toplam ödenen" value={formatTry(totals.total)} strong />
        <MiniStat label="Bu yıl" value={formatTry(totals.year)} />
        <MiniStat label="Bu ay" value={formatTry(totals.month)} />
        <MiniStat
          label="Ödeme sayısı"
          value={`${totals.count}${totals.lastDate ? ` · son ${formatIsoDateTr(totals.lastDate)}` : ""}`}
        />
      </div>
      <p className="text-xs text-ink-500">
        {PAYMENT_METHODS.map(
          (method) => `${paymentMethodLabel(method)}: ${formatTry(totals.byMethod[method])}`,
        ).join(" · ")}
      </p>

      <form
        onSubmit={(event) => void submitPayment(event)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display text-lg font-semibold text-ink-900">
            {editingPaymentId ? "Ödemeyi düzenle" : "Ödeme ekle"}
          </h4>
          {editingPaymentId && (
            <button
              type="button"
              className="text-sm font-semibold text-ink-500 hover:text-ink-800"
              onClick={() => {
                setEditingPaymentId(null);
                setPayment(emptyPayment);
              }}
            >
              Vazgeç
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="supplier-pay-date">Tarih</Label>
            <Input
              id="supplier-pay-date"
              type="date"
              value={payment.date}
              onChange={(event) => setPayment({ ...payment, date: event.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="supplier-pay-amount">Tutar</Label>
            <MoneyInput
              id="supplier-pay-amount"
              value={payment.amount}
              onValueChange={(amount) => setPayment({ ...payment, amount })}
              placeholder="250.000"
              required
            />
          </div>
          <div>
            <Label htmlFor="supplier-pay-method">Ödeme</Label>
            <Select
              id="supplier-pay-method"
              value={payment.paymentMethod}
              onChange={(event) =>
                setPayment({
                  ...payment,
                  paymentMethod: event.target.value as PaymentMethod,
                })
              }
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {paymentMethodLabel(method)}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <Label htmlFor="supplier-pay-desc">Açıklama / fatura no</Label>
            <Input
              id="supplier-pay-desc"
              value={payment.description}
              onChange={(event) =>
                setPayment({ ...payment, description: event.target.value })
              }
              placeholder="Örn. Ekim çimento faturası"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="supplier-pay-note">Not</Label>
            <Input
              id="supplier-pay-note"
              value={payment.note}
              onChange={(event) => setPayment({ ...payment, note: event.target.value })}
              placeholder="Opsiyonel"
            />
          </div>
        </div>
        {payment.paymentMethod === "nakit" && (
          <p className="text-xs text-ink-500">Nakit ödeme o günün kasasından düşer.</p>
        )}
        <Button type="submit" disabled={busy}>
          {editingPaymentId ? "Ödemeyi güncelle" : "Ödemeyi kaydet"}
        </Button>
      </form>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h4 className="font-display text-lg font-semibold text-ink-900">
            Ödeme geçmişi ({visiblePayments.length})
          </h4>
          {years.length > 1 && (
            <div className="w-40">
              <Label htmlFor="supplier-year">Yıl</Label>
              <Select
                id="supplier-year"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
              >
                <option value="">Tümü</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
        {visiblePayments.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Bu firmaya henüz ödeme kaydı yok.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-earth-400/10 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-earth-400/10 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Açıklama</th>
                  <th className="px-4 py-3">Ödeme</th>
                  <th className="px-4 py-3 text-right">Tutar</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {visiblePayments.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-t border-earth-400/10 ${
                      editingPaymentId === item.id ? "bg-gold-500/10" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-ink-700">
                      {formatIsoDateTr(item.date)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-900">{item.description || "—"}</p>
                      {item.note ? <p className="text-xs text-ink-400">{item.note}</p> : null}
                    </td>
                    <td className="px-4 py-3">{paymentMethodLabel(item.paymentMethod)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-ink-900">
                      {formatTry(item.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-ink-500 hover:bg-forest-50 hover:text-forest-800 disabled:opacity-40"
                        disabled={busy}
                        onClick={() => startEditPayment(item)}
                        aria-label="Ödemeyi düzenle"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        disabled={busy}
                        onClick={() => void onDeletePayment(item.id)}
                        aria-label="Ödemeyi sil"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-earth-400/20 bg-ivory-50">
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink-700" colSpan={3}>
                    {yearFilter ? `${yearFilter} toplamı` : "Toplam"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-ink-900">
                    {formatTry(visibleTotal)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

function SupplierFields({
  idPrefix,
  value,
  onChange,
  wide = false,
}: {
  idPrefix: string;
  value: SupplierForm;
  onChange: (value: SupplierForm) => void;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>
      <div>
        <Label htmlFor={`${idPrefix}-name`}>Firma adı</Label>
        <Input
          id={`${idPrefix}-name`}
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          placeholder="Örn. Kavcim Çimento"
          required
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-tax`}>Vergi no</Label>
        <Input
          id={`${idPrefix}-tax`}
          value={value.taxNumber}
          onChange={(event) => onChange({ ...value, taxNumber: event.target.value })}
          placeholder="Opsiyonel"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-phone`}>Telefon</Label>
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          value={value.phone}
          onChange={(event) => onChange({ ...value, phone: event.target.value })}
          placeholder="Opsiyonel"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-iban`}>IBAN</Label>
        <Input
          id={`${idPrefix}-iban`}
          value={value.iban}
          onChange={(event) => onChange({ ...value, iban: event.target.value })}
          placeholder="Opsiyonel"
        />
      </div>
      <div className={wide ? "md:col-span-2" : undefined}>
        <Label htmlFor={`${idPrefix}-note`}>Not</Label>
        <Input
          id={`${idPrefix}-note`}
          value={value.note}
          onChange={(event) => onChange({ ...value, note: event.target.value })}
          placeholder="Opsiyonel"
        />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className="mt-0.5 break-words font-medium text-ink-800">{value || "—"}</dd>
    </div>
  );
}

function MiniStat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${strong ? "bg-forest-800 text-white" : "bg-white"}`}>
      <p
        className={`text-xs uppercase tracking-wider ${strong ? "text-white/70" : "text-ink-400"}`}
      >
        {label}
      </p>
      <p className={`mt-1 font-semibold ${strong ? "text-xl text-white" : "text-ink-900"}`}>
        {value}
      </p>
    </div>
  );
}
