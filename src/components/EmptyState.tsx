import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryCta?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: ReactNode;
  className?: string;
  variant?: "default" | "error";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryCta,
  secondaryAction,
  className,
  variant = "default",
}: EmptyStateProps) {
  const PrimaryIcon = primaryCta?.icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full p-4 mb-4 transition-colors duration-instant ease-glide motion-reduce:transition-none",
          variant === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="h-10 w-10" aria-hidden="true" />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-4">
          {description}
        </p>
      )}

      <div className="flex flex-col items-center gap-2 mt-2">
        {primaryCta && (
          <Button onClick={primaryCta.onClick}>
            {PrimaryIcon && <PrimaryIcon className="h-4 w-4 mr-2" />}
            {primaryCta.label}
          </Button>
        )}
        {secondaryAction && (
          <div className="text-sm text-muted-foreground">
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}