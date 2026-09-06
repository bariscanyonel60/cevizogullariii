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
import { SITE, whatsappUrl } from "@/lib/constants";
import {
  contactMailSchema,
  type ContactMailValues,
} from "@/lib/mail-schema";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ContactMailValues>({
    resolver: zodResolver(contactMailSchema),
    defaultValues: { kind: "contact", email: "" },
  });

  const onSubmit = async (data: ContactMailValues) => {
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
      setErrorMessage(payload?.error || "Mesaj gönderilemedi.");
      return;
    }
    reset({ kind: "contact", email: "" });
    setStatus("sent");
  };

  const openWhatsApp = () => {
    const data = getValues();
    const text = [
      "Merhaba, web sitesinden iletişime geçiyorum.",
      data.name ? `Ad Soyad: ${data.name}` : null,
      data.phone ? `Telefon: ${data.phone}` : null,
      data.email ? `E-posta: ${data.email}` : null,
      data.subject ? `Konu: ${data.subject}` : null,
      data.message ? `Mesaj: ${data.message}` : null,
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
          <Label htmlFor="name">Ad Soyad</Label>
          <Input id="name" {...register("name")} placeholder="Adınız Soyadınız" />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" {...register("phone")} placeholder="05xx xxx xx xx" />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="email">E-posta (opsiyonel)</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="ornek@mail.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="subject">Konu</Label>
        <Input id="subject" {...register("subject")} placeholder="Örn. Dış cephe boyası" />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="message">Mesaj</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="İhtiyacınızı kısaca yazın..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
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
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          <Mail className="size-4" />
          {isSubmitting ? "Gönderiliyor..." : "E-posta ile Gönder"}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="secondary"
          onClick={openWhatsApp}
          className="w-full sm:w-auto"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </Button>
      </div>
      {status === "sent" && (
        <p className="text-sm text-forest-800">
          Mesajınız iletildi. En kısa sürede dönüş yapacağız.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      <p className="text-xs text-ink-400">
        Form, talebinizi {SITE.email} adresine e-posta olarak gönderir.
        Dilerseniz aynı metni WhatsApp’tan da iletebilirsiniz.
      </p>
    </form>
  );
}
