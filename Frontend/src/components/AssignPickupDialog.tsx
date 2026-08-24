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
import { Loader2 } from "lucide-react";
import type { PickupRequest, User, Route } from "@/lib/types";
import { formatDate } from "@/lib/normalize";

interface AssignPickupContentProps {
  pickup: PickupRequest;
  collectors: User[];
  routes: Route[];
  onAssign: (collectorId: number, routeId: number | null) => void;
  onCancel: () => void;
  isPending: boolean;
}

const AssignPickupContent = ({
  pickup,
  collectors,
  routes,
  onAssign,
  onCancel,
  isPending,
}: AssignPickupContentProps) => {
  const [selectedCollector, setSelectedCollector] = useState<string>(
    pickup.collector?.toString() || ""
  );
  const [selectedRoute, setSelectedRoute] = useState<string>(
    pickup.route?.toString() || ""
  );

  const handleAssign = () => {
    onAssign(
      selectedCollector ? parseInt(selectedCollector) : 0,
      selectedRoute ? parseInt(selectedRoute) : null
    );
  };

  return (
    <div className="py-4 space-y-5">
      {/* Pickup Summary */}
      <div className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-3 text-sm">
        <p className="font-medium" style={{ color: "#0F6E56" }}>
          #{pickup.id} - {pickup.address || "No address"}
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          {pickup.waste_type} · {pickup.zone || "No zone"} · {formatDate(pickup.scheduled_datetime)}
        </p>
      </div>

      {/* Collector */}
      <div className="space-y-2">
        <Label>Assign to Collector</Label>
        <Select value={selectedCollector} onValueChange={setSelectedCollector}>
          <SelectTrigger className="border-[#b8e0d4] bg-white">
            <SelectValue placeholder="Select a collector" />
          </SelectTrigger>
          <SelectContent>
            {collectors.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}
                {c.zone ? ` (${c.zone})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Route */}
      <div className="space-y-2">
        <Label>Assign to Route (optional)</Label>
        <Select value={selectedRoute} onValueChange={setSelectedRoute}>
          <SelectTrigger className="border-[#b8e0d4] bg-white">
            <SelectValue placeholder="Select a route" />
          </SelectTrigger>
          <SelectContent>
            {routes.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.name} ({r.status})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
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
