import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminMedia, getPublicMedia } from "@/lib/media-store";
import { isMediaCollection } from "@/lib/media-types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") ?? "";
  const raw = searchParams.get("raw") === "1";

  if (!isMediaCollection(collection)) {
    return NextResponse.json(
      { error: "collection=gallery|yapi-insaat olmalı" },
      { status: 400 },
    );
  }

  if (raw) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    const { items, isFallback } = await getAdminMedia(collection);
    return NextResponse.json(
      { collection, items, isFallback },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const { items, isFallback } = await getPublicMedia(collection);
  return NextResponse.json(
    { collection, items, isFallback },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
