import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatsGridSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-[#b8e0d4]" style={{ backgroundColor: "#F6FAFA" }}>
          <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function WelcomeSkeleton() {
  return (
    <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: "#0F6E56" }}>
      <div className="space-y-3 max-w-md">
        <Skeleton className="h-5 w-32 bg-white/20" />
        <Skeleton className="h-8 w-48 bg-white/20" />
        <Skeleton className="h-4 w-64 bg-white/20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <Card className="border-[#b8e0d4]" style={{ backgroundColor: "#F6FAFA" }}>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[#b8e0d4]">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardFullSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WelcomeSkeleton />
      <StatsGridSkeleton />
      <CardListSkeleton />
    </div>
  );
}
