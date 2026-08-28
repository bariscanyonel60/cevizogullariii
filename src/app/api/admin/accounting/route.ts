import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createAdvance,
  createCreditEntry,
  createCustomer,
  createSale,
  createStaff,
  deleteAdvance,
  deleteCreditEntry,
  deleteCustomer,
  deleteSale,
  deleteStaff,
  getAccountingStore,
  updateCustomer,
} from "@/lib/accounting-store";
import { isAccountingEntity } from "@/lib/accounting-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return null;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "İşlem başarısız";
  const status =
    message === "Yetkisiz"
      ? 401
      : message.includes("bulunamadı")
        ? 404
        : 400;
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const store = await getAccountingStore();
    return NextResponse.json({ ok: true, store });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { entity?: string } & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!isAccountingEntity(body.entity)) {
    return NextResponse.json({ error: "Geçersiz kayıt türü" }, { status: 400 });
  }

  try {
    switch (body.entity) {
      case "sale":
        return NextResponse.json({
          ok: true,
          store: await createSale(body),
        });
      case "staff":
        return NextResponse.json({
          ok: true,
          store: await createStaff(body),
        });
      case "advance":
        return NextResponse.json({
          ok: true,
          store: await createAdvance(body),
        });
      case "customer":
        return NextResponse.json({
          ok: true,
          store: await createCustomer(body),
        });
      case "credit":
        return NextResponse.json({
          ok: true,
          store: await createCreditEntry(body),
        });
      default: {
        const _exhaustive: never = body.entity;
        return _exhaustive;
      }
    }
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { entity?: string; id?: string } & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const id = body.id?.trim() ?? "";
  if (!id || body.entity !== "customer") {
    return NextResponse.json(
      { error: "Yalnızca müşteri kartı güncellenebilir" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({
      ok: true,
      store: await updateCustomer(id, body),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity") ?? "";
  const id = searchParams.get("id")?.trim() ?? "";
  if (!isAccountingEntity(entity) || !id) {
    return NextResponse.json(
      { error: "entity ve id gerekli" },
      { status: 400 },
    );
  }

  try {
    switch (entity) {
      case "sale":
        return NextResponse.json({ ok: true, store: await deleteSale(id) });
      case "staff":
        return NextResponse.json({ ok: true, store: await deleteStaff(id) });
      case "advance":
        return NextResponse.json({
          ok: true,
          store: await deleteAdvance(id),
        });
      case "customer":
        return NextResponse.json({
          ok: true,
          store: await deleteCustomer(id),
        });
      case "credit":
        return NextResponse.json({
          ok: true,
          store: await deleteCreditEntry(id),
        });
      default: {
        const _exhaustive: never = entity;
        return _exhaustive;
      }
    }
  } catch (error) {
    return errorResponse(error);
  }
}
