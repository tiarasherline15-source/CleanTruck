import DashboardDialog from "@/components/ui/DashboardDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import type { User as UserType } from "@/lib/types";
import { formatDate } from "@/lib/normalize";

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-destructive/10 text-destructive border-destructive/20" },
  collector: { label: "Collector", className: "bg-secondary/10 text-secondary border-secondary/20" },
  resident: { label: "Resident", className: "bg-primary/10 text-primary border-primary/20" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "text-muted-foreground border-muted bg-muted/30" },
  on_leave: { label: "On Leave", className: "bg-warning/10 text-warning border-warning/20" },
};

const ViewUserDialog = ({ open, onOpenChange, user }: ViewUserDialogProps) => {
  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <DashboardDialog open={open} onOpenChange={onOpenChange} title="User Details">
      <div className="py-4 space-y-5">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F6E56] overflow-hidden">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-white" />
            )}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold" style={{ color: "#0F6E56" }}>{fullName}</h3>
            <div className="flex gap-2 mt-2 justify-center">
              <Badge variant="outline" className={roleConfig[user.role]?.className}>
                {roleConfig[user.role]?.label}
              </Badge>
              <Badge variant="outline" className={statusConfig[user.status]?.className}>
                {statusConfig[user.status]?.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow icon={Phone} label="Phone" value={user.phone || "-"} />
          <DetailRow icon={MapPin} label="Address" value={user.address || "-"} />
          {user.zone && <DetailRow icon={Shield} label="Zone" value={user.zone} />}
          <DetailRow icon={Calendar} label="Joined" value={formatDate(user.date_joined)} />
        </div>
      </div>
      <div className="flex px-2 pb-2">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </DashboardDialog>
  );
};

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm" style={{ color: "#444441" }}>
        <Icon className="h-4 w-4" style={{ color: "#6B9E8A" }} />
        {label}
      </div>
      <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{value}</span>
    </div>
  );
}

export default ViewUserDialog;
