import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PickupRequest, User as UserType } from "@/lib/types";
import { formatDate } from "@/lib/normalize";

const zoneColors: Record<string, { bg: string; text: string; border: string }> = {
  westlands: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]", border: "border-[#93C5FD]" },
  kilimani: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", border: "border-[#FCD34D]" },
  kileleshwa: { bg: "bg-[#F3E8FF]", text: "text-[#6B21A8]", border: "border-[#C4B5FD]" },
  lavington: { bg: "bg-[#ECFDF5]", text: "text-[#065F46]", border: "border-[#6EE7B7]" },
  karen: { bg: "bg-[#FFF1F2]", text: "text-[#9F1239]", border: "border-[#FDA4AF]" },
  langata: { bg: "bg-[#F0FDF4]", text: "text-[#166534]", border: "border-[#86EFAC]" },
  upper_hill: { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]", border: "border-[#FDE047]" },
  upperhill: { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]", border: "border-[#FDE047]" },
  cbd: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", border: "border-[#FCA5A5]" },
  riruta: { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]", border: "border-[#A5B4FC]" },
};

function getZoneStyle(zone: string) {
  return zoneColors[zone] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
}

function ZoneBadge({ zone, match }: { zone: string; match?: boolean }) {
  const style = getZoneStyle(zone);
  const displayName = zone
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <Badge
      variant="outline"
      className={`text-[10px] sm:text-xs gap-1 ${style.bg} ${style.text} ${style.border} ${match ? "ring-2 ring-[#1D9E75] ring-offset-1" : ""}`}
    >
      <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
      {displayName}
      {match && <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
    </Badge>
  );
}

interface AssignPickupContentProps {
  pickup: PickupRequest;
  collectors: UserType[];
  onAssign: (collectorId: number) => void;
  onCancel: () => void;
  isPending: boolean;
}

const AssignPickupContent = ({
  pickup,
  collectors,
  onAssign,
  onCancel,
  isPending,
}: AssignPickupContentProps) => {
  const [selectedCollector, setSelectedCollector] = useState<string>(
    pickup.collector?.toString() || ""
  );

  const handleAssign = () => {
    if (selectedCollector) {
      onAssign(parseInt(selectedCollector));
    }
  };

  const pickupZone = pickup.zone?.toLowerCase() || "";

  // Group collectors: matching zone first, then others
  const matchingCollectors = collectors.filter(
    (c) => c.zone && c.zone.toLowerCase() === pickupZone
  );
  const otherCollectors = collectors.filter(
    (c) => !c.zone || c.zone.toLowerCase() !== pickupZone
  );

  return (
    <div className="py-4 space-y-5">
      {/* Pickup Summary with Zone Highlight */}
      <div className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-3 sm:p-4 text-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium" style={{ color: "#0F6E56" }}>
              #{pickup.id} - {pickup.address || "No address"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {pickup.waste_type} · {formatDate(pickup.scheduled_datetime)}
            </p>
          </div>
          {pickup.zone && (
            <ZoneBadge zone={pickup.zone} />
          )}
        </div>
        {pickup.zone && matchingCollectors.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#b8e0d4] text-xs text-[#0F6E56] font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {matchingCollectors.length} collector{matchingCollectors.length !== 1 ? "s" : ""} covering this zone
          </div>
        )}
      </div>

      {/* Collector */}
      <div className="space-y-2">
        <Label>Assign to Collector</Label>
        <Select value={selectedCollector} onValueChange={setSelectedCollector}>
          <SelectTrigger className="border-[#b8e0d4] bg-white">
            <SelectValue placeholder="Select a collector" />
          </SelectTrigger>
          <SelectContent>
            {matchingCollectors.length > 0 && (
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F6E56]">
                <MapPin className="h-3 w-3 inline mr-1" />
                Zone Match - {pickup.zone?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </div>
            )}
            {matchingCollectors.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}</span>
                  {c.zone && <ZoneBadge zone={c.zone} match />}
                </div>
              </SelectItem>
            ))}
            {otherCollectors.length > 0 && (
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Other Collectors
              </div>
            )}
            {otherCollectors.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}</span>
                  {c.zone && <ZoneBadge zone={c.zone} />}
                </div>
              </SelectItem>
            ))}
            {collectors.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                No active collectors available
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Info about auto-route */}
      <div className="rounded-md bg-[#E1F5EE] border border-[#b8e0d4] px-3 py-2 text-xs text-[#444441]">
        A route will be automatically created or updated for the selected collector.
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
          onClick={handleAssign}
          disabled={isPending || !selectedCollector}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assign Pickup
        </Button>
      </div>
    </div>
  );
};

export default AssignPickupContent;
