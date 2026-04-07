import { createContext, useContext, useState, ReactNode } from 'react';

interface StrategyContextType {
  selectedStrategyId: string | null;
  setSelectedStrategyId: (id: string | null) => void;
}

const StrategyContext = createContext<StrategyContextType>({
  selectedStrategyId: null,
  setSelectedStrategyId: () => {},
});

export function StrategyProvider({ children }: { children: ReactNode }) {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);

  return (
    <StrategyContext.Provider value={{ selectedStrategyId, setSelectedStrategyId }}>
      {children}
    </StrategyContext.Provider>
  );
}

export const useStrategy = () => useContext(StrategyContext);
