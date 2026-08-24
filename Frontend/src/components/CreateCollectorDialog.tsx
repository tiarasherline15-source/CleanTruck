import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardDialog from "@/components/ui/DashboardDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCollector } from "@/hooks/useApi";
import type { CreatedCollector } from "@/lib/types";

interface CreateCollectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const zones = [
  { value: "westlands", label: "Westlands" },
  { value: "kilimani", label: "Kilimani" },
  { value: "kileleshwa", label: "Kileleshwa" },
  { value: "lavington", label: "Lavington" },
  { value: "karen", label: "Karen" },
  { value: "langata", label: "Lang'ata" },
  { value: "upper_hill", label: "Upper Hill" },
  { value: "cbd", label: "CBD" },
  { value: "riruta", label: "Riruta" },
];

const CreateCollectorDialog = ({ open, onOpenChange }: CreateCollectorDialogProps) => {
  const createCollector = useCreateCollector();
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", phone: "", zone: "" });
  const [createdCollector, setCreatedCollector] = useState<CreatedCollector | null>(null);

  const close = () => {
    setForm({ email: "", first_name: "", last_name: "", phone: "", zone: "" });
    setCreatedCollector(null);
    onOpenChange(false);
  };

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = () => {
    createCollector.mutate(form, {
      onSuccess: (collector) => {
        setCreatedCollector(collector);
        toast.success("Collector account created.");
      },
      onError: (error: Error) => toast.error(error.message || "Unable to create collector."),
    });
  };

  return (
    <DashboardDialog open={open} onOpenChange={(nextOpen) => nextOpen ? onOpenChange(true) : close()} title={createdCollector ? "Collector created" : "Add collector"}>
      {createdCollector ? (
        <div className="space-y-4 py-4">
          <p className="text-sm">Give this temporary password to {createdCollector.email}. It will be required only for the first login.</p>
          <div className="flex items-center gap-2">
            <Input value={createdCollector.temporary_password} readOnly />
            <Button type="button" size="icon" variant="outline" aria-label="Copy temporary password" onClick={() => navigator.clipboard.writeText(createdCollector.temporary_password)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full" onClick={close}>Done</Button>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="collector-first_name">First name <span className="text-destructive">*</span></Label>
              <Input id="collector-first_name" placeholder="e.g. Riccky" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collector-last_name">Last name</Label>
              <Input id="collector-last_name" placeholder="e.g. Tom" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="collector-email">Email <span className="text-destructive">*</span></Label>
            <Input id="collector-email" type="email" placeholder="e.g. john@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="collector-phone">Phone</Label>
              <Input id="collector-phone" placeholder="e.g. +254 7XX XXX XXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collector-zone">Sector / Zone</Label>
              <Select value={form.zone} onValueChange={(value) => update("zone", value)}>
                <SelectTrigger id="collector-zone" className="border-[#b8e0d4] bg-[#F6FAFA]">
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" onClick={submit} disabled={createCollector.isPending}>
            {createCollector.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create collector
          </Button>
        </div>
      )}
    </DashboardDialog>
  );
};

export default CreateCollectorDialog;