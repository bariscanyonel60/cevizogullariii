import * as z from "zod/mini";

function text(min: number, minMessage: string, max: number, maxMessage: string) {
  return z.string().check(z.trim(), z.minLength(min, minMessage), z.maxLength(max, maxMessage));
}

const consent = z.literal(true, {
  error: "Devam etmek için KVKK bilgilendirmesini onaylayın",
});

export const contactMailSchema = z.object({
  kind: z.literal("contact"),
  name: text(2, "Ad soyad en az 2 karakter olmalı", 120, "Ad soyad çok uzun"),
  email: z.union([
    z.email("Geçerli bir e-posta girin").check(z.maxLength(254, "E-posta çok uzun")),
    z.literal(""),
  ]),
  phone: text(10, "Geçerli bir telefon girin", 32, "Telefon çok uzun"),
  subject: text(3, "Konu gerekli", 200, "Konu çok uzun"),
  message: text(10, "Mesaj en az 10 karakter olmalı", 5000, "Mesaj en fazla 5000 karakter olabilir"),
  consent,
});

const quoteTypeSchema = z.enum([
  "boya",
  "yalitim",
  "orman",
  "santiye",
  "diger",
]);

export const quoteMailSchema = z.object({
  kind: z.literal("quote"),
  name: text(2, "Ad soyad gerekli", 120, "Ad soyad çok uzun"),
  company: z.optional(
    z.string().check(z.trim(), z.maxLength(200, "Firma adı çok uzun")),
  ),
  phone: text(10, "Geçerli telefon girin", 32, "Telefon çok uzun"),
  type: quoteTypeSchema,
  details: text(10, "Detayları yazın", 5000, "Detaylar en fazla 5000 karakter olabilir"),
  consent,
});

export const mailRequestSchema = z.discriminatedUnion("kind", [
  contactMailSchema,
  quoteMailSchema,
]);

export type ContactMailValues = z.infer<typeof contactMailSchema>;
export type QuoteMailValues = z.infer<typeof quoteMailSchema>;
export type MailRequest = z.infer<typeof mailRequestSchema>;

export const QUOTE_TYPE_LABELS: Record<QuoteMailValues["type"], string> = {
  boya: "Boya / Dış Cephe",
  yalitim: "Yalıtım / Mantolama",
  orman: "Orman Ürünleri",
  santiye: "Şantiye / Toplu Malzeme",
  diger: "Diğer",
};
