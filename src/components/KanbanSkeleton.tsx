import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
  className?: string;
}

export function KanbanSkeleton({
  columns = 4,
  cardsPerColumn = 2,
  className,
}: KanbanSkeletonProps) {
  return (
    <div
      className={cn("overflow-x-auto pb-4", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex gap-4 min-w-max">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx} className="w-72 flex-shrink-0">
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-6 rounded-full" />
                </div>
                <Skeleton className="h-3 w-16 mt-1" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: cardsPerColumn }).map((_, cardIdx) => (
                  <div
                    key={cardIdx}
                    className="rounded-lg border border-border/50 p-3 space-y-2 bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}