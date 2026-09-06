import { z } from "zod";

export const contactMailSchema = z.object({
  kind: z.literal("contact"),
  name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.union([z.email("Geçerli bir e-posta girin"), z.literal("")]),
  phone: z.string().trim().min(10, "Geçerli bir telefon girin"),
  subject: z.string().trim().min(3, "Konu gerekli"),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı"),
  consent: z.literal(true, {
    error: "Devam etmek için KVKK bilgilendirmesini onaylayın",
  }),
});

export const quoteTypeSchema = z.enum([
  "boya",
  "yalitim",
  "orman",
  "santiye",
  "diger",
]);

export const quoteMailSchema = z.object({
  kind: z.literal("quote"),
  name: z.string().trim().min(2, "Ad soyad gerekli"),
  company: z.string().trim().optional(),
  phone: z.string().trim().min(10, "Geçerli telefon girin"),
  type: quoteTypeSchema,
  details: z.string().trim().min(10, "Detayları yazın"),
  consent: z.literal(true, {
    error: "Devam etmek için KVKK bilgilendirmesini onaylayın",
  }),
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
