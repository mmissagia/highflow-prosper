import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface InsertionChoreographyProps {
  children: ReactNode;
  /** Quando true, aplica choreography. Reset para false após animação. */
  isNew: boolean;
  /** Callback ao final da animação (para que pai resete isNew) */
  onComplete?: () => void;
  className?: string;
}

/**
 * Wrapper que aplica choreography de inserção (1.8s / 4 fases) em filho recém-criado.
 * Fase 1 (0-200ms): entrada (fade + translateY)
 * Fase 2 (200-1200ms): permanência destacada (1s, bg success/5)
 * Fase 3 (1200-1800ms): fade do destaque (600ms)
 */
export function InsertionChoreography({
  children,
  isNew,
  onComplete,
  className,
}: InsertionChoreographyProps) {
  const [phase, setPhase] = useState<"idle" | "entering" | "holding" | "fading">(
    "idle"
  );

  useEffect(() => {
    if (!isNew) {
      setPhase("idle");
      return;
    }
    setPhase("entering");
    const t1 = setTimeout(() => setPhase("holding"), 200);
    const t2 = setTimeout(() => setPhase("fading"), 1200);
    const t3 = setTimeout(() => {
      setPhase("idle");
      onComplete?.();
    }, 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isNew, onComplete]);

  const bgClass =
    phase === "entering" || phase === "holding"
      ? "bg-[hsl(var(--success)/0.10)]"
      : "bg-transparent";

  const enterClass =
    phase === "entering"
      ? "animate-[insertion-enter_200ms_var(--ease-emerge)]"
      : "";

  return (
    <div
      className={cn(
        "transition-colors duration-deliberate ease-glide motion-reduce:transition-none",
        bgClass,
        enterClass,
        className
      )}
    >
      {children}
    </div>
  );
}