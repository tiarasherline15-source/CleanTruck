import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Download a string as a file in the browser.
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert an array of objects to a CSV string.
 */
export function toCSV(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escape = (val: string | number | null | undefined) => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escape).join(",");
  const dataLines = rows.map((row) => row.map(escape).join(","));
  return [headerLine, ...dataLines].join("\n");
}

/**
 * Generate a PDF with a title and auto-formatted table.
 */
export function toPDF(
  title: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
  filename: string
) {
  const doc = new jsPDF({ orientation: headers.length > 6 ? "landscape" : "portrait" });

  // Title
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Subtitle with date
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, 28);
  doc.text(`${rows.length} records`, 14, 34);

  // Table
  const bodyRows = rows.map((row) =>
    row.map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
  );

  autoTable(doc, {
    startY: 40,
    head: [headers],
    body: bodyRows,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [15, 110, 86] }, // #0F6E56
    alternateRowStyles: { fillColor: [241, 250, 248] }, // #F6FAFA
    margin: { left: 14, right: 14 },
  });

  doc.save(filename);
}

export type ExportFormat = "csv" | "pdf";

export const FORMAT_OPTIONS: { value: ExportFormat; label: string; ext: string }[] = [
  { value: "csv", label: "CSV (Spreadsheet)", ext: "csv" },
  { value: "pdf", label: "PDF (Document)", ext: "pdf" },
];

export function downloadExport(
  format: ExportFormat,
  title: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
  baseName: string
) {
  const date = new Date().toISOString().slice(0, 10);
  const filename = `${baseName}-${date}`;

  if (format === "pdf") {
    toPDF(title, headers, rows, `${filename}.pdf`);
    return `${filename}.pdf`;
  }

  const content = toCSV(headers, rows);
  downloadFile(content, `${filename}.csv`, "text/csv;charset=utf-8;");
  return `${filename}.csv`;
}

export async function copyToClipboard(
  headers: string[],
  rows: (string | number | null | undefined)[][]
): Promise<boolean> {
  const content = toCSV(headers, rows);
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}
