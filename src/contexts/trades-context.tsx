'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode, useState, useEffect } from 'react';
import { Trade } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAccountContext } from './account-context';

const TRADES_STORAGE_KEY = 'tradezend_trades';

interface TradesContextType {
    trades: Trade[];
    isTradesLoading: boolean;
    addTrade: (trade: Omit<Trade, 'id'>) => Promise<boolean>;
    addMultipleTrades: (newTrades: Omit<Trade, 'id'>[]) => Promise<{ success: boolean, addedCount: number }>;
    updateTrade: (trade: Trade) => Promise<boolean>;
    deleteTrade: (id: string) => Promise<boolean>;
    deleteAllTrades: (accountId: string) => Promise<boolean>;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

// Helper function to get trades from localStorage
const getStoredTrades = (): Trade[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(TRADES_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return parsed.map((t: any) => ({
            ...t,
            date: new Date(t.date),
        }));
    } catch {
        return [];
    }
};

// Helper function to save trades to localStorage
const saveStoredTrades = (trades: Trade[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
    } catch (e) {
        console.error('Failed to save trades to localStorage:', e);
    }
};

export function TradesProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const { selectedAccountId } = useAccountContext();

    const [allTrades, setAllTrades] = useState<Trade[]>([]);
    const [isTradesLoading, setIsTradesLoading] = useState(true);

    // Load trades from localStorage on mount
    useEffect(() => {
        setIsTradesLoading(true);
        const stored = getStoredTrades();
        setAllTrades(stored);
        setIsTradesLoading(false);
    }, []);

    // Filter trades by selected account
    const trades = useMemo(() => {
        if (!selectedAccountId) return allTrades;
        return allTrades.filter(t => t.accountId === selectedAccountId);
    }, [allTrades, selectedAccountId]);

    const addTrade = useCallback(async (trade: Omit<Trade, 'id'>) => {
        try {
            const newTrade: Trade = {
                ...trade,
                id: crypto.randomUUID(),
                date: new Date(trade.date),
            };

            setAllTrades(prev => {
                const updated = [...prev, newTrade].sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                saveStoredTrades(updated);
                return updated;
            });

            return true;
        } catch (error: any) {
            console.error("Error adding trade:", error);
            throw error;
        }
    }, []);

    const addMultipleTrades = useCallback(async (newTrades: Omit<Trade, 'id'>[]) => {
        if (newTrades.length === 0) return { success: false, addedCount: 0 };

        try {
            const tradesToAdd: Trade[] = newTrades.map(trade => ({
                ...trade,
                id: crypto.randomUUID(),
                date: new Date(trade.date),
            }));

            setAllTrades(prev => {
                const updated = [...prev, ...tradesToAdd].sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                saveStoredTrades(updated);
                return updated;
            });

            toast({
                title: "Import Successful",
                description: `${newTrades.length} trades imported successfully.`,
            });

            return { success: true, addedCount: newTrades.length };
        } catch (error) {
            console.error("Error batch adding trades:", error);
            toast({ variant: "destructive", title: "Import Error", description: "Could not save the imported trades." });
            return { success: false, addedCount: 0 };
        }
    }, [toast]);

    const updateTrade = useCallback(async (trade: Trade) => {
        if (!trade.id) {
            throw new Error("Trade ID is required for update.");
        }

        try {
            setAllTrades(prev => {
                const updated = prev.map(t =>
                    t.id === trade.id ? { ...trade, date: new Date(trade.date) } : t
                ).sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                saveStoredTrades(updated);
                return updated;
            });

            return true;
        } catch (error: any) {
            console.error("Error updating trade:", error);
            throw error;
        }
    }, []);

    const deleteTrade = useCallback(async (id: string) => {
        try {
            setAllTrades(prev => {
                const updated = prev.filter(t => t.id !== id);
                saveStoredTrades(updated);
                return updated;
            });

            toast({ title: "Trade Deleted", description: "The trade has been removed from your log." });
            return true;
        } catch (error: any) {
            console.error("Error deleting trade:", error);
            toast({ variant: "destructive", title: "Error Deleting Trade", description: error.message || "Could not delete the trade." });
            return false;
        }
    }, [toast]);

    const deleteAllTrades = useCallback(async (accountId: string) => {
        if (!accountId) return false;

        try {
            setAllTrades(prev => {
                const updated = prev.filter(t => t.accountId !== accountId);
                saveStoredTrades(updated);
                return updated;
            });

            toast({
                title: "All Trades Cleared",
                description: "All trades for this account have been deleted.",
            });
            return true;
        } catch (error) {
            console.error("Error deleting all trades:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not clear trade log." });
            return false;
        }
    }, [toast]);

    const value = useMemo(() => ({
        trades,
        isTradesLoading,
        addTrade,
        addMultipleTrades,
        updateTrade,
        deleteTrade,
        deleteAllTrades,
    }), [trades, isTradesLoading, addTrade, addMultipleTrades, updateTrade, deleteTrade, deleteAllTrades]);

    return <TradesContext.Provider value={value}>{children}</TradesContext.Provider>;
}

export const useTrades = (): TradesContextType => {
    const context = useContext(TradesContext);
    if (!context) {
        throw new Error('useTrades must be used within a TradesProvider');
    }
    return context;
};
