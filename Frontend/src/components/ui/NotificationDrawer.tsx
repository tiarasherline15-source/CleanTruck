import { Bell, CheckCheck, Clock3 } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
};

type NotificationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const sampleNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Pickup confirmed",
    description: "Your next waste collection has been scheduled for tomorrow morning.",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Route update",
    description: "A new collector update is available for your assigned route.",
    time: "35 minutes ago",
  },
  {
    id: 3,
    title: "Reminder",
    description: "Please confirm your pickup details before the collector arrives.",
    time: "1 hour ago",
  },
];

const NotificationDrawer = ({ open, onOpenChange }: NotificationDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-6 text-left">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <SheetTitle>Notifications</SheetTitle>
            </div>
            <SheetDescription>
              Stay updated with recent activity and pickup alerts.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sampleNotifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-4 ${
                  item.unread
                    ? "border-[#1D9E75]/30 bg-[#E1F5EE]"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-[#0F6E56]">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.unread && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1D9E75]" />}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <button className="flex items-center gap-2 text-sm font-medium text-[#1D9E75]">
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
