import { type LucideIcon } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { cn } from "@/lib/utils";

export interface MetricItem {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive?: boolean; label?: string };
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "accent" | "primary";
}

interface MetricGroupProps {
  /** Métricas em destaque (renderizadas como MetricCard grande) */
  primary: MetricItem[];
  /** Métricas secundárias (pills compactas em linha abaixo dos cards) */
  secondary?: MetricItem[];
  className?: string;
}

export function MetricGroup({
  primary,
  secondary,
  className,
}: MetricGroupProps) {
  const primaryCols =
    primary.length === 1
      ? "grid-cols-1"
      : primary.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Primary — cards grandes */}
      <div className={cn("grid gap-4", primaryCols)}>
        {primary.map((m) => (
          <MetricCard
            key={m.id}
            title={m.title}
            value={m.value}
            icon={m.icon}
            trend={m.trend}
            subtitle={m.subtitle}
            variant={m.variant}
          />
        ))}
      </div>

      {/* Secondary — pills compactas */}
      {secondary && secondary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {secondary.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-3 py-2"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-micro uppercase tracking-wider text-muted-foreground">
                    {m.title}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {m.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}