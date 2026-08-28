import { config } from "dotenv";
import { fallbackCmsSnapshot } from "../src/lib/cms-fallback";
import {
  ensureCmsSchema,
  upsertBlogRow,
  upsertBrandRow,
  upsertCardRow,
  upsertFaqRow,
  upsertOrmanRow,
  upsertProductRow,
  upsertProjectRow,
  upsertShowcaseRow,
  upsertTestimonialRow,
} from "../src/lib/db/cms-sql";
import { isDatabaseConfigured } from "../src/lib/db/pool";

config({ path: ".env.local" });

async function main() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_* ortam değişkenleri eksik (.env.local)");
  }

  await ensureCmsSchema();
  const snapshot = fallbackCmsSnapshot();

  for (const product of snapshot.products) {
    await upsertProductRow(product);
  }
  for (const brand of snapshot.brands) {
    await upsertBrandRow(brand);
  }
  for (const item of snapshot.showcase) {
    await upsertShowcaseRow(item);
  }
  for (const post of snapshot.posts) {
    await upsertBlogRow(post);
  }
  for (const project of snapshot.projects) {
    await upsertProjectRow(project);
  }
  for (const page of snapshot.ormanPages) {
    await upsertOrmanRow(page);
  }
  for (const item of snapshot.testimonials) {
    await upsertTestimonialRow(item);
  }
  for (const card of snapshot.cards) {
    await upsertCardRow(card);
  }
  for (const faq of snapshot.faqs) {
    await upsertFaqRow(faq);
  }

  console.log(
    `CMS metin guncellendi: urun=${snapshot.products.length} blog=${snapshot.posts.length} proje=${snapshot.projects.length} kart=${snapshot.cards.length} sss=${snapshot.faqs.length}`,
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
