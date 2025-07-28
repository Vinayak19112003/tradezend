
'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { Trade } from '@/lib/types';

// Define the shape of the function to open the form
type OpenFormFunc = (trade?: Trade) => void;

interface TradeFormContextType {
  openForm: OpenFormFunc;
  setOpenFormFunction: (func: OpenFormFunc) => void;
}

const TradeFormContext = createContext<TradeFormContextType | undefined>(undefined);

export function useTradeForm() {
  const context = useContext(TradeFormContext);
  if (!context) {
    throw new Error('useTradeForm must be used within a TradeFormProvider');
  }
  return context;
}

export function TradeFormProvider({ children }: { children: ReactNode }) {
  // A "dummy" function to start with. The actual function will be set by the layout component.
  const [openFormFunc, setOpenFormFunc] = useState<OpenFormFunc>(() => () => {
    console.error("openForm function not yet initialized");
  });

  const value = useMemo(() => ({
    openForm: openFormFunc,
    setOpenFormFunction: setOpenFormFunc,
  }), [openFormFunc]);

  return (
    <TradeFormContext.Provider value={value}>
      {children}
    </TradeFormContext.Provider>
  );
}
