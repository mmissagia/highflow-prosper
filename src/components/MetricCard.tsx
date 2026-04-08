import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
    /** @deprecated use `value` sign instead */
    isPositive?: boolean;
  };
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "accent" | "green" | "yellow" | "red" | "primary";
}

const variantStyles: Record<string, { card: string; icon: string }> = {
  default: {
    card: "border-border/60 bg-card",
    icon: "text-muted-foreground bg-muted",
  },
  primary: {
    card: "border-primary/20 bg-primary/5",
    icon: "text-primary bg-primary/10",
  },
  green: {
    card: "border-green-500/20 bg-green-50 dark:bg-green-950/20",
    icon: "text-green-600 bg-green-100 dark:bg-green-900/30",
  },
  success: {
    card: "border-green-500/20 bg-green-50 dark:bg-green-950/20",
    icon: "text-green-600 bg-green-100 dark:bg-green-900/30",
  },
  yellow: {
    card: "border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/20",
    icon: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  },
  warning: {
    card: "border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/20",
    icon: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  },
  red: {
    card: "border-red-500/20 bg-red-50 dark:bg-red-950/20",
    icon: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
  accent: {
    card: "border-accent/20 bg-accent/5",
    icon: "text-accent bg-accent/10",
  },
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  variant = "default",
}: MetricCardProps) {
  const styles = variantStyles[variant] ?? variantStyles.default;

  const trendValue = trend?.value ?? 0;
  const trendPositive = trend ? (trend.isPositive ?? trendValue > 0) : false;
  const trendNegative = trend ? (trend.isPositive === false || trendValue < 0) : false;

  return (
    <Card className={cn("border transition-all hover:shadow-md", styles.card)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs mt-1.5",
                trendPositive && "text-green-600",
                trendNegative && "text-red-600",
                !trendPositive && !trendNegative && "text-muted-foreground",
              )}>
                {trendPositive ? "↑" : trendNegative ? "↓" : ""}{" "}
                {Math.abs(trendValue)}%{trend.label ? ` ${trend.label}` : " vs. mês anterior"}
              </p>
            )}
          </div>
          <div className={cn("p-2.5 rounded-lg shrink-0", styles.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
