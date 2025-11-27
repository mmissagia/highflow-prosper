import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "accent";
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle,
  variant = "default" 
}: MetricCardProps) {
  const variantStyles = {
    default: "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-transparent",
    warning: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent",
    accent: "border-accent/20 bg-gradient-to-br from-accent/5 to-transparent"
  };

  const iconStyles = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-destructive bg-destructive/10",
    accent: "text-accent bg-accent/10"
  };

  return (
    <Card className={cn("border-2 transition-all hover:shadow-lg", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
