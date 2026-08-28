import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  parseBlog,
  parseBrand,
  parseCard,
  parseExterior,
  parseFaq,
  parseOrman,
  parseProduct,
  parseProject,
  parseShowcase,
  parseStat,
  parseTestimonial,
} from "@/lib/cms-parse";
import {
  deleteCmsEntity,
  getCmsSnapshot,
  newCmsId,
  saveCmsEntity,
} from "@/lib/cms-store";
import { isCmsEntity, type CmsEntity } from "@/lib/cms-types";

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
        : message.includes("yapılandırılmamış")
          ? 503
          : 400;
  return NextResponse.json({ error: message }, { status });
}

function revalidateCms() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/yapi-malzemeleri");
  revalidatePath("/yapi-malzemeleri/[slug]", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/projelerimiz");
  revalidatePath("/projelerimiz/[slug]", "page");
  revalidatePath("/orman-urunleri");
  revalidatePath("/orman-urunleri/[slug]", "page");
  revalidatePath("/tokat");
  revalidatePath("/kurumsal");
  revalidatePath("/yapi-insaat");
  revalidatePath("/sitemap.xml");
}

function recordId(entity: CmsEntity, body: Record<string, unknown>, existing?: string) {
  if (entity === "orman") {
    return String(body.slug ?? existing ?? "").trim();
  }
  return String(body.id ?? existing ?? newCmsId()).trim() || newCmsId();
}

function parseRecord(entity: CmsEntity, body: Record<string, unknown>, id: string) {
  switch (entity) {
    case "product":
      return parseProduct(body, id);
    case "brand":
      return parseBrand(body, id);
    case "showcase":
      return parseShowcase(body, id);
    case "exterior":
      return parseExterior(body, id);
    case "blog":
      return parseBlog(body, id);
    case "project":
      return parseProject(body, id);
    case "orman":
      return parseOrman({ ...body, slug: id || body.slug });
    case "stat":
      return parseStat(body, id);
    case "testimonial":
      return parseTestimonial(body, id);
    case "card":
      return parseCard(body, id);
    case "faq":
      return parseFaq(body, id);
    default: {
      const neverEntity: never = entity;
      throw new Error(`Bilinmeyen kayıt türü: ${String(neverEntity)}`);
    }
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const snapshot = await getCmsSnapshot();
    return NextResponse.json({ ok: true, snapshot });
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
  if (!isCmsEntity(body.entity ?? "")) {
    return NextResponse.json({ error: "Geçersiz kayıt türü" }, { status: 400 });
  }
  try {
    const entity = body.entity as CmsEntity;
    const id = recordId(entity, body);
    if (!id) {
      return NextResponse.json({ error: "Kimlik gerekli" }, { status: 400 });
    }
    const snapshot = await saveCmsEntity(entity, parseRecord(entity, body, id));
    revalidateCms();
    return NextResponse.json({ ok: true, snapshot });
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
  if (!isCmsEntity(body.entity ?? "")) {
    return NextResponse.json({ error: "Geçersiz kayıt türü" }, { status: 400 });
  }
  try {
    const entity = body.entity as CmsEntity;
    const id = recordId(entity, body, body.id);
    if (!id) {
      return NextResponse.json({ error: "Kimlik gerekli" }, { status: 400 });
    }
    const snapshot = await saveCmsEntity(entity, parseRecord(entity, body, id));
    revalidateCms();
    return NextResponse.json({ ok: true, snapshot });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity") ?? "";
  const id = searchParams.get("id") ?? "";
  if (!isCmsEntity(entity) || !id) {
    return NextResponse.json({ error: "entity ve id gerekli" }, { status: 400 });
  }
  try {
    const snapshot = await deleteCmsEntity(entity, id);
    revalidateCms();
    return NextResponse.json({ ok: true, snapshot });
  } catch (error) {
    return errorResponse(error);
  }
}
