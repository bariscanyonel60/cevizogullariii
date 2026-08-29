import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import PDFDocument from "pdfkit";
import { SITE } from "@/lib/constants";

const FONTS_DIR = join(process.cwd(), "src/lib/fonts");
const FONT_FILE = join(FONTS_DIR, "DejaVuSans.ttf");
const LOGO_FILE = join(FONTS_DIR, "logo.png");

const LOGO_REMOTE =
  "https://res.cloudinary.com/ymm7xvz0/image/upload/f_png,q_auto,w_400/cevizogullari/logo.png";

let logoCache: Buffer | null | undefined;

export type PdfDoc = InstanceType<typeof PDFDocument>;

export const PDF_MARGIN = 40;
export const PDF_CONTINUATION_Y = 56;

export function pdfFontPath() {
  if (!existsSync(/*turbopackIgnore: true*/ FONT_FILE)) {
    throw new Error("Rapor yazı tipi bulunamadı");
  }
  return FONT_FILE;
}

export async function loadPdfLogo(): Promise<Buffer | null> {
  if (logoCache !== undefined) return logoCache;

  if (existsSync(/*turbopackIgnore: true*/ LOGO_FILE)) {
    logoCache = readFileSync(/*turbopackIgnore: true*/ LOGO_FILE);
    return logoCache;
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

function drawContinuationHeader(doc: PdfDoc, logo: Buffer | null) {
  doc.font(pdfFontPath());
  const margin = PDF_MARGIN;
  const top = 14;
  let textX = margin;
  if (logo) {
    doc.image(logo, margin, top, {
      fit: [72, 28],
      valign: "center",
    });
    textX = margin + 84;
  }
  doc
    .fontSize(9)
    .fillColor("#295B2D")
    .text(SITE.shortName, textX, top + 8, {
      width: doc.page.width - textX - margin,
      lineBreak: false,
    });
  doc.y = PDF_CONTINUATION_Y;
}

export async function createBrandedPdf(options: {
  title: string;
  subtitle?: string;
  layout?: "portrait" | "landscape";
  infoTitle: string;
}): Promise<{ doc: PdfDoc; done: Promise<Buffer> }> {
  const font = pdfFontPath();
  const logo = await loadPdfLogo();
  const doc = new PDFDocument({
    size: "A4",
    layout: options.layout ?? "portrait",
    margin: PDF_MARGIN,
    info: {
      Title: options.infoTitle,
      Author: SITE.name,
    },
  });
  doc.font(font);

  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.on("pageAdded", () => {
    drawContinuationHeader(doc, logo);
  });

  await drawBrandHeader(doc, options.title, options.subtitle);
  return { doc, done };
}
