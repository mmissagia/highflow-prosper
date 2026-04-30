import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  if (diffHours < 24) return `${diffHours}h`;

  const isYesterday = diffDays === 1;
  const isThisYear = d.getFullYear() === now.getFullYear();

  const time = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isYesterday) return `ontem ${time}`;
  if (diffDays < 7) {
    const weekday = d.toLocaleDateString("pt-BR", { weekday: "short" });
    return `${weekday} ${time}`;
  }
  if (isThisYear) {
    const dayMonth = d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    return `${dayMonth} ${time}`;
  }
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
