import { config } from "dotenv";
import { fallbackCmsSnapshot } from "../src/lib/cms-fallback";
import {
  ensureCmsSchema,
  getCmsTableCounts,
  readCmsSnapshotFromMysql,
  replaceCmsSnapshot,
} from "../src/lib/db/cms-sql";
import { isDatabaseConfigured } from "../src/lib/db/pool";

config({ path: ".env.local" });

async function main() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_* ortam değişkenleri eksik (.env.local)");
  }

  const force = process.argv.includes("--force");
  await ensureCmsSchema();
  const counts = await getCmsTableCounts();
  const empty = Object.values(counts).every((value) => value === 0);

  if (!empty && !force) {
    const snapshot = await readCmsSnapshotFromMysql();
    console.log(
      `CMS tablolari zaten dolu (urun=${snapshot.products.length}, blog=${snapshot.posts.length}, proje=${snapshot.projects.length}). Yeniden yazmak icin --force kullanin.`,
    );
    return;
  }

  await replaceCmsSnapshot(fallbackCmsSnapshot());
  const snapshot = await readCmsSnapshotFromMysql();
  console.log(
    `CMS seed tamam: urun=${snapshot.products.length} blog=${snapshot.posts.length} proje=${snapshot.projects.length} orman=${snapshot.ormanPages.length} sss=${snapshot.faqs.length}`,
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
