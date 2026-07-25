"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { whatsappUrl } from "@/lib/constants";

const quoteSchema = z.object({
  name: z.string().min(2, "Ad soyad gerekli"),
  company: z.string().optional(),
  phone: z.string().min(10, "Geçerli telefon girin"),
  type: z.enum(["boya", "yalitim", "orman", "santiye", "diger"]),
  details: z.string().min(10, "Detayları yazın"),
  consent: z.literal(true, {
    error: "Devam etmek için KVKK bilgilendirmesini onaylayın",
  }),
});

type QuoteValues = z.infer<typeof quoteSchema>;

const typeLabels: Record<QuoteValues["type"], string> = {
  boya: "Boya / Dış Cephe",
  yalitim: "Yalıtım / Mantolama",
  orman: "Orman Ürünleri",
  santiye: "Şantiye / Toplu Malzeme",
  diger: "Diğer",
};

export function QuoteForm({
  defaultType = "boya",
}: {
  defaultType?: QuoteValues["type"];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { type: defaultType },
  });

  const onSubmit = (data: QuoteValues) => {
    const text = [
      "Merhaba, teklif talebim var.",
      `Ad Soyad: ${data.name}`,
      data.company ? `Firma: ${data.company}` : null,
      `Telefon: ${data.phone}`,
      `Talep: ${typeLabels[data.type]}`,
      `Detay: ${data.details}`,
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
            Bilgilerimin WhatsApp üzerinden iletilmesi için{" "}
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
      <Button type="submit" size="lg" disabled={isSubmitting}>
        <WhatsAppIcon className="size-4" />
        {isSubmitting ? "Açılıyor..." : "WhatsApp ile Teklif İste"}
      </Button>
      <p className="text-xs text-ink-400">
        Bu form sunucuya kayıt göndermez; teklif metninizi WhatsApp’ta hazırlar.
      </p>
    </form>
  );
}
