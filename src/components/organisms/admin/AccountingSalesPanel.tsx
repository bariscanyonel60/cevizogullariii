"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { formatQuantity, formatTry, saleGross, splitVat } from "@/lib/accounting-money";
import {
  VAT_RATES,
  istanbulIsoDate,
  paymentMethodLabel,
  type AccountingStore,
  type PaymentMethod,
  type VatRate,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onCreate: (payload: Record<string, unknown>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

export function AccountingSalesPanel({ store, busy, onCreate, onDelete }: Props) {
  const [date, setDate] = useState(istanbulIsoDate());
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [vatRate, setVatRate] = useState<VatRate>(20);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("nakit");
  const [note, setNote] = useState("");

  const suggestions = useMemo(() => {
    return [...new Set(store.sales.map((sale) => sale.productName))].slice(0, 40);
  }, [store.sales]);

  const daySales = useMemo(
    () => store.sales.filter((sale) => sale.date === date),
    [date, store.sales],
  );

  const totals = useMemo(() => {
    return daySales.reduce(
      (acc, sale) => {
        const gross = saleGross(sale.quantity, sale.unitPrice);
        const parts = splitVat(gross, sale.vatRate);
        acc.gross += parts.gross;
        acc.net += parts.net;
        acc.vat += parts.vatAmount;
        if (sale.paymentMethod === "nakit") acc.cash += parts.gross;
        if (sale.paymentMethod === "kart") acc.card += parts.gross;
        return acc;
      },
      { gross: 0, net: 0, vat: 0, cash: 0, card: 0 },
    );
  }, [daySales]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreate({
      date,
      productName,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      vatRate,
      paymentMethod,
      note,
    });
    if (saved) {
      setProductName("");
      setQuantity("1");
      setUnitPrice("");
      setNote("");
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Satış ekle
        </h3>
        <p className="text-sm text-ink-500">
          Birim fiyat KDV dahildir. Nakit veya kart olarak kasa hareketine işlenir.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="sale-date">Tarih</Label>
            <Input
              id="sale-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="sale-product">Ürün</Label>
            <Input
              id="sale-product"
              list="sale-product-suggestions"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="Örn. Permolit dış cephe boyası 15 kg"
              required
            />
            <datalist id="sale-product-suggestions">
              {suggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor="sale-qty">Adet / miktar</Label>
            <Input
              id="sale-qty"
              type="number"
              min="0.001"
              step="0.001"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sale-price">Birim fiyat (KDV dahil)</Label>
            <Input
              id="sale-price"
              type="number"
              min="0.01"
              step="0.01"
              value={unitPrice}
              onChange={(event) => setUnitPrice(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sale-vat">KDV oranı</Label>
            <Select
              id="sale-vat"
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
            <Label htmlFor="sale-pay">Ödeme</Label>
            <Select
              id="sale-pay"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as PaymentMethod)
              }
            >
              <option value="nakit">Nakit</option>
              <option value="kart">Kart</option>
            </Select>
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="sale-note">Not</Label>
            <Input
              id="sale-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Opsiyonel"
            />
          </div>
        </div>
        <Button type="submit" disabled={busy}>
          Satışı kaydet
        </Button>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Günün satışları ({daySales.length})
          </h3>
          <div className="w-full sm:w-56">
            <Label htmlFor="sale-filter-date">Gün seç</Label>
            <Input
              id="sale-filter-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <MiniStat label="Toplam" value={formatTry(totals.gross)} />
          <MiniStat label="Net" value={formatTry(totals.net)} />
          <MiniStat label="KDV" value={formatTry(totals.vat)} />
          <MiniStat label="Nakit" value={formatTry(totals.cash)} />
          <MiniStat label="Kart" value={formatTry(totals.card)} />
        </div>
        {daySales.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Bu günde satış yok.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-earth-400/10 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-earth-400/10 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-4 py-3">Ürün</th>
                  <th className="px-4 py-3">Miktar</th>
                  <th className="px-4 py-3">KDV</th>
                  <th className="px-4 py-3">Ödeme</th>
                  <th className="px-4 py-3">Tutar</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {daySales.map((sale) => {
                  const gross = saleGross(sale.quantity, sale.unitPrice);
                  const { vatAmount } = splitVat(gross, sale.vatRate);
                  return (
                    <tr key={sale.id} className="border-t border-earth-400/10">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink-900">{sale.productName}</p>
                        {sale.note ? (
                          <p className="text-xs text-ink-400">{sale.note}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        {formatQuantity(sale.quantity)} × {formatTry(sale.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        %{sale.vatRate} · {formatTry(vatAmount)}
                      </td>
                      <td className="px-4 py-3">
                        {paymentMethodLabel(sale.paymentMethod)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink-900">
                        {formatTry(gross)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                          disabled={busy}
                          onClick={() => void onDelete(sale.id)}
                          aria-label="Satışı sil"
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
