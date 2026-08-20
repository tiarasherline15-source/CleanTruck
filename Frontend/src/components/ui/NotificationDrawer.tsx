import { Bell, CheckCheck, Clock3, Loader2, AlertCircle } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNotifications, useMarkAllNotificationsRead } from "@/hooks/useApi";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import type { Notification, PaginatedResponse } from "@/lib/types";

function normalizeList<T>(data: PaginatedResponse<T> | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

type NotificationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const NotificationDrawer = ({ open, onOpenChange }: NotificationDrawerProps) => {
  const { data: notifData, isLoading, isError } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = normalizeList<Notification>(notifData);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatNotifTime = (iso: string) => {
    try {
      return format(parseISO(iso), "MMM d, h:mm a");
    } catch {
      return iso;
    }
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read.");
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to mark notifications.");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-full p-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-6 text-left">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <SheetTitle>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-[#1D9E75] px-1.5 text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <SheetDescription>
              {notifications.length === 0 ? "No notifications yet." : `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#0F6E56" }} />
              </div>
            )}
            {isError && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">Failed to load notifications.</p>
              </div>
            )}
            {!isLoading && !isError && notifications.length === 0 && (
              <p className="text-center py-12 text-sm text-muted-foreground">No notifications yet.</p>
            )}
            {!isLoading && !isError && notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-4 ${
                  !item.is_read
                    ? "border-[#1D9E75]/30 bg-[#E1F5EE]"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-[#0F6E56]">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                    <p className="text-sm text-muted-foreground">{item.message}</p>
                  </div>
                  {!item.is_read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1D9E75]" />}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{formatNotifTime(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <button
              className="flex items-center gap-2 text-sm font-medium text-[#1D9E75] disabled:opacity-50"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || markAllRead.isPending}
            >
              {markAllRead.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Mark all as read
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
