import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { buildMonthlyReport, reportFilename } from "@/lib/accounting-report";
import { buildMonthlyPdf } from "@/lib/accounting-report-pdf";
import { buildMonthlyExcel } from "@/lib/accounting-report-xlsx";
import { getAccountingStore } from "@/lib/accounting-store";
import { isReportFormat, isYearMonth } from "@/lib/accounting-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentType(format: "xlsx" | "pdf") {
  switch (format) {
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "pdf":
      return "application/pdf";
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month")?.trim() ?? "";
  const format = searchParams.get("format")?.trim() ?? "";

  if (!isYearMonth(month) || !isReportFormat(format)) {
    return NextResponse.json(
      { error: "month=YYYY-MM ve format=xlsx|pdf gerekli" },
      { status: 400 },
    );
  }

  try {
    const store = await getAccountingStore();
    const report = buildMonthlyReport(store, month);
    const filename = reportFilename(month, format);

    let body: Buffer;
    switch (format) {
      case "xlsx":
        body = await buildMonthlyExcel(report);
        break;
      case "pdf":
        body = await buildMonthlyPdf(report);
        break;
      default: {
        const _exhaustive: never = format;
        return _exhaustive;
      }
    }

    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": contentType(format),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rapor oluşturulamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
