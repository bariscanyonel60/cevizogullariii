/**
 * public/ altındaki görselleri Cloudinary’ye yedekler.
 *
 * Kullanım:
 *   npm run media:backup
 *
 * Gereksinim: .env.local içinde CLOUDINARY_* değerleri
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

loadEnv({ path: join(root, ".env.local") });
loadEnv({ path: join(root, ".env") });

const FOLDER = "cevizogullari";
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function configure() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (process.env.CLOUDINARY_URL) {
    // SDK CLOUDINARY_URL’yi okur; açık alanlar da set edilebilir
    cloudinary.config({ secure: true });
  }

  if (!cloudinary.config().cloud_name) {
    if (!cloud_name || !api_key || !api_secret) {
      console.error(
        "Eksik env. .env.local içine CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET ekleyin.",
      );
      process.exit(1);
    }
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  }
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function uploadOne(filePath, publicRoot) {
  const rel = relative(publicRoot, filePath).split("\\").join("/");
  const publicId = `${FOLDER}/${rel.replace(/\.[^.]+$/, "")}`;

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    folder: undefined,
  });

  return {
    local: `/${rel}`,
    publicId: result.public_id,
    url: result.secure_url,
    bytes: result.bytes,
  };
}

async function main() {
  configure();

  const publicRoot = join(root, "public");
  if (!existsSync(publicRoot)) {
    console.error("public/ bulunamadı");
    process.exit(1);
  }

  const files = walk(publicRoot);
  console.log(`${files.length} görsel yedeklenecek → cloud: ${cloudinary.config().cloud_name}`);

  const manifest = [];
  let ok = 0;
  let fail = 0;

  for (const file of files) {
    const name = basename(file);
    try {
      const entry = await uploadOne(file, publicRoot);
      manifest.push(entry);
      ok += 1;
      console.log(`✓ ${entry.local} → ${entry.publicId}`);
    } catch (err) {
      fail += 1;
      console.error(`✗ ${name}:`, err instanceof Error ? err.message : err);
    }
  }

  const outDir = join(root, "src/data");
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "cloudinary-backup.json");
  writeFileSync(
    outFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        cloudName: cloudinary.config().cloud_name,
        folder: FOLDER,
        count: manifest.length,
        assets: manifest,
      },
      null,
      2,
    ),
  );

  console.log(`\nTamam: ${ok} ok, ${fail} fail → ${relative(root, outFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
