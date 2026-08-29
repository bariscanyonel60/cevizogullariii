import { PDF_CONTINUATION_Y, PDF_MARGIN, type PdfDoc } from "@/lib/pdf-brand";

export function drawPdfSummaryRows(
  doc: PdfDoc,
  rows: [string, string][],
) {
  const pageWidth = doc.page.width;
  let y = doc.y;
  rows.forEach((item) => {
    if (y + 18 > doc.page.height - 40) {
      doc.addPage();
      y = PDF_CONTINUATION_Y;
    }
    doc.fontSize(10).fillColor("#374151").text(item[0], PDF_MARGIN, y, {
      width: 280,
    });
    doc.fillColor("#111827").text(item[1], 320, y, {
      width: pageWidth - 360,
      align: "right",
    });
    y += 16;
  });
  doc.y = y + 8;
}

export function drawPdfTable(
  doc: PdfDoc,
  title: string,
  headers: string[],
  rows: string[][],
  widths: number[],
) {
  const pageWidth = doc.page.width;
  const margin = PDF_MARGIN;
  let y = doc.y + 8;

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.page.height - 40) {
      doc.addPage();
      y = PDF_CONTINUATION_Y;
    }
  };

  ensureSpace(36);
  doc.fontSize(13).fillColor("#295B2D").text(title, margin, y);
  y = doc.y + 8;

  const drawHeader = () => {
    ensureSpace(22);
    doc.rect(margin, y, pageWidth - margin * 2, 20).fill("#295B2D");
    doc.fillColor("#ffffff").fontSize(8);
    let x = margin + 4;
    headers.forEach((header, index) => {
      doc.text(header, x, y + 5, {
        width: widths[index] - 6,
        lineBreak: false,
      });
      x += widths[index];
    });
    y += 22;
  };

  drawHeader();

  if (rows.length === 0) {
    doc
      .fillColor("#6B7280")
      .fontSize(9)
      .text("Bu dönemde kayıt yok.", margin, y);
    doc.moveDown();
    return;
  }

  rows.forEach((row, rowIndex) => {
    ensureSpace(18);
    if (y === PDF_CONTINUATION_Y && rowIndex > 0) drawHeader();
    if (rowIndex % 2 === 0) {
      doc.rect(margin, y - 2, pageWidth - margin * 2, 16).fill("#F3F8F3");
    }
    doc.fillColor("#111827").fontSize(8);
    let x = margin + 4;
    row.forEach((cell, index) => {
      doc.text(cell, x, y, {
        width: widths[index] - 6,
        lineBreak: false,
        ellipsis: true,
      });
      x += widths[index];
    });
    y += 16;
  });

  doc.y = y + 12;
}

export function drawPdfFooter(doc: PdfDoc, note: string) {
  doc
    .fontSize(8)
    .fillColor("#6B7280")
    .text(note, PDF_MARGIN, doc.page.height - 30, {
      width: doc.page.width - PDF_MARGIN * 2,
    });
}
