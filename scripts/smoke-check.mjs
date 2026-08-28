#!/usr/bin/env node
/**
 * Hafif regresyon kontrolü — canvas’taki kritik IA / SEO / a11y düzeltmeleri.
 * Ağ veya test runner gerektirmez.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(
  !existsSync(join(root, "netlify.toml")),
  "netlify.toml kalmış — Vercel geçişi tamamlanmamış",
);
assert(existsSync(join(root, "vercel.json")), "vercel.json eksik");

const readme = read("README.md");
assert(
  readme.includes("Yapı Market & İnşaat"),
  "README marka adı güncel değil",
);
assert(readme.includes("Vercel"), "README Vercel deploy notu eksik");
assert(!readme.includes("Yapı & Gayrimenkul"), "README eski gayrimenkul markası");

const blog = read("src/data/blog.ts");
assert(!/gayrimenkul/i.test(blog), "blog.ts hâlâ gayrimenkul içeriyor");
assert(!blog.includes("unsplash"), "blog.ts Unsplash kapak kullanıyor");
assert(
  blog.includes("/projects/") || blog.includes("/products/"),
  "blog kapakları yerel path olmalı",
);

const projects = read("src/data/projects.ts");
assert(!projects.includes("wp-content"), "projects.ts WordPress upload’a bağlı");
assert(
  !projects.includes("cevizogullari.com/wp-content"),
  "projects.ts harici WP URL içeriyor",
);

const content = read("src/data/content.ts");
assert(
  /href:\s*"\/orman-urunleri"/.test(content),
  "Orman Ürünleri hizmet kartı /orman-urunleri olmalı",
);

const mega = read("src/components/organisms/layout/MegaMenu.tsx");
assert(
  mega.includes("?kategori="),
  "MegaMenu kategori deep-link’i ?kategori= kullanmalı",
);

const filters = read("src/components/organisms/shared/ProductFilters.tsx");
assert(
  filters.includes("initialCategory"),
  "ProductFilters initialCategory prop’u yok",
);
assert(
  !filters.includes('id="urunler"'),
  "ProductFilters içinde çift id=urunler kalmış",
);

const seo = read("src/lib/seo.ts");
assert(
  !/offers\s*:/.test(seo),
  "productJsonLd içinde fiyatsız offers kalmış",
);

const nextConfig = read("next.config.ts");
assert(
  !nextConfig.includes("images.unsplash.com") &&
    !nextConfig.includes("wp-content/uploads"),
  "next.config hâlâ Unsplash veya WP image host’una izin veriyor",
);

const contact = read("src/components/organisms/shared/ContactForm.tsx");
const quote = read("src/components/organisms/shared/QuoteForm.tsx");
const kvkk = read("src/app/kvkk/page.tsx");
assert(contact.includes("consent"), "ContactForm KVKK onayı eksik");
assert(quote.includes("consent"), "QuoteForm KVKK onayı eksik");
assert(
  kvkk.includes("sunucumuza kaydetmez"),
  "KVKK metni WhatsApp-only formlarla uyumsuz",
);

const layout = read("src/app/layout.tsx");
const smooth = read(
  "src/components/organisms/shared/SmoothScrollProvider.tsx",
);
assert(layout.includes("#main-content"), "Skip-link / main-content eksik");
assert(
  smooth.includes("prefers-reduced-motion"),
  "SmoothScroll reduced-motion desteği eksik",
);

assert(
  !existsSync(join(root, "src/components/organisms/home/AboutPreview.tsx")),
  "Kullanılmayan AboutPreview.tsx hâlâ duruyor",
);
assert(
  existsSync(join(root, "src/components/organisms/home/FeaturedProducts.tsx")),
  "FeaturedProducts.tsx eksik (FeaturedListings rename)",
);

const pkg = JSON.parse(read("package.json"));
assert(pkg.engines?.node, "package.json engines.node pin eksik");
assert(
  pkg.dependencies?.["@vercel/blob"],
  "@vercel/blob bağımlılığı eksik",
);
assert(
  !pkg.dependencies?.["@netlify/blobs"],
  "@netlify/blobs hâlâ bağımlılıkta",
);

assert(
  existsSync(join(root, "src/app/galeri/page.tsx")),
  "/galeri sayfası eksik",
);
const constants = read("src/lib/constants.ts");
assert(
  constants.includes('{ href: "/galeri", label: "Galeri" }'),
  "Navbar NAV_LINKS içinde Galeri bağlantısı yok",
);
assert(
  read("src/app/sitemap.ts").includes('path: "/galeri"'),
  "Sitemap /galeri içermiyor",
);

const mediaStore = read("src/lib/media-store.ts");
assert(
  mediaStore.includes("@vercel/blob"),
  "media-store Vercel Blob kullanmalı",
);
assert(
  mediaStore.includes("getAdminMedia"),
  "Admin seed görseller için getAdminMedia eksik",
);

const sitemap = read("src/app/sitemap.ts");
assert(sitemap.includes('path: "/galeri"'), "Sitemap /galeri içermiyor");
assert(
  !sitemap.includes("accounting") && !sitemap.includes("/admin"),
  "Sitemap ön muhasebe veya /admin içeriyor",
);

const navbar = read("src/lib/constants.ts");
assert(
  !navbar.toLowerCase().includes("muhasebe") &&
    !navbar.includes('href: "/admin"'),
  "Public navigasyonda admin/muhasebe görünür",
);

assert(
  existsSync(join(root, "src/lib/accounting-store.ts")),
  "Ön muhasebe store eksik",
);
assert(
  read("src/lib/accounting-store.ts").includes('access: "private"'),
  "Muhasebe store private Blob kullanmalı",
);
assert(
  existsSync(join(root, "src/app/api/admin/accounting/route.ts")),
  "Admin muhasebe API eksik",
);
assert(
  read("src/components/organisms/layout/SiteShell.tsx").includes(
    'pathname.startsWith("/admin")',
  ),
  "SiteShell admin’de public chrome gizlemeli",
);

assert(
  existsSync(join(root, "src/app/api/admin/accounting/report/route.ts")),
  "Aylık rapor API eksik",
);
assert(
  existsSync(join(root, "src/lib/fonts/DejaVuSans.ttf")),
  "PDF Türkçe fontu eksik",
);
assert(
  read("src/components/organisms/admin/AccountingDashboard.tsx").includes(
    "Aylık rapor",
  ),
  "Admin muhasebe sekmesinde aylık rapor yok",
);

if (failures.length) {
  console.error("Smoke check FAILED:\n");
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log(`Smoke check OK (${14} kontrol grubu geçti)`);
