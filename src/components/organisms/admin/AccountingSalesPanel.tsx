"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { MoneyInput } from "@/components/atoms/MoneyInput";
import { AccountingPdfButton } from "@/components/organisms/admin/AccountingPdfButton";
import {
  formatQuantity,
  formatTry,
  parseMoneyInput,
  saleSignedGross,
  splitVat,
} from "@/lib/accounting-money";
import {
  PAYMENT_METHODS,
  SALE_KINDS,
  VAT_RATES,
  istanbulIsoDate,
  paymentMethodLabel,
  saleKindLabel,
  type AccountingStore,
  type PaymentMethod,
  type SaleKind,
  type VatRate,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onCreate: (payload: Record<string, unknown>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export function AccountingSalesPanel({
  store,
  busy,
  onCreate,
  onDelete,
  onError,
  onMessage,
}: Props) {
  const [date, setDate] = useState(istanbulIsoDate());
  const [kind, setKind] = useState<SaleKind>("sale");
  const [exchangeRefund, setExchangeRefund] = useState(false);
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
        const signed = saleSignedGross(sale);
        const abs = Math.abs(signed);
        const parts = splitVat(abs, sale.vatRate);
        const sign = signed < 0 ? -1 : 1;
        acc.gross += signed;
        acc.net += sign * parts.net;
        acc.vat += sign * parts.vatAmount;
        if (sale.paymentMethod === "nakit") acc.cash += signed;
        if (sale.paymentMethod === "kart") acc.card += signed;
        if (sale.paymentMethod === "havale") acc.transfer += signed;
        if (sale.kind === "return" || (sale.kind === "exchange" && sale.exchangeRefund)) {
          acc.refunds += abs;
        }
        return acc;
      },
      { gross: 0, net: 0, vat: 0, cash: 0, card: 0, transfer: 0, refunds: 0 },
    );
  }, [daySales]);

  const priceLabel =
    kind === "exchange"
      ? exchangeRefund
        ? "İade edilen fark (KDV dahil)"
        : "Alınan fark (KDV dahil)"
      : kind === "return"
        ? "İade birim fiyat (KDV dahil)"
        : "Birim fiyat (KDV dahil)";

  const payLabel =
    kind === "return" || (kind === "exchange" && exchangeRefund)
      ? "İade yöntemi"
      : "Ödeme";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreate({
      date,
      kind,
      exchangeRefund: kind === "exchange" ? exchangeRefund : false,
      productName,
      quantity: Number(quantity),
      unitPrice: parseMoneyInput(unitPrice),
      vatRate,
      paymentMethod,
      note,
    });
    if (saved) {
      setProductName("");
      setQuantity("1");
      setUnitPrice("");
      setNote("");
      setExchangeRefund(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Satış / iade / değişim
        </h3>
        <p className="text-sm text-ink-500">
          İade kasadan düşer. Değişimde fark tutarını yazın; müşteri ödediyse
          tahsilat, siz iade ettiyseniz iade yönünü seçin.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="sale-kind">İşlem türü</Label>
            <Select
              id="sale-kind"
              value={kind}
              onChange={(event) => {
                const next = event.target.value as SaleKind;
                setKind(next);
                if (next !== "exchange") setExchangeRefund(false);
              }}
            >
              {SALE_KINDS.map((item) => (
                <option key={item} value={item}>
                  {saleKindLabel(item)}
                </option>
              ))}
            </Select>
          </div>
          {kind === "exchange" ? (
            <div>
              <Label htmlFor="sale-exchange-dir">Fark yönü</Label>
              <Select
                id="sale-exchange-dir"
                value={exchangeRefund ? "refund" : "collect"}
                onChange={(event) =>
                  setExchangeRefund(event.target.value === "refund")
                }
              >
                <option value="collect">Müşteri fark ödedi</option>
                <option value="refund">Fark iade edildi</option>
              </Select>
            </div>
          ) : null}
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
          <div className="md:col-span-2 lg:col-span-3">
            <Label htmlFor="sale-product">
              {kind === "exchange" ? "Yeni / değişen ürün" : "Ürün"}
            </Label>
            <Input
              id="sale-product"
              list="sale-product-suggestions"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder={
                kind === "exchange"
                  ? "Örn. OSB 11 mm (eski: 8 mm) — notta detay yazabilirsiniz"
                  : "Örn. Permolit dış cephe boyası 15 kg"
              }
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
            <Label htmlFor="sale-price">{priceLabel}</Label>
            <MoneyInput
              id="sale-price"
              value={unitPrice}
              onValueChange={setUnitPrice}
              placeholder="1.000"
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
            <Label htmlFor="sale-pay">{payLabel}</Label>
            <Select
              id="sale-pay"
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
          <div className="lg:col-span-2">
            <Label htmlFor="sale-note">Not</Label>
            <Input
              id="sale-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                kind === "exchange"
                  ? "Örn. Eski ürün: OSB 8 mm — yeni: 11 mm"
                  : "Opsiyonel"
              }
            />
          </div>
        </div>
        <Button type="submit" disabled={busy}>
          {kind === "return"
            ? "İadeyi kaydet"
            : kind === "exchange"
              ? "Değişimi kaydet"
              : "Satışı kaydet"}
        </Button>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Günün işlemleri ({daySales.length})
          </h3>
          <div className="flex w-full flex-wrap items-end gap-3 sm:w-auto">
            <div className="w-full sm:w-56">
              <Label htmlFor="sale-filter-date">Gün seç</Label>
              <Input
                id="sale-filter-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <AccountingPdfButton
              kind="sales"
              date={date}
              disabled={busy}
              onError={onError}
              onMessage={onMessage}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <MiniStat label="Net gün" value={formatTry(totals.gross)} />
          <MiniStat label="Net (KDV hariç)" value={formatTry(totals.net)} />
          <MiniStat label="KDV" value={formatTry(totals.vat)} />
          <MiniStat label="Nakit" value={formatTry(totals.cash)} />
          <MiniStat label="Kart" value={formatTry(totals.card)} />
          <MiniStat label="Havale" value={formatTry(totals.transfer)} />
          <MiniStat label="İade / fark iadesi" value={formatTry(totals.refunds)} />
        </div>
        {daySales.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Bu günde işlem yok.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-earth-400/10 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-earth-400/10 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-4 py-3">İşlem</th>
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
                  const signed = saleSignedGross(sale);
                  const abs = Math.abs(signed);
                  const { vatAmount } = splitVat(abs, sale.vatRate);
                  const isOut =
                    sale.kind === "return" ||
                    (sale.kind === "exchange" && sale.exchangeRefund);
                  const kindLabel =
                    sale.kind === "exchange" && sale.exchangeRefund
                      ? "Değişim (iade)"
                      : sale.kind === "exchange"
                        ? "Değişim (fark)"
                        : saleKindLabel(sale.kind);
                  return (
                    <tr key={sale.id} className="border-t border-earth-400/10">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isOut
                              ? "bg-red-50 text-red-700"
                              : sale.kind === "exchange"
                                ? "bg-amber-50 text-amber-800"
                                : "bg-forest-50 text-forest-800"
                          }`}
                        >
                          {kindLabel}
                        </span>
                      </td>
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
                      <td
                        className={`px-4 py-3 font-semibold ${
                          isOut ? "text-red-700" : "text-ink-900"
                        }`}
                      >
                        {isOut ? "−" : ""}
                        {formatTry(abs)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                          disabled={busy}
                          onClick={() => void onDelete(sale.id)}
                          aria-label="İşlemi sil"
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
