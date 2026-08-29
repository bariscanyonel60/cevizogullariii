"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Banknote,
  CreditCard,
  FileBarChart,
  NotebookTabs,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import { AccountingCustomersPanel } from "@/components/organisms/admin/AccountingCustomersPanel";
import { AccountingReportsPanel } from "@/components/organisms/admin/AccountingReportsPanel";
import { AccountingSalesPanel } from "@/components/organisms/admin/AccountingSalesPanel";
import { AccountingStaffPanel } from "@/components/organisms/admin/AccountingStaffPanel";
import { customerBalance, formatTry, splitVat } from "@/lib/accounting-money";
import {
  emptyAccountingStore,
  istanbulIsoDate,
  istanbulYearMonth,
  paymentMethodLabel,
  type AccountingEntity,
  type AccountingStore,
} from "@/lib/accounting-types";

type AccountingTab = "summary" | "sales" | "staff" | "customers" | "reports";

const TABS: { id: AccountingTab; label: string; icon: typeof Wallet }[] = [
  { id: "summary", label: "Özet", icon: Wallet },
  { id: "sales", label: "Günlük satış", icon: Receipt },
  { id: "staff", label: "Personel / avans", icon: Users },
  { id: "customers", label: "Veresiye kartları", icon: NotebookTabs },
  { id: "reports", label: "Aylık rapor", icon: FileBarChart },
];

async function parseStoreResponse(res: Response): Promise<AccountingStore> {
  const data = (await res.json()) as { store?: AccountingStore; error?: string };
  if (!res.ok) throw new Error(data.error ?? "İşlem başarısız");
  return data.store ?? emptyAccountingStore();
}

export function AccountingDashboard() {
  const [tab, setTab] = useState<AccountingTab>("summary");
  const [store, setStore] = useState<AccountingStore>(emptyAccountingStore());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const today = istanbulIsoDate();
  const month = istanbulYearMonth();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/accounting", { cache: "no-store" });
        const next = await parseStoreResponse(res);
        if (!cancelled) setStore(next);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Kayıtlar alınamadı");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createRecord(
    entity: AccountingEntity,
    payload: Record<string, unknown>,
  ) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/accounting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, ...payload }),
      });
      setStore(await parseStoreResponse(res));
      setMessage("Kayıt eklendi");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt eklenemedi");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function updateCustomer(id: string, payload: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/accounting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "customer", id, ...payload }),
      });
      setStore(await parseStoreResponse(res));
      setMessage("Müşteri kartı güncellendi");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncellenemedi");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function removeRecord(
    entity: AccountingEntity,
    id: string,
    confirmMessage: string,
  ) {
    if (!window.confirm(confirmMessage)) return false;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/accounting?entity=${entity}&id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      setStore(await parseStoreResponse(res));
      setMessage("Kayıt silindi");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const summary = useMemo(() => {
    const todaySales = store.sales.filter((sale) => sale.date === today);
    const monthSales = store.sales.filter((sale) => sale.date.startsWith(month));
    const monthAdvances = store.advances.filter((item) =>
      item.date.startsWith(month),
    );

    function totals(list: typeof store.sales) {
      return list.reduce(
        (acc, sale) => {
          const gross = sale.quantity * sale.unitPrice;
          const { vatAmount } = splitVat(gross, sale.vatRate);
          acc.gross += gross;
          acc.vat += vatAmount;
          if (sale.paymentMethod === "nakit") acc.cash += gross;
          if (sale.paymentMethod === "kart") acc.card += gross;
          return acc;
        },
        { gross: 0, vat: 0, cash: 0, card: 0 },
      );
    }

    const outstanding = store.customers.reduce((total, customer) => {
      return (
        total +
        customerBalance(
          store.creditEntries.filter((entry) => entry.customerId === customer.id),
        )
      );
    }, 0);

    const staffAdvances = store.staff
      .map((member) => ({
        name: member.name,
        amount: monthAdvances
          .filter((item) => item.staffId === member.id)
          .reduce((sum, item) => sum + item.amount, 0),
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    return {
      today: totals(todaySales),
      todayCount: todaySales.length,
      month: totals(monthSales),
      monthAdvanceTotal: monthAdvances.reduce((sum, item) => sum + item.amount, 0),
      staffAdvances,
      outstanding,
      customerCount: store.customers.length,
    };
  }, [month, store, today]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">
          Ön muhasebe
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Satış, kasa avansı ve veresiye yalnızca bu panelde durur; sitede
          görünmez.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {TABS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setError(null);
                setMessage(null);
              }}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                tab === item.id
                  ? "border-forest-700 bg-forest-800 text-white shadow-premium"
                  : "border-earth-400/10 bg-white text-ink-700 shadow-sm hover:border-forest-800/25"
              }`}
            >
              <span
                className={`rounded-xl p-2.5 ${
                  tab === item.id ? "bg-white/10" : "bg-forest-50 text-forest-800"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-2xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-ink-500">Kayıtlar yükleniyor…</p>
      ) : tab === "summary" ? (
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Bugünkü satış"
              value={formatTry(summary.today.gross)}
              hint={`${summary.todayCount} işlem · KDV ${formatTry(summary.today.vat)}`}
            />
            <SummaryCard
              label="Bugün nakit"
              value={formatTry(summary.today.cash)}
              icon={<Banknote className="size-4" />}
            />
            <SummaryCard
              label="Bugün kart"
              value={formatTry(summary.today.card)}
              icon={<CreditCard className="size-4" />}
            />
            <SummaryCard
              label="Açık veresiye"
              value={formatTry(summary.outstanding)}
              hint={`${summary.customerCount} müşteri kartı`}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-earth-400/10 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-ink-900">
                Bu ay kasa
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Toplam satış" value={formatTry(summary.month.gross)} />
                <Row label="Nakit" value={formatTry(summary.month.cash)} />
                <Row label="Kart" value={formatTry(summary.month.card)} />
                <Row label="KDV" value={formatTry(summary.month.vat)} />
              </dl>
            </article>
            <article className="rounded-3xl border border-earth-400/10 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-ink-900">
                Bu ay personel avansı
              </h3>
              <p className="mt-2 text-2xl font-semibold text-ink-900">
                {formatTry(summary.monthAdvanceTotal)}
              </p>
              {summary.staffAdvances.length === 0 ? (
                <p className="mt-3 text-sm text-ink-500">
                  Bu ay kasadan avans alan personel yok.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {summary.staffAdvances.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium text-ink-800">{item.name}</span>
                      <span>{formatTry(item.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
          <p className="text-xs text-ink-400">
            Tutarlar KDV dahil. Tarihler Türkiye saatiyle tutulur. Ödeme
            yöntemi: {paymentMethodLabel("nakit")} / {paymentMethodLabel("kart")}.
          </p>
        </section>
      ) : tab === "sales" ? (
        <AccountingSalesPanel
          store={store}
          busy={busy}
          onCreate={(payload) => createRecord("sale", payload)}
          onDelete={(id) =>
            removeRecord("sale", id, "Bu satış kaydı silinsin mi?")
          }
        />
      ) : tab === "staff" ? (
        <AccountingStaffPanel
          store={store}
          busy={busy}
          onCreateStaff={(payload) => createRecord("staff", payload)}
          onCreateAdvance={(payload) => createRecord("advance", payload)}
          onDeleteStaff={(id) =>
            removeRecord("staff", id, "Bu personel silinsin mi?")
          }
          onDeleteAdvance={(id) =>
            removeRecord("advance", id, "Bu avans kaydı silinsin mi?")
          }
        />
      ) : tab === "customers" ? (
        <AccountingCustomersPanel
          store={store}
          busy={busy}
          onCreateCustomer={(payload) => createRecord("customer", payload)}
          onUpdateCustomer={updateCustomer}
          onCreateCredit={(payload) => createRecord("credit", payload)}
          onDeleteCustomer={(id) =>
            removeRecord(
              "customer",
              id,
              "Bu müşteri kartı silinsin mi? Kartta hareket olmamalı.",
            )
          }
          onDeleteCredit={(id) =>
            removeRecord("credit", id, "Bu veresiye hareketi silinsin mi?")
          }
          onError={setError}
          onMessage={setMessage}
        />
      ) : (
        <AccountingReportsPanel
          store={store}
          busy={busy}
          onError={setError}
          onMessage={setMessage}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
