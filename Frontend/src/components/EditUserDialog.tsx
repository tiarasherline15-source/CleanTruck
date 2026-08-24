import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardDialog from "@/components/ui/DashboardDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/useApi";
import type { User as UserType } from "@/lib/types";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

const EditUserDialog = ({ open, onOpenChange, user }: EditUserDialogProps) => {
  const updateUser = useUpdateUser();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    zone: "",
    role: "" as string,
    status: "" as string,
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        zone: user.zone || "",
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  if (!user) return null;

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateUser.mutate(
      { id: user.id, data: form },
      {
        onSuccess: () => {
          toast.success("User updated successfully.");
          onOpenChange(false);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update user.");
        },
      }
    );
  };

  return (
    <DashboardDialog open={open} onOpenChange={onOpenChange} title="Edit User">
      <div className="py-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Zone</Label>
          <Input value={form.zone} onChange={(e) => update("zone", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => update("role", v)}>
              <SelectTrigger className="border-[#b8e0d4] bg-[#F6FAFA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="collector">Collector</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="border-[#b8e0d4] bg-[#F6FAFA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-2 pb-2">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button
          className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
          onClick={handleSave}
          disabled={updateUser.isPending}
        >
          {updateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </DashboardDialog>
  );
};

export default EditUserDialog;
