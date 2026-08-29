import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  buildCustomerCreditPdf,
  customerCreditPdfFilename,
} from "@/lib/accounting-customer-pdf";
import { getAccountingStore } from "@/lib/accounting-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }

  try {
    const store = await getAccountingStore();
    const customer = store.customers.find((item) => item.id === id);
    if (!customer) {
      return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
    }
    const entries = store.creditEntries.filter(
      (entry) => entry.customerId === customer.id,
    );
    const body = await buildCustomerCreditPdf(customer, entries);
    const filename = customerCreditPdfFilename(customer);

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
