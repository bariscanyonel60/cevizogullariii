import { config } from "dotenv";
import { YAPI_INSAAT_MEDIA } from "../src/data/yapi-insaat-media";
import { writeMediaToMysql } from "../src/lib/db/media-sql";
import { isDatabaseConfigured } from "../src/lib/db/pool";

config({ path: ".env.local" });

async function main() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_* ortam değişkenleri eksik (.env.local)");
  }

  await writeMediaToMysql("yapi-insaat", {
    managed: true,
    items: YAPI_INSAAT_MEDIA,
  });

  console.log(
    `Yapi-insaat galeri MySQL'e yazildi: ${YAPI_INSAAT_MEDIA.length} kare`,
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
