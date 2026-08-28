"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { formatTry } from "@/lib/accounting-money";
import {
  istanbulIsoDate,
  istanbulYearMonth,
  type AccountingStore,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  onCreateStaff: (payload: Record<string, unknown>) => Promise<boolean>;
  onCreateAdvance: (payload: Record<string, unknown>) => Promise<boolean>;
  onDeleteStaff: (id: string) => Promise<boolean>;
  onDeleteAdvance: (id: string) => Promise<boolean>;
};

export function AccountingStaffPanel({
  store,
  busy,
  onCreateStaff,
  onCreateAdvance,
  onDeleteStaff,
  onDeleteAdvance,
}: Props) {
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState(store.staff[0]?.id ?? "");
  const [date, setDate] = useState(istanbulIsoDate());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [month, setMonth] = useState(istanbulYearMonth());

  useEffect(() => {
    if (staffId && store.staff.some((member) => member.id === staffId)) return;
    setStaffId(store.staff[0]?.id ?? "");
  }, [staffId, store.staff]);

  const monthAdvances = useMemo(
    () => store.advances.filter((item) => item.date.startsWith(month)),
    [month, store.advances],
  );

  const monthTotals = useMemo(() => {
    return store.staff.map((member) => ({
      ...member,
      total: monthAdvances
        .filter((item) => item.staffId === member.id)
        .reduce((sum, item) => sum + item.amount, 0),
    }));
  }, [monthAdvances, store.staff]);

  const monthTotal = monthAdvances.reduce((sum, item) => sum + item.amount, 0);

  async function submitStaff(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreateStaff({ name });
    if (saved) setName("");
  }

  async function submitAdvance(event: React.FormEvent) {
    event.preventDefault();
    const saved = await onCreateAdvance({
      staffId,
      date,
      amount: Number(amount),
      note,
    });
    if (saved) {
      setAmount("");
      setNote("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(event) => void submitStaff(event)}
          className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
        >
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Personel ekle
          </h3>
          <div>
            <Label htmlFor="staff-name">Ad soyad</Label>
            <Input
              id="staff-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn. Ahmet Yılmaz"
              required
            />
          </div>
          <Button type="submit" disabled={busy}>
            Personeli kaydet
          </Button>
        </form>

        <form
          onSubmit={(event) => void submitAdvance(event)}
          className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
        >
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Kasadan avans
          </h3>
          <div>
            <Label htmlFor="advance-staff">Personel</Label>
            <Select
              id="advance-staff"
              value={staffId}
              onChange={(event) => setStaffId(event.target.value)}
              required
              disabled={store.staff.length === 0}
            >
              {store.staff.length === 0 ? (
                <option value="">Önce personel ekleyin</option>
              ) : (
                store.staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))
              )}
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="advance-date">Tarih</Label>
              <Input
                id="advance-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="advance-amount">Tutar</Label>
              <Input
                id="advance-amount"
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
            <Label htmlFor="advance-note">Not</Label>
            <Input
              id="advance-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Opsiyonel"
            />
          </div>
          <Button type="submit" disabled={busy || store.staff.length === 0}>
            Avansı kaydet
          </Button>
        </form>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900">
              Ay içi avans özeti
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              Toplam {formatTry(monthTotal)}
              {monthTotals.some((item) => item.total > 0)
                ? " · avans alan personel var"
                : " · bu ay avans alan yok"}
            </p>
          </div>
          <div className="w-full sm:w-56">
            <Label htmlFor="advance-month">Ay</Label>
            <Input
              id="advance-month"
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
          </div>
        </div>
        {store.staff.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Henüz personel yok.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {monthTotals.map((member) => (
              <article
                key={member.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-earth-400/10 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-ink-900">{member.name}</p>
                  <p
                    className={`mt-1 text-sm ${
                      member.total > 0 ? "text-gold-600" : "text-ink-400"
                    }`}
                  >
                    {member.total > 0
                      ? `${formatTry(member.total)} avans`
                      : "Bu ay avans yok"}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                  disabled={busy}
                  onClick={() => void onDeleteStaff(member.id)}
                  aria-label={`${member.name} personelini sil`}
                >
                  <Trash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Avans hareketleri
        </h3>
        {monthAdvances.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Seçilen ayda avans kaydı yok.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-earth-400/10 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-earth-400/10 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Personel</th>
                  <th className="px-4 py-3">Tutar</th>
                  <th className="px-4 py-3">Not</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {monthAdvances.map((item) => {
                  const member = store.staff.find(
                    (candidate) => candidate.id === item.staffId,
                  );
                  return (
                    <tr key={item.id} className="border-t border-earth-400/10">
                      <td className="px-4 py-3">{item.date}</td>
                      <td className="px-4 py-3 font-medium text-ink-900">
                        {member?.name ?? "Silinmiş personel"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatTry(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-ink-500">{item.note || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                          disabled={busy}
                          onClick={() => void onDeleteAdvance(item.id)}
                          aria-label="Avansı sil"
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
