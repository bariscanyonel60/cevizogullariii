"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { whatsappUrl } from "@/lib/constants";
import {
  QUOTE_TYPE_LABELS,
  quoteMailSchema,
  type QuoteMailValues,
} from "@/lib/mail-schema";

export function QuoteForm({
  defaultType = "boya",
}: {
  defaultType?: QuoteMailValues["type"];
}) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<QuoteMailValues>({
    resolver: zodResolver(quoteMailSchema),
    defaultValues: { kind: "quote", type: defaultType },
  });

  const onSubmit = async (data: QuoteMailValues) => {
    setStatus("idle");
    setErrorMessage("");
    const response = await fetch("/api/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    if (!response.ok) {
      setStatus("error");
      setErrorMessage(payload?.error || "Teklif gönderilemedi.");
      return;
    }
    reset({ kind: "quote", type: defaultType });
    setStatus("sent");
  };

  const openWhatsApp = () => {
    const data = getValues();
    const text = [
      "Merhaba, teklif talebim var.",
      data.name ? `Ad Soyad: ${data.name}` : null,
      data.company ? `Firma: ${data.company}` : null,
      data.phone ? `Telefon: ${data.phone}` : null,
      data.type ? `Talep: ${QUOTE_TYPE_LABELS[data.type]}` : null,
      data.details ? `Detay: ${data.details}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl bg-white p-6 shadow-premium md:p-8"
      noValidate
    >
      <input type="hidden" {...register("kind")} />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="q-name">Ad Soyad</Label>
          <Input id="q-name" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="q-company">Firma (opsiyonel)</Label>
          <Input id="q-company" {...register("company")} />
        </div>
      </div>
      <div>
        <Label htmlFor="q-phone">Telefon</Label>
        <Input id="q-phone" {...register("phone")} placeholder="05xx xxx xx xx" />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="q-type">Talep Türü</Label>
        <select
          id="q-type"
          {...register("type")}
          className="flex h-12 w-full rounded-xl border border-earth-400/20 bg-white px-4 text-sm"
        >
          <option value="boya">Boya / Dış Cephe</option>
          <option value="yalitim">Yalıtım / Mantolama</option>
          <option value="orman">Orman Ürünleri</option>
          <option value="santiye">Şantiye / Toplu Malzeme</option>
          <option value="diger">Diğer</option>
        </select>
      </div>
      <div>
        <Label htmlFor="q-details">Detaylar</Label>
        <Textarea
          id="q-details"
          {...register("details")}
          placeholder="Ürün, miktar veya proje bilgisini yazın..."
        />
        {errors.details && (
          <p className="mt-1 text-xs text-red-600">{errors.details.message}</p>
        )}
      </div>
      <div>
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-earth-400/40"
            {...register("consent")}
          />
          <span>
            Bilgilerimin e-posta ile iletilmesi için{" "}
            <Link href="/kvkk" className="font-semibold text-forest-800 underline-offset-2 hover:underline">
              KVKK aydınlatma metnini
            </Link>{" "}
            okudum, onaylıyorum.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-xs text-red-600">{errors.consent.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Mail className="size-4" />
          {isSubmitting ? "Gönderiliyor..." : "E-posta ile Teklif İste"}
        </Button>
        <Button type="button" size="lg" variant="secondary" onClick={openWhatsApp}>
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </Button>
      </div>
      {status === "sent" && (
        <p className="text-sm text-forest-800">
          Teklif talebiniz iletildi. En kısa sürede dönüş yapacağız.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      <p className="text-xs text-ink-400">
        Form sunucuya e-posta gönderir. WhatsApp seçeneği aynı metni uygulamada açar.
      </p>
    </form>
  );
}
