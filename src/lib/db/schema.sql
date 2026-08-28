-- Cevizoğulları Hostinger MySQL şeması (u979100795_ceviz)
-- Muhasebe + galeri/medya. Mevcut TypeScript modelleriyle birebir.

CREATE TABLE IF NOT EXISTS staff (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  INDEX idx_staff_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sales (
  id CHAR(36) NOT NULL PRIMARY KEY,
  date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(12, 3) NOT NULL,
  unit_price DECIMAL(12, 3) NOT NULL,
  vat_rate TINYINT NOT NULL,
  payment_method ENUM('nakit', 'kart') NOT NULL,
  note TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  INDEX idx_sales_date (date),
  INDEX idx_sales_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS advances (
  id CHAR(36) NOT NULL PRIMARY KEY,
  staff_id CHAR(36) NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(12, 3) NOT NULL,
  note TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  CONSTRAINT fk_advances_staff FOREIGN KEY (staff_id) REFERENCES staff (id),
  INDEX idx_advances_staff (staff_id),
  INDEX idx_advances_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
  id CHAR(36) NOT NULL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  tc CHAR(11) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  UNIQUE KEY uq_customers_tc (tc),
  INDEX idx_customers_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS credit_entries (
  id CHAR(36) NOT NULL PRIMARY KEY,
  customer_id CHAR(36) NOT NULL,
  kind ENUM('purchase', 'payment') NOT NULL,
  date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL DEFAULT '',
  amount DECIMAL(12, 3) NOT NULL,
  vat_rate TINYINT NULL,
  payment_method ENUM('nakit', 'kart') NULL,
  note TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  CONSTRAINT fk_credit_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
  INDEX idx_credit_customer (customer_id),
  INDEX idx_credit_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_collections (
  collection ENUM('gallery', 'yapi-insaat') NOT NULL PRIMARY KEY,
  managed TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  collection ENUM('gallery', 'yapi-insaat') NOT NULL,
  url TEXT NOT NULL,
  public_id VARCHAR(512) NOT NULL,
  title VARCHAR(255) NULL,
  alt VARCHAR(512) NOT NULL,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL,
  INDEX idx_media_collection (collection, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CMS: ürün, blog, proje, orman sayfaları, anasayfa blokları, SSS
CREATE TABLE IF NOT EXISTS cms_products (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  brand VARCHAR(128) NOT NULL,
  unit VARCHAR(64) NOT NULL,
  image TEXT NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  use_cases JSON NOT NULL,
  specs JSON NOT NULL,
  catalog_pdf VARCHAR(512) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_cms_products_slug (slug),
  INDEX idx_cms_products_category (category),
  INDEX idx_cms_products_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_brands (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  blurb VARCHAR(512) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_category_showcase (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  category_key VARCHAR(32) NOT NULL,
  label VARCHAR(128) NOT NULL,
  description VARCHAR(512) NOT NULL,
  image TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_cms_showcase_key (category_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_exterior_package (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  items JSON NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_blog_posts (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content MEDIUMTEXT NOT NULL,
  category VARCHAR(128) NOT NULL,
  tags JSON NOT NULL,
  cover_image TEXT NOT NULL,
  author VARCHAR(128) NOT NULL,
  published_at DATE NOT NULL,
  reading_time INT NOT NULL DEFAULT 1,
  UNIQUE KEY uq_cms_blog_slug (slug),
  INDEX idx_cms_blog_published (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_projects (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  location VARCHAR(255) NOT NULL,
  year SMALLINT NOT NULL,
  images JSON NOT NULL,
  before_image TEXT NULL,
  after_image TEXT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  instagram_url TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_cms_projects_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_orman_pages (
  slug VARCHAR(64) NOT NULL PRIMARY KEY,
  href VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  nav_label VARCHAR(128) NOT NULL,
  eyebrow VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  meta_title VARCHAR(255) NOT NULL,
  meta_description TEXT NOT NULL,
  keywords JSON NOT NULL,
  image TEXT NOT NULL,
  highlights JSON NOT NULL,
  body JSON NOT NULL,
  related_slugs JSON NOT NULL,
  related_categories JSON NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_stats (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  value INT NOT NULL,
  suffix VARCHAR(16) NOT NULL,
  label VARCHAR(128) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_testimonials (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  role VARCHAR(128) NOT NULL,
  quote TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_site_cards (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  kind ENUM('why_us', 'services', 'process', 'audience') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  href VARCHAR(255) NULL,
  step VARCHAR(16) NULL,
  points JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_cms_cards_kind (kind, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_faqs (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  page ENUM('home', 'tokat') NOT NULL,
  question VARCHAR(512) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_cms_faqs_page (page, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
