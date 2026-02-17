import { createContext, useContext, useState, ReactNode } from "react";

export interface GlobalFilters {
  period: string;
  event: string;
  pipeline: string;
  team: string;
  origin: string;
}

const defaultFilters: GlobalFilters = {
  period: "30d",
  event: "all",
  pipeline: "all",
  team: "all",
  origin: "all",
};

interface GlobalFilterContextType {
  filters: GlobalFilters;
  setFilter: (key: keyof GlobalFilters, value: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const GlobalFilterContext = createContext<GlobalFilterContextType | undefined>(undefined);

export function GlobalFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);

  const setFilter = (key: keyof GlobalFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(defaultFilters);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== defaultFilters[key as keyof GlobalFilters]
  ).length;

  return (
    <GlobalFilterContext.Provider value={{ filters, setFilter, clearFilters, activeFilterCount }}>
      {children}
    </GlobalFilterContext.Provider>
  );
}

export function useGlobalFilters() {
  const ctx = useContext(GlobalFilterContext);
  if (!ctx) throw new Error("useGlobalFilters must be used within GlobalFilterProvider");
  return ctx;
}
