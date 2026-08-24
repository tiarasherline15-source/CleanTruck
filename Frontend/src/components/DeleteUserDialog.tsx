import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import DashboardDialog from "@/components/ui/DashboardDialog";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/useApi";
import type { User as UserType } from "@/lib/types";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

const DeleteUserDialog = ({ open, onOpenChange, user }: DeleteUserDialogProps) => {
  const deleteUser = useDeleteUser();

  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  const handleDelete = () => {
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        toast.success(`${fullName} has been deleted.`);
        onOpenChange(false);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to delete user.");
      },
    });
  };

  return (
    <DashboardDialog open={open} onOpenChange={onOpenChange} title="Delete User">
      <div className="py-4 space-y-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm" style={{ color: "#444441" }}>
              Are you sure you want to delete <span className="font-semibold">{fullName}</span>?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This action cannot be undone. All data associated with this account will be permanently removed.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-2 pb-2">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={handleDelete}
          disabled={deleteUser.isPending}
        >
          {deleteUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete Account
        </Button>
      </div>
    </DashboardDialog>
  );
};

export default DeleteUserDialog;
