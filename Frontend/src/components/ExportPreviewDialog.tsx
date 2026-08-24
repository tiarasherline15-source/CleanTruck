import { useState } from "react";
import { Download, Copy, Check, FileText, FileDown } from "lucide-react";
import { toast } from "sonner";
import DashboardDialog from "@/components/ui/DashboardDialog";
import { Button } from "@/components/ui/button";
import {
  downloadExport,
  copyToClipboard,
  FORMAT_OPTIONS,
  type ExportFormat,
} from "@/lib/exportCsv";

export interface ExportPreviewData {
  title: string;
  baseName: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
}

interface ExportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExportPreviewData | null;
}

const ExportPreviewDialog = ({ open, onOpenChange, data }: ExportPreviewDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleDownload = () => {
    const filename = downloadExport(format, data.title, data.headers, data.rows, data.baseName);
    toast.success(`Exported as ${filename}`);
    onOpenChange(false);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(data.headers, data.rows);
    if (ok) {
      setCopied(true);
      toast.success("Copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy.");
    }
  };

  const formatIcon = (f: ExportFormat) =>
    f === "csv" ? <FileText className="h-4 w-4" /> : <FileDown className="h-4 w-4" />;

  return (
    <DashboardDialog open={open} onOpenChange={onOpenChange} title={`Export: ${data.title}`}>
      <div className="py-4 space-y-4">
        {/* Format selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Export format</p>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  format === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white hover:bg-primary/5"
                }`}
              >
                {formatIcon(opt.value)}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Preview ({data.rows.length} records)</p>
          </div>
          <div className="max-h-[300px] overflow-auto rounded-lg border border-[#b8e0d4]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#F6FAFA]">
                <tr>
                  {data.headers.map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-medium text-muted-foreground border-b border-[#b8e0d4] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 px-3 whitespace-nowrap">
                        {cell === null || cell === undefined ? "-" : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.rows.length > 20 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing 20 of {data.rows.length} rows. Full data will be in the exported file.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy CSV"}
          </Button>
          <Button className="flex-1 gap-2 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download {format.toUpperCase()}
          </Button>
        </div>
      </div>
    </DashboardDialog>
  );
};

export default ExportPreviewDialog;
