import { NextResponse } from "next/server";
import { allowMailRequest, mailConfigured, sendSiteMail } from "@/lib/mail";
import { mailRequestSchema } from "@/lib/mail-schema";

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  if (!mailConfigured()) {
    return NextResponse.json(
      { error: "E-posta gönderimi henüz yapılandırılmadı." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  if (!allowMailRequest(ip)) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = mailRequestSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Form bilgileri eksik.";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  try {
    const result = await sendSiteMail(parsed.data);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Mail gönderilemedi.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
