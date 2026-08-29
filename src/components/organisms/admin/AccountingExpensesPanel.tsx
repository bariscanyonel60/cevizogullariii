"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { MoneyInput } from "@/components/atoms/MoneyInput";
import { AccountingPdfButton } from "@/components/organisms/admin/AccountingPdfButton";
import { dayCashSummary, formatTry, parseMoneyInput, splitVat } from "@/lib/accounting-money";
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  VAT_RATES,
  expenseCategoryLabel,
  istanbulIsoDate,
  paymentMethodLabel,
  type AccountingStore,
  type ExpenseCategory,
  type PaymentMethod,
  type VatRate,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onCreate: (payload: Record<string, unknown>) => Promise<boolean>;
  onZeroCash: (date: string, amount: number) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export function AccountingExpensesPanel({
  store,
  busy,
  onCreate,
  onZeroCash,
  onDelete,
  onError,
  onMessage,
}: Props) {
  const [date, setDate] = useState(istanbulIsoDate());
  const [category, setCategory] = useState<ExpenseCategory>("tedarik");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState<"" | VatRate>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("nakit");
  const [note, setNote] = useState("");

  const cash = useMemo(() => dayCashSummary(store, date), [date, store]);
  const dayExpenses = useMemo(
    () => (store.expenses ?? []).filter((item) => item.date === date),
    [date, store.expenses],
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreate({
      date,
      category,
      title,
      amount: parseMoneyInput(amount),
      vatRate: vatRate === "" ? null : vatRate,
      paymentMethod,
      note,
    });
    if (saved) {
      setTitle("");
      setAmount("");
      setNote("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900">
              Günlük nakit kasa
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              Nakit satış + nakit tahsilat − nakit gider − personel avansı. Kart
              ve havale kasaya girmez. Günün sonunda nakit evde veya bankadaysa
              Kasayı 0’la; satışlar silinmez.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-end gap-3 sm:w-auto">
            <div className="w-full sm:w-56">
              <Label htmlFor="expense-filter-date">Gün seç</Label>
              <Input
                id="expense-filter-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <AccountingPdfButton
              kind="expenses"
              date={date}
              disabled={busy}
              onError={onError}
              onMessage={onMessage}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={busy || cash.cashNet <= 0}
              onClick={() => void onZeroCash(date, cash.cashNet)}
            >
              Kasayı 0’la
            </Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label="Nakit giren" value={formatTry(cash.cashIn)} />
          <MiniStat label="Nakit çıkan" value={formatTry(cash.cashOut)} />
          <MiniStat label="Net nakit kasa" value={formatTry(cash.cashNet)} />
          <MiniStat label="Günün gideri" value={formatTry(cash.expenseTotal)} />
        </div>
        <dl className="grid gap-2 rounded-2xl bg-white p-4 text-sm shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          <CashRow
            label="Nakit satış"
            value={formatTry(cash.cashSales)}
          />
          <CashRow
            label="Nakit tahsilat"
            value={formatTry(cash.cashCollections)}
          />
          <CashRow
            label="Nakit gider"
            value={formatTry(cash.cashExpenses)}
          />
          <CashRow label="Avans" value={formatTry(cash.advances)} />
          <CashRow
            label="Kart (satış + tahsilat)"
            value={formatTry(cash.cardSales + cash.cardCollections)}
          />
          <CashRow
            label="Havale (satış + tahsilat)"
            value={formatTry(cash.transferSales + cash.transferCollections)}
          />
        </dl>
      </section>

      <form
        onSubmit={(event) => void onSubmit(event)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Gider ekle
        </h3>
        <p className="text-sm text-ink-500">
          Kira, fatura, yakıt ve tedarik alışları. Nakit gider kasadan düşer.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="expense-date">Tarih</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="expense-category">Kategori</Label>
            <Select
              id="expense-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ExpenseCategory)
              }
            >
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {expenseCategoryLabel(item)}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <Label htmlFor="expense-title">Açıklama</Label>
            <Input
              id="expense-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Örn. Depo elektriği"
              required
            />
          </div>
          <div>
            <Label htmlFor="expense-amount">Tutar</Label>
            <MoneyInput
              id="expense-amount"
              value={amount}
              onValueChange={setAmount}
              placeholder="1.000"
              required
            />
          </div>
          <div>
            <Label htmlFor="expense-vat">KDV</Label>
            <Select
              id="expense-vat"
              value={vatRate}
              onChange={(event) => {
                const next = event.target.value;
                setVatRate(next === "" ? "" : (Number(next) as VatRate));
              }}
            >
              <option value="">KDV yok</option>
              {VAT_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  %{rate}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="expense-pay">Ödeme</Label>
            <Select
              id="expense-pay"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as PaymentMethod)
              }
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {paymentMethodLabel(method)}
                </option>
              ))}
            </Select>
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="expense-note">Not</Label>
            <Input
              id="expense-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Opsiyonel"
            />
          </div>
        </div>
        <Button type="submit" disabled={busy}>
          Gideri kaydet
        </Button>
      </form>

      <section className="space-y-4">
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Günün giderleri ({dayExpenses.length})
        </h3>
        {dayExpenses.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Bu günde gider yok.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-earth-400/10 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-earth-400/10 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-4 py-3">Açıklama</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">KDV</th>
                  <th className="px-4 py-3">Ödeme</th>
                  <th className="px-4 py-3">Tutar</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {dayExpenses.map((item) => {
                  const vatLabel =
                    item.vatRate === null
                      ? "—"
                      : `%${item.vatRate} · ${formatTry(splitVat(item.amount, item.vatRate).vatAmount)}`;
                  return (
                    <tr key={item.id} className="border-t border-earth-400/10">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink-900">{item.title}</p>
                        {item.note ? (
                          <p className="text-xs text-ink-400">{item.note}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        {expenseCategoryLabel(item.category)}
                      </td>
                      <td className="px-4 py-3 text-ink-700">{vatLabel}</td>
                      <td className="px-4 py-3">
                        {paymentMethodLabel(item.paymentMethod)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink-900">
                        {formatTry(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                          disabled={busy}
                          onClick={() => void onDelete(item.id)}
                          aria-label="Gideri sil"
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
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-1 font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function CashRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}
