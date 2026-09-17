"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import {
  draftFromCustomer,
  emptyCustomerDraft,
  type CustomerDraft,
} from "@/components/organisms/admin/accounting-customer-shared";
import {
  customerFullName,
  type AccountingStore,
} from "@/lib/accounting-types";

type Props = {
  store: AccountingStore;
  busy: boolean;
  customerId: string | null;
  onBack: () => void;
  onCreateCustomer: (payload: Record<string, unknown>) => Promise<boolean>;
  onUpdateCustomer: (
    id: string,
    payload: Record<string, unknown>,
  ) => Promise<boolean>;
  onDeleteCustomer: (id: string) => Promise<boolean>;
  onOpenLedger: (customerId: string) => void;
};

export function AccountingCustomerCardPage({
  store,
  busy,
  customerId,
  onBack,
  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onOpenLedger,
}: Props) {
  const existing =
    customerId === null
      ? null
      : (store.customers.find((item) => item.id === customerId) ?? null);
  const isCreate = customerId === null;
  const [draft, setDraft] = useState<CustomerDraft>(
    existing ? draftFromCustomer(existing) : emptyCustomerDraft,
  );

  useEffect(() => {
    if (isCreate) {
      setDraft(emptyCustomerDraft);
      return;
    }
    if (existing) {
      setDraft(draftFromCustomer(existing));
    }
  }, [existing, isCreate]);

  if (!isCreate && !existing) {
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (isCreate) {
      const saved = await onCreateCustomer(draft);
      if (saved) onBack();
      return;
    }
    if (!existing) return;
    const saved = await onUpdateCustomer(existing.id, draft);
    if (saved) onBack();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Listeye dön
        </Button>
        {existing ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => onOpenLedger(existing.id)}
          >
            <Wallet className="size-4" />
            Hareketlere git
          </Button>
        ) : null}
      </div>

      <form
        onSubmit={(event) => void submit(event)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-900">
              {isCreate ? "Yeni veresiye kartı" : "Kartı güncelle"}
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {isCreate
                ? "Sadece müşteri kimlik bilgileri. Borç / tahsilat hareket sayfasında."
                : existing
                  ? customerFullName(existing)
                  : ""}
            </p>
          </div>
          {existing ? (
            <button
              type="button"
              className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
              disabled={busy}
              onClick={() => void onDeleteCustomer(existing.id)}
              aria-label="Müşteri kartını sil"
            >
              <Trash2 className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="card-first">Ad</Label>
            <Input
              id="card-first"
              value={draft.firstName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="card-last">Soyad</Label>
            <Input
              id="card-last"
              value={draft.lastName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="card-tc">
              T.C. kimlik no{" "}
              <span className="font-normal text-ink-400">(isteğe bağlı)</span>
            </Label>
            <Input
              id="card-tc"
              maxLength={64}
              value={draft.tc}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  tc: event.target.value.slice(0, 64),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="card-phone">Telefon</Label>
            <Input
              id="card-phone"
              value={draft.phone}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="card-address">Adres</Label>
            <Textarea
              id="card-address"
              value={draft.address}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={busy}>
          {isCreate ? "Kartı oluştur" : "Kartı kaydet"}
        </Button>
      </form>
    </div>
  );
}
