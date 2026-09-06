import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { list, put } from "@vercel/blob";
import { readMediaFromMysql, writeMediaToMysql } from "@/lib/db/media-sql";
import {
  isDatabaseConfigured,
  isDatabaseReachable,
  markDatabaseUnreachable,
} from "@/lib/db/pool";
import {
  MEDIA_FALLBACKS,
  type MediaCollection,
  type MediaItem,
} from "@/lib/media-types";

const LOCAL_DIR = join(process.cwd(), ".data");
const LOCAL_FILE = join(LOCAL_DIR, "media-store.json");

type MediaCollectionState = {
  /** Admin en az bir kez kaydettiyse true — boş liste fallback’e dönmez */
  managed: boolean;
  items: MediaItem[];
};

type LocalStore = Partial<Record<MediaCollection, MediaCollectionState | MediaItem[]>>;

function blobPath(collection: MediaCollection) {
  return `media/${collection}.json`;
}

function normalizeItems(items: MediaItem[]): MediaItem[] {
  return items.map((item) => ({
    ...item,
    visible: item.visible !== false,
  }));
}

function cloneFallbacks(collection: MediaCollection): MediaItem[] {
  return MEDIA_FALLBACKS[collection].map((item) => ({ ...item }));
}

function parseCollectionState(data: unknown): MediaCollectionState {
  if (Array.isArray(data)) {
    return {
      managed: data.length > 0,
      items: normalizeItems(data as MediaItem[]),
    };
  }

  if (data && typeof data === "object") {
    const record = data as { managed?: unknown; items?: unknown };
    const items = Array.isArray(record.items)
      ? normalizeItems(record.items as MediaItem[])
      : [];
    return {
      managed: Boolean(record.managed) || items.length > 0,
      items,
    };
  }

  return { managed: false, items: [] };
}

function readLocal(): LocalStore {
  try {
    if (!existsSync(LOCAL_FILE)) return {};
    return JSON.parse(readFileSync(LOCAL_FILE, "utf8")) as LocalStore;
  } catch {
    return {};
  }
}

function writeLocal(data: LocalStore) {
  mkdirSync(LOCAL_DIR, { recursive: true });
  writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
}

function blobAvailable() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromBlob(
  collection: MediaCollection,
): Promise<MediaCollectionState | null> {
  if (!blobAvailable()) return null;
  try {
    const pathname = blobPath(collection);
    const { blobs } = await list({ prefix: pathname, limit: 10 });
    const match = blobs.find((blob) => blob.pathname === pathname);
    if (!match) return { managed: false, items: [] };

    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return { managed: false, items: [] };
    return parseCollectionState(await response.json());
  } catch {
    return null;
  }
}

async function writeToBlob(
  collection: MediaCollection,
  state: MediaCollectionState,
) {
  if (!blobAvailable()) return false;
  try {
    await put(blobPath(collection), JSON.stringify(state), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return true;
  } catch {
    return false;
  }
}

async function getCollectionState(
  collection: MediaCollection,
): Promise<MediaCollectionState> {
  if (isDatabaseConfigured() && isDatabaseReachable()) {
    try {
      return await readMediaFromMysql(collection);
    } catch (error) {
      markDatabaseUnreachable();
      console.error("[media] MySQL okunamadı, yerel/blob yedek kullanılıyor", error);
    }
  }
  const fromBlob = await readFromBlob(collection);
  if (fromBlob !== null) return fromBlob;

  const local = readLocal()[collection];
  if (!local) return { managed: false, items: [] };
  return parseCollectionState(local);
}

async function saveCollectionState(
  collection: MediaCollection,
  state: MediaCollectionState,
): Promise<void> {
  const next = {
    managed: true,
    items: normalizeItems(state.items),
  };
  if (isDatabaseConfigured()) {
    await writeMediaToMysql(collection, next);
    return;
  }
  const written = await writeToBlob(collection, next);
  if (!written) {
    const local = readLocal();
    local[collection] = next;
    writeLocal(local);
  }
}

/** Düzenlenebilir liste: kayıt yoksa sitedeki varsayılan (seed) görseller */
async function getEditableMedia(
  collection: MediaCollection,
): Promise<{ items: MediaItem[]; isFallback: boolean }> {
  const state = await getCollectionState(collection);
  if (state.managed) {
    return { items: state.items, isFallback: false };
  }
  if (state.items.length > 0) {
    return { items: state.items, isFallback: false };
  }
  return { items: cloneFallbacks(collection), isFallback: true };
}

/** Ham kayıtlı liste */
export async function getStoredMedia(
  collection: MediaCollection,
): Promise<MediaItem[]> {
  const state = await getCollectionState(collection);
  return state.items;
}

/** Admin paneli — sitede görünen görseller (seed dahil) */
export async function getAdminMedia(
  collection: MediaCollection,
): Promise<{ items: MediaItem[]; isFallback: boolean }> {
  return getEditableMedia(collection);
}

/** Public sayfalar — yönetilmemiş boş koleksiyonda seed fallback */
export async function getPublicMedia(
  collection: MediaCollection,
): Promise<{ items: MediaItem[]; isFallback: boolean }> {
  const state = await getCollectionState(collection);

  if (!state.managed && state.items.length === 0) {
    return { items: MEDIA_FALLBACKS[collection], isFallback: true };
  }

  return {
    items: state.items.filter((item) => item.visible !== false),
    isFallback: false,
  };
}

export async function saveMedia(
  collection: MediaCollection,
  items: MediaItem[],
): Promise<void> {
  await saveCollectionState(collection, { managed: true, items });
}

export async function appendMedia(
  collection: MediaCollection,
  item: MediaItem,
): Promise<MediaItem[]> {
  const { items } = await getEditableMedia(collection);
  const next = [item, ...items];
  await saveMedia(collection, next);
  return next;
}

export async function removeMedia(
  collection: MediaCollection,
  id: string,
): Promise<{ items: MediaItem[]; removed: MediaItem | null }> {
  const { items: current } = await getEditableMedia(collection);
  const removed = current.find((item) => item.id === id) ?? null;
  const items = current.filter((item) => item.id !== id);
  if (removed) await saveMedia(collection, items);
  return { items, removed };
}

export async function updateMedia(
  collection: MediaCollection,
  id: string,
  updates: Pick<MediaItem, "alt" | "title" | "visible">,
): Promise<{ items: MediaItem[]; updated: MediaItem | null }> {
  const { items: current } = await getEditableMedia(collection);
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return { items: current, updated: null };

  const updated = {
    ...current[index],
    ...updates,
  };
  const items = [...current];
  items[index] = updated;
  await saveMedia(collection, items);
  return { items, updated };
}

export async function moveMedia(
  collection: MediaCollection,
  id: string,
  direction: "up" | "down",
): Promise<{ items: MediaItem[]; moved: boolean }> {
  const { items } = await getEditableMedia(collection);
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || target < 0 || target >= items.length) {
    return { items, moved: false };
  }

  [items[index], items[target]] = [items[target], items[index]];
  await saveMedia(collection, items);
  return { items, moved: true };
}
