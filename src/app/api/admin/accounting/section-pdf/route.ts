import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { buildAccountingSectionPdf } from "@/lib/accounting-section-pdf";
import { getAccountingStore } from "@/lib/accounting-store";
import {
  isAccountingPdfKind,
  isIsoDate,
  isYearMonth,
} from "@/lib/accounting-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind")?.trim() ?? "";
  if (!isAccountingPdfKind(kind)) {
    return NextResponse.json({ error: "PDF türü geçersiz" }, { status: 400 });
  }

  const date = searchParams.get("date")?.trim() ?? "";
  const month = searchParams.get("month")?.trim() ?? "";

  switch (kind) {
    case "sales":
    case "expenses": {
      if (!isIsoDate(date)) {
        return NextResponse.json({ error: "date=YYYY-MM-DD gerekli" }, { status: 400 });
      }
      break;
    }
    case "staff": {
      if (!isYearMonth(month)) {
        return NextResponse.json({ error: "month=YYYY-MM gerekli" }, { status: 400 });
      }
      break;
    }
    case "summary":
    case "customers":
      break;
    default: {
      const _exhaustive: never = kind;
      return NextResponse.json({ error: _exhaustive }, { status: 400 });
    }
  }

  try {
    const store = await getAccountingStore();
    const { body, filename } = await buildAccountingSectionPdf(store, kind, {
      date: date || undefined,
      month: month || undefined,
    });
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF oluşturulamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
