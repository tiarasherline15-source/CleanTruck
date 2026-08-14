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
      <DialogContent className={cn("sm:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide", className)}>
        <DialogHeader className="text-center gap-2 sm:gap-3 px-2">
          <DialogTitle className={cn("text-center text-base sm:text-lg", titleClassName)} style={{ color: "#0F6E56" }}>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className={cn("text-center text-xs sm:text-sm", descriptionClassName)}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="overflow-y-auto scrollbar-hide px-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
