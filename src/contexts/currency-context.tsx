
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useGeneralSettings } from '@/hooks/use-general-settings';

type Currency = 'usd' | 'inr';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    usd: '$',
    inr: '₹',
};

interface CurrencyContextType {
  currency: Currency;
  currencySymbol: string;
  formatCurrency: (value: number, options?: { sign?: boolean; decimals?: number }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const { settings } = useGeneralSettings();
    const currency: Currency = settings.currency === 'inr' ? 'inr' : 'usd';
    const currencySymbol = CURRENCY_SYMBOLS[currency];
    
    const formatCurrency = (value: number, options: { sign?: boolean, decimals?: number } = {}) => {
        const { sign = false, decimals = 2 } = options;
        const signPrefix = value > 0 ? '+' : value < 0 ? '-' : '';
        const formattedValue = `${currencySymbol}${Math.abs(value).toFixed(decimals)}`;
        return sign ? `${signPrefix}${formattedValue}` : formattedValue;
    };


    const value = useMemo(() => ({
        currency,
        currencySymbol,
        formatCurrency,
    }), [currency, currencySymbol]);

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
