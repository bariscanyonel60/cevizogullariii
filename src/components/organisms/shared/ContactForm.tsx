"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { whatsappUrl } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.union([z.email("Geçerli bir e-posta girin"), z.literal("")]),
  phone: z.string().min(10, "Geçerli bir telefon girin"),
  subject: z.string().min(3, "Konu gerekli"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactValues) => {
    const text = [
      "Merhaba, web sitesinden iletişime geçiyorum.",
      `Ad Soyad: ${data.name}`,
      `Telefon: ${data.phone}`,
      data.email ? `E-posta: ${data.email}` : null,
      `Konu: ${data.subject}`,
      `Mesaj: ${data.message}`,
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
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        <WhatsAppIcon className="size-4" />
        {isSubmitting ? "Açılıyor..." : "WhatsApp ile Gönder"}
      </Button>
      <p className="text-xs text-ink-400">
        Form, mesajınızı WhatsApp’ta hazırlar; göndermek için onaylamanız yeterli.
      </p>
    </form>
  );
}
