'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode, useState, useEffect } from 'react';
import { Trade } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAccountContext } from './account-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

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

export function TradesProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const { selectedAccountId } = useAccountContext();
    const { user } = useAuth();

    const [allTrades, setAllTrades] = useState<Trade[]>([]);
    const [isTradesLoading, setIsTradesLoading] = useState(true);

    // Load trades from Supabase
    const fetchTrades = useCallback(async () => {
        if (!user) {
            setAllTrades([]);
            setIsTradesLoading(false);
            return;
        }

        setIsTradesLoading(true);
        try {
            const { data, error } = await supabase
                .from('trades')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: true }); // Ensure chronological order

            if (error) throw error;

            if (data) {
                // Map DB snake_case columns to camelCase if needed, or if Supabase types match, use directly.
                // Assuming exact field match for now based on previous SQL schema check.
                // We need to parse dates back to Date objects.
                const mappedTrades = data.map((t: any) => ({
                    ...t,
                    date: new Date(t.date),
                    // Ensure arrays are initialized if null
                    mistakes: t.mistakes || [],
                    rulesFollowed: t.rules_followed || [], // DB is likely snake_case
                    modelFollowed: t.model_followed || undefined,
                    preTradeEmotion: t.pre_trade_emotion,
                    postTradeEmotion: t.post_trade_emotion,
                    marketContext: t.market_context,
                    entryReason: t.entry_reason,
                    tradeFeelings: t.trade_feelings,
                    lossAnalysis: t.loss_analysis,
                    screenshotURL: t.screenshot_url,
                    accountSize: t.account_size,
                    riskPercentage: t.risk_percentage,
                    entryTime: t.entry_time,
                    exitTime: t.exit_time,
                    entryPrice: t.entry_price,
                    exitPrice: t.exit_price,
                    accountId: t.account_id,
                    entryTimeFrame: t.entry_time_frame,
                })) as Trade[];

                setAllTrades(mappedTrades);
            }
        } catch (error) {
            console.error('Error fetching trades:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load trades.' });
        } finally {
            setIsTradesLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchTrades();
    }, [fetchTrades]);

    // Filter trades by selected account
    const trades = useMemo(() => {
        if (!selectedAccountId) return allTrades;
        return allTrades.filter(t => t.accountId === selectedAccountId);
    }, [allTrades, selectedAccountId]);

    const addTrade = useCallback(async (trade: Omit<Trade, 'id'>) => {
        if (!user) return false;
        try {
            // Prepare payload for DB (convert camelCase to snake_case)
            const payload = {
                user_id: user.id,
                account_id: trade.accountId,
                date: trade.date.toISOString(), // Send as ISO string
                asset: trade.asset,
                strategy: trade.strategy,
                direction: trade.direction,
                entry_time: trade.entryTime,
                exit_time: trade.exitTime,
                entry_price: trade.entryPrice,
                sl: trade.sl,
                rr: trade.rr,
                exit_price: trade.exitPrice,
                result: trade.result,
                confidence: trade.confidence,
                mistakes: trade.mistakes,
                rules_followed: trade.rulesFollowed,
                model_followed: trade.modelFollowed,
                notes: trade.notes,
                screenshot_url: trade.screenshotURL,
                account_size: trade.accountSize,
                risk_percentage: trade.riskPercentage,
                pnl: trade.pnl,
                ticket: trade.ticket,
                pre_trade_emotion: trade.preTradeEmotion,
                post_trade_emotion: trade.postTradeEmotion,
                market_context: trade.marketContext,
                entry_reason: trade.entryReason,
                trade_feelings: trade.tradeFeelings,
                loss_analysis: trade.lossAnalysis,
                session: trade.session,
                key_level: trade.keyLevel,
                entry_time_frame: trade.entryTimeFrame,
            };

            const { data, error } = await supabase
                .from('trades')
                .insert(payload)
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newTrade = {
                    ...trade,
                    id: data.id,
                    // Re-construct the object ensuring local state matches DB
                } as Trade;

                await fetchTrades(); // Refresh list to get accurate state/sort
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Error adding trade:", error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Could not save trade." });
            throw error;
        }
    }, [user, fetchTrades, toast]);

    const addMultipleTrades = useCallback(async (newTrades: Omit<Trade, 'id'>[]) => {
        if (!user || newTrades.length === 0) return { success: false, addedCount: 0 };

        try {
            const payload = newTrades.map(trade => ({
                user_id: user.id,
                account_id: trade.accountId,
                date: trade.date.toISOString(),
                asset: trade.asset,
                strategy: trade.strategy,
                direction: trade.direction,
                entry_time: trade.entryTime,
                exit_time: trade.exitTime,
                entry_price: trade.entryPrice,
                sl: trade.sl,
                rr: trade.rr,
                exit_price: trade.exitPrice,
                result: trade.result,
                confidence: trade.confidence,
                mistakes: trade.mistakes,
                rules_followed: trade.rulesFollowed,
                model_followed: trade.modelFollowed,
                notes: trade.notes,
                screenshot_url: trade.screenshotURL,
                account_size: trade.accountSize,
                risk_percentage: trade.riskPercentage,
                pnl: trade.pnl,
                ticket: trade.ticket,
                pre_trade_emotion: trade.preTradeEmotion,
                post_trade_emotion: trade.postTradeEmotion,
                market_context: trade.marketContext,
                entry_reason: trade.entryReason,
                trade_feelings: trade.tradeFeelings,
                loss_analysis: trade.lossAnalysis,
                session: trade.session,
                key_level: trade.keyLevel,
                entry_time_frame: trade.entryTimeFrame,
            }));

            const { error } = await supabase
                .from('trades')
                .insert(payload);

            if (error) throw error;

            toast({
                title: "Import Successful",
                description: `${newTrades.length} trades imported successfully.`,
            });

            await fetchTrades();
            return { success: true, addedCount: newTrades.length };
        } catch (error: any) {
            console.error("Error batch adding trades:", error);
            toast({ variant: "destructive", title: "Import Error", description: error.message || "Could not save imported trades." });
            return { success: false, addedCount: 0 };
        }
    }, [user, fetchTrades, toast]);

    const updateTrade = useCallback(async (trade: Trade) => {
        if (!trade.id) throw new Error("Trade ID is required for update.");
        if (!user) return false;

        try {
            // Map to snake_case
            const payload = {
                account_id: trade.accountId,
                date: trade.date.toISOString(),
                asset: trade.asset,
                strategy: trade.strategy,
                direction: trade.direction,
                entry_time: trade.entryTime,
                exit_time: trade.exitTime,
                entry_price: trade.entryPrice,
                sl: trade.sl,
                rr: trade.rr,
                exit_price: trade.exitPrice,
                result: trade.result,
                confidence: trade.confidence,
                mistakes: trade.mistakes,
                rules_followed: trade.rulesFollowed,
                model_followed: trade.modelFollowed,
                notes: trade.notes,
                screenshot_url: trade.screenshotURL,
                account_size: trade.accountSize,
                risk_percentage: trade.riskPercentage,
                pnl: trade.pnl,
                ticket: trade.ticket,
                pre_trade_emotion: trade.preTradeEmotion,
                post_trade_emotion: trade.postTradeEmotion,
                market_context: trade.marketContext,
                entry_reason: trade.entryReason,
                trade_feelings: trade.tradeFeelings,
                loss_analysis: trade.lossAnalysis,
                session: trade.session,
                key_level: trade.keyLevel,
                entry_time_frame: trade.entryTimeFrame,
            };

            const { error } = await supabase
                .from('trades')
                .update(payload)
                .eq('id', trade.id)
                .eq('user_id', user.id); // Security: ensure user owns trade

            if (error) throw error;

            await fetchTrades();
            return true;
        } catch (error: any) {
            console.error("Error updating trade:", error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Could not update trade." });
            throw error;
        }
    }, [user, fetchTrades, toast]);

    const deleteTrade = useCallback(async (id: string) => {
        if (!user) return false;
        try {
            const { error } = await supabase
                .from('trades')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast({ title: "Trade Deleted", description: "The trade has been removed." });
            await fetchTrades();
            return true;
        } catch (error: any) {
            console.error("Error deleting trade:", error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Could not delete trade." });
            return false;
        }
    }, [user, fetchTrades, toast]);

    const deleteAllTrades = useCallback(async (accountId: string) => {
        if (!accountId || !user) return false;

        try {
            const { error } = await supabase
                .from('trades')
                .delete()
                .eq('account_id', accountId)
                .eq('user_id', user.id);

            if (error) throw error;

            toast({
                title: "All Trades Cleared",
                description: "All trades for this account have been deleted.",
            });
            await fetchTrades();
            return true;
        } catch (error) {
            console.error("Error deleting all trades:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not clear trade log." });
            return false;
        }
    }, [user, fetchTrades, toast]);

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
