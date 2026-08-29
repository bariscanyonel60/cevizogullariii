import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type PDFDocument from "pdfkit";
import { SITE } from "@/lib/constants";

const FONT_CANDIDATES = [
  join(process.cwd(), "src/lib/fonts/DejaVuSans.ttf"),
  join(process.cwd(), "DejaVuSans.ttf"),
];

const LOGO_CANDIDATES = [
  join(process.cwd(), "src", "lib", "fonts", "logo.png"),
  join(process.cwd(), "public", "logo.png"),
];

const LOGO_REMOTE =
  "https://res.cloudinary.com/ymm7xvz0/image/upload/f_png,q_auto,w_400/cevizogullari/logo.png";

let logoCache: Buffer | null | undefined;

export type PdfDoc = InstanceType<typeof PDFDocument>;

export function pdfFontPath() {
  const match = FONT_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!match) {
    throw new Error("Rapor yazı tipi bulunamadı");
  }
  return match;
}

export async function loadPdfLogo(): Promise<Buffer | null> {
  if (logoCache !== undefined) return logoCache;

  for (const candidate of LOGO_CANDIDATES) {
    if (existsSync(candidate)) {
      logoCache = readFileSync(candidate);
      return logoCache;
    }
  }

  try {
    const response = await fetch(LOGO_REMOTE, { cache: "no-store" });
    if (!response.ok) {
      logoCache = null;
      return null;
    }
    logoCache = Buffer.from(await response.arrayBuffer());
    return logoCache;
  } catch {
    logoCache = null;
    return null;
  }
}

export async function drawBrandHeader(
  doc: PdfDoc,
  title: string,
  subtitle?: string,
) {
  const margin = 40;
  const pageWidth = doc.page.width;
  const top = 36;
  const logo = await loadPdfLogo();
  let textX = margin;

  if (logo) {
    const boxWidth = 120;
    const boxHeight = 44;
    doc.image(logo, margin, top, {
      fit: [boxWidth, boxHeight],
      align: "left",
      valign: "center",
    });
    textX = margin + boxWidth + 14;
  }

  doc
    .fontSize(13)
    .fillColor("#295B2D")
    .text(SITE.name, textX, top + 2, {
      width: pageWidth - textX - margin,
    });
  doc
    .fontSize(8)
    .fillColor("#6B7280")
    .text(`${SITE.address}  ·  ${SITE.phone}`, textX, top + 20, {
      width: pageWidth - textX - margin,
    });

  doc.y = top + 58;
  doc
    .fontSize(16)
    .fillColor("#111827")
    .text(title, margin, doc.y, { width: pageWidth - margin * 2 });
  if (subtitle) {
    doc.moveDown(0.25);
    doc
      .fontSize(10)
      .fillColor("#374151")
      .text(subtitle, margin, doc.y, { width: pageWidth - margin * 2 });
  }
  doc.moveDown(0.6);
}
