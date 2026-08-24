import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DashboardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const DashboardDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
}: DashboardDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg max-h-[85vh] flex flex-col p-0", className)}>
        {/* Sticky header with close button */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-background px-6 pt-6 pb-4">
          <DialogHeader className="text-center gap-2 sm:gap-3 flex-1 pr-8">
            <DialogTitle className={cn("text-center text-base sm:text-lg", titleClassName)} style={{ color: "#0F6E56" }}>
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className={cn("text-center text-xs sm:text-sm", descriptionClassName)}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto scrollbar-hide px-6 pb-6 flex-1 min-h-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
