import { Resend } from "resend";
import { SITE } from "@/lib/constants";
import {
  QUOTE_TYPE_LABELS,
  type MailRequest,
} from "@/lib/mail-schema";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const recentByIp = new Map<string, number[]>();

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function allowMailRequest(ip: string): boolean {
  const now = Date.now();
  const stamps = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (stamps.length >= RATE_MAX) {
    recentByIp.set(ip, stamps);
    return false;
  }
  stamps.push(now);
  recentByIp.set(ip, stamps);
  return true;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#6b7280;width:140px;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#111827;white-space:pre-wrap">${escapeHtml(value)}</td>
  </tr>`;
}

function mailEnvelope(payload: MailRequest): {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
} {
  switch (payload.kind) {
    case "contact": {
      const lines = [
        `Ad Soyad: ${payload.name}`,
        `Telefon: ${payload.phone}`,
        payload.email ? `E-posta: ${payload.email}` : null,
        `Konu: ${payload.subject}`,
        `Mesaj: ${payload.message}`,
      ].filter((line): line is string => Boolean(line));

      return {
        subject: `İletişim: ${payload.subject}`,
        text: ["Web sitesinden iletişim formu.", ...lines].join("\n"),
        html: `<div style="font-family:Georgia,serif;max-width:560px">
          <p style="color:#166534;letter-spacing:.12em;text-transform:uppercase;font-size:12px">İletişim formu</p>
          <h1 style="font-size:22px;margin:8px 0 16px">${escapeHtml(payload.subject)}</h1>
          <table style="width:100%;font-size:15px;border-collapse:collapse">
            ${row("Ad Soyad", payload.name)}
            ${row("Telefon", payload.phone)}
            ${payload.email ? row("E-posta", payload.email) : ""}
            ${row("Mesaj", payload.message)}
          </table>
        </div>`,
        replyTo: payload.email || undefined,
      };
    }
    case "quote": {
      const typeLabel = QUOTE_TYPE_LABELS[payload.type];
      const lines = [
        `Ad Soyad: ${payload.name}`,
        payload.company ? `Firma: ${payload.company}` : null,
        `Telefon: ${payload.phone}`,
        `Talep: ${typeLabel}`,
        `Detay: ${payload.details}`,
      ].filter((line): line is string => Boolean(line));

      return {
        subject: `Teklif: ${typeLabel} — ${payload.name}`,
        text: ["Web sitesinden teklif formu.", ...lines].join("\n"),
        html: `<div style="font-family:Georgia,serif;max-width:560px">
          <p style="color:#166534;letter-spacing:.12em;text-transform:uppercase;font-size:12px">Teklif formu</p>
          <h1 style="font-size:22px;margin:8px 0 16px">${escapeHtml(typeLabel)}</h1>
          <table style="width:100%;font-size:15px;border-collapse:collapse">
            ${row("Ad Soyad", payload.name)}
            ${payload.company ? row("Firma", payload.company) : ""}
            ${row("Telefon", payload.phone)}
            ${row("Detay", payload.details)}
          </table>
        </div>`,
      };
    }
    default: {
      const _exhaustive: never = payload;
      throw new Error(`Bilinmeyen mail türü: ${String(_exhaustive)}`);
    }
  }
}

export async function sendSiteMail(payload: MailRequest): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY tanımlı değil.");
  }

  const from =
    process.env.RESEND_FROM?.trim() ||
    `${SITE.shortName} <beth.t@example.com>`;
  const to = process.env.MAIL_TO?.trim() || SITE.email;
  const envelope = mailEnvelope(payload);
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: envelope.subject,
    html: envelope.html,
    text: envelope.text,
    replyTo: envelope.replyTo,
  });

  if (error || !data?.id) {
    throw new Error(error?.message || "Mail gönderilemedi.");
  }

  return { id: data.id };
}
