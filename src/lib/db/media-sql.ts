import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { fromMysqlDateTime, getPool, toMysqlDateTime } from "@/lib/db/pool";
import type { MediaCollection, MediaItem } from "@/lib/media-types";

type CollectionRow = RowDataPacket & {
  collection: MediaCollection;
  managed: number;
};

type MediaRow = RowDataPacket & {
  id: string;
  collection: MediaCollection;
  url: string;
  public_id: string;
  title: string | null;
  alt: string;
  visible: number;
  sort_order: number;
  created_at: string;
};

export type MediaCollectionState = {
  managed: boolean;
  items: MediaItem[];
};

function mapItem(row: MediaRow): MediaItem {
  return {
    id: row.id,
    url: row.url,
    publicId: row.public_id,
    title: row.title || undefined,
    alt: row.alt,
    visible: row.visible !== 0,
    createdAt: fromMysqlDateTime(row.created_at),
  };
}

export async function readMediaFromMysql(
  collection: MediaCollection,
): Promise<MediaCollectionState> {
  const pool = getPool();
  const [collectionRows] = await pool.query<CollectionRow[]>(
    "SELECT collection, managed FROM media_collections WHERE collection = ?",
    [collection],
  );
  const [itemRows] = await pool.query<MediaRow[]>(
    `SELECT * FROM media_items
     WHERE collection = ?
     ORDER BY sort_order ASC, created_at DESC`,
    [collection],
  );

  return {
    managed: Boolean(collectionRows[0]?.managed) || itemRows.length > 0,
    items: itemRows.map(mapItem),
  };
}

export async function writeMediaToMysql(
  collection: MediaCollection,
  state: MediaCollectionState,
): Promise<void> {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query<ResultSetHeader>(
      `INSERT INTO media_collections (collection, managed)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE managed = VALUES(managed)`,
      [collection, state.managed ? 1 : 0],
    );
    await conn.query("DELETE FROM media_items WHERE collection = ?", [
      collection,
    ]);
    for (const [index, item] of state.items.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO media_items
          (id, collection, url, public_id, title, alt, visible, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          collection,
          item.url,
          item.publicId,
          item.title ?? null,
          item.alt,
          item.visible === false ? 0 : 1,
          index,
          toMysqlDateTime(item.createdAt),
        ],
      );
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
