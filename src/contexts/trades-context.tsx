'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trade } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useAccountContext } from './account-context';

interface TradesContextType {
    trades: Trade[];
    isTradesLoading: boolean;
    addTrade: (trade: Omit<Trade, 'id'>) => Promise<boolean>;
    addMultipleTrades: (newTrades: Omit<Trade, 'id'>[]) => Promise<{success: boolean, addedCount: number}>;
    updateTrade: (trade: Trade) => Promise<boolean>;
    deleteTrade: (id: string) => Promise<boolean>;
    deleteAllTrades: (accountId: string) => Promise<boolean>;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export function TradesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const { selectedAccountId } = useAccountContext();

    const [trades, setTrades] = useState<Trade[]>([]);
    const [isTradesLoading, setIsTradesLoading] = useState(true);

    useEffect(() => {
        if (!user || !selectedAccountId) {
            setTrades([]);
            setIsTradesLoading(false);
            return;
        }

        setIsTradesLoading(true);

        const fetchTrades = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('*')
                .eq('user_id', user.id)
                .eq('account_id', selectedAccountId)
                .order('date', { ascending: true });

            if (error) {
                console.error("Error fetching trades:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch trade data."
                });
                setIsTradesLoading(false);
                return;
            }

            const fetchedTrades = (data || []).map(row => ({
                id: row.id,
                accountId: row.account_id,
                date: new Date(row.date),
                asset: row.asset,
                strategy: row.strategy,
                direction: row.direction,
                entryTime: row.entry_time || undefined,
                exitTime: row.exit_time || undefined,
                entryPrice: row.entry_price,
                sl: row.sl,
                rr: row.rr,
                exitPrice: row.exit_price,
                result: row.result,
                confidence: row.confidence,
                mistakes: row.mistakes,
                rulesFollowed: row.rules_followed,
                modelFollowed: row.model_followed,
                notes: row.notes || undefined,
                screenshotURL: row.screenshot_url,
                accountSize: row.account_size,
                riskPercentage: row.risk_percentage,
                pnl: row.pnl,
                ticket: row.ticket || undefined,
                preTradeEmotion: row.pre_trade_emotion || undefined,
                postTradeEmotion: row.post_trade_emotion || undefined,
                marketContext: row.market_context || undefined,
                entryReason: row.entry_reason || undefined,
                tradeFeelings: row.trade_feelings || undefined,
                lossAnalysis: row.loss_analysis || undefined,
                session: row.session || undefined,
                keyLevel: row.key_level || undefined,
                entryTimeFrame: row.entry_time_frame || undefined,
            })) as Trade[];

            setTrades(fetchedTrades);
            setIsTradesLoading(false);
        };

        fetchTrades();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('trades_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'trades',
                filter: `account_id=eq.${selectedAccountId}`
            }, () => {
                fetchTrades();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, selectedAccountId, toast]);

    const addTrade = useCallback(async (trade: Omit<Trade, 'id'>) => {
        if (!user) {
            throw new Error("User is not authenticated.");
        }

        try {
            const { data: tradeData, error: tradeError } = await supabase
                .from('trades')
                .insert({
                    user_id: user.id,
                    account_id: trade.accountId,
                    date: trade.date.toISOString(),
                    asset: trade.asset,
                    strategy: trade.strategy,
                    direction: trade.direction,
                    entry_time: trade.entryTime || null,
                    exit_time: trade.exitTime || null,
                    entry_price: trade.entryPrice,
                    sl: trade.sl,
                    rr: trade.rr,
                    exit_price: trade.exitPrice,
                    result: trade.result,
                    confidence: trade.confidence,
                    mistakes: trade.mistakes || [],
                    rules_followed: trade.rulesFollowed || [],
                    model_followed: trade.modelFollowed || { week: [], day: [], trigger: [], ltf: [] },
                    notes: trade.notes || null,
                    screenshot_url: trade.screenshotURL || '',
                    account_size: trade.accountSize,
                    risk_percentage: trade.riskPercentage,
                    pnl: trade.pnl,
                    ticket: trade.ticket || null,
                    pre_trade_emotion: trade.preTradeEmotion || null,
                    post_trade_emotion: trade.postTradeEmotion || null,
                    market_context: trade.marketContext || null,
                    entry_reason: trade.entryReason || null,
                    trade_feelings: trade.tradeFeelings || null,
                    loss_analysis: trade.lossAnalysis || null,
                    session: trade.session || null,
                    key_level: trade.keyLevel || null,
                    entry_time_frame: trade.entryTimeFrame || null,
                })
                .select()
                .single();

            if (tradeError) throw tradeError;

            // Update account balance
            if (trade.pnl !== 0) {
                const { data: accountData } = await supabase
                    .from('accounts')
                    .select('current_balance')
                    .eq('id', trade.accountId)
                    .single();

                if (accountData) {
                    await supabase
                        .from('accounts')
                        .update({ current_balance: accountData.current_balance + trade.pnl })
                        .eq('id', trade.accountId);
                }
            }

            return true;
        } catch (error: any) {
            console.error("Error adding trade:", error);
            throw error;
        }
    }, [user]);

    const addMultipleTrades = useCallback(async (newTrades: Omit<Trade, 'id'>[]) => {
        if (!user || newTrades.length === 0) return { success: false, addedCount: 0 };

        try {
            const tradesToInsert = newTrades.map(trade => ({
                user_id: user.id,
                account_id: trade.accountId,
                date: new Date(trade.date).toISOString(),
                asset: trade.asset,
                strategy: trade.strategy,
                direction: trade.direction,
                entry_time: trade.entryTime || null,
                exit_time: trade.exitTime || null,
                entry_price: trade.entryPrice,
                sl: trade.sl,
                rr: trade.rr,
                exit_price: trade.exitPrice,
                result: trade.result,
                confidence: trade.confidence,
                mistakes: trade.mistakes || [],
                rules_followed: trade.rulesFollowed || [],
                model_followed: trade.modelFollowed || { week: [], day: [], trigger: [], ltf: [] },
                notes: trade.notes || null,
                screenshot_url: trade.screenshotURL || '',
                account_size: trade.accountSize,
                risk_percentage: trade.riskPercentage,
                pnl: trade.pnl,
                ticket: trade.ticket || null,
                pre_trade_emotion: trade.preTradeEmotion || null,
                post_trade_emotion: trade.postTradeEmotion || null,
                market_context: trade.marketContext || null,
                entry_reason: trade.entryReason || null,
                trade_feelings: trade.tradeFeelings || null,
                loss_analysis: trade.lossAnalysis || null,
                session: trade.session || null,
                key_level: trade.keyLevel || null,
                entry_time_frame: trade.entryTimeFrame || null,
            }));

            const { error } = await supabase
                .from('trades')
                .insert(tradesToInsert);

            if (error) throw error;

            toast({
                title: "Import Successful",
                description: "Batch import does not automatically update account balances. Please review balances manually if needed.",
            });

            return { success: true, addedCount: newTrades.length };
        } catch (error) {
            console.error("Error batch adding trades:", error);
            toast({ variant: "destructive", title: "Import Error", description: "Could not save the imported trades." });
            return { success: false, addedCount: 0 };
        }
    }, [user, toast]);

    const updateTrade = useCallback(async (trade: Trade) => {
        if (!user || !trade.id) {
            throw new Error("User is not authenticated.");
        }

        try {
            // Get original trade to calculate P&L difference
            const { data: originalTrade } = await supabase
                .from('trades')
                .select('pnl')
                .eq('id', trade.id)
                .single();

            const { error: tradeError } = await supabase
                .from('trades')
                .update({
                    account_id: trade.accountId,
                    date: trade.date.toISOString(),
                    asset: trade.asset,
                    strategy: trade.strategy,
                    direction: trade.direction,
                    entry_time: trade.entryTime || null,
                    exit_time: trade.exitTime || null,
                    entry_price: trade.entryPrice,
                    sl: trade.sl,
                    rr: trade.rr,
                    exit_price: trade.exitPrice,
                    result: trade.result,
                    confidence: trade.confidence,
                    mistakes: trade.mistakes || [],
                    rules_followed: trade.rulesFollowed || [],
                    model_followed: trade.modelFollowed || { week: [], day: [], trigger: [], ltf: [] },
                    notes: trade.notes || null,
                    screenshot_url: trade.screenshotURL || '',
                    account_size: trade.accountSize,
                    risk_percentage: trade.riskPercentage,
                    pnl: trade.pnl,
                    ticket: trade.ticket || null,
                    pre_trade_emotion: trade.preTradeEmotion || null,
                    post_trade_emotion: trade.postTradeEmotion || null,
                    market_context: trade.marketContext || null,
                    entry_reason: trade.entryReason || null,
                    trade_feelings: trade.tradeFeelings || null,
                    loss_analysis: trade.lossAnalysis || null,
                    session: trade.session || null,
                    key_level: trade.keyLevel || null,
                    entry_time_frame: trade.entryTimeFrame || null,
                })
                .eq('id', trade.id);

            if (tradeError) throw tradeError;

            // Update account balance if P&L changed
            if (originalTrade) {
                const pnlDifference = trade.pnl - (originalTrade.pnl || 0);
                if (pnlDifference !== 0) {
                    const { data: accountData } = await supabase
                        .from('accounts')
                        .select('current_balance')
                        .eq('id', trade.accountId)
                        .single();

                    if (accountData) {
                        await supabase
                            .from('accounts')
                            .update({ current_balance: accountData.current_balance + pnlDifference })
                            .eq('id', trade.accountId);
                    }
                }
            }

            return true;
        } catch (error: any) {
            console.error("Error updating trade:", error);
            throw error;
        }
    }, [user]);

    const deleteTrade = useCallback(async (id: string) => {
        if (!user) return false;

        try {
            // Get trade details before deleting
            const { data: tradeData } = await supabase
                .from('trades')
                .select('account_id, pnl')
                .eq('id', id)
                .single();

            if (!tradeData) throw new Error("Trade not found");

            // Delete the trade
            const { error } = await supabase
                .from('trades')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update account balance
            if (tradeData.pnl !== 0) {
                const { data: accountData } = await supabase
                    .from('accounts')
                    .select('current_balance')
                    .eq('id', tradeData.account_id)
                    .single();

                if (accountData) {
                    await supabase
                        .from('accounts')
                        .update({ current_balance: accountData.current_balance - tradeData.pnl })
                        .eq('id', tradeData.account_id);
                }
            }

            toast({ title: "Trade Deleted", description: "The trade has been removed from your log." });
            return true;
        } catch (error: any) {
            console.error("Error deleting trade:", error);
            toast({ variant: "destructive", title: "Error Deleting Trade", description: error.message || "Could not delete the trade." });
            return false;
        }
    }, [user, toast]);

    const deleteAllTrades = useCallback(async (accountId: string) => {
        if (!user || !accountId) return false;

        try {
            const { error } = await supabase
                .from('trades')
                .delete()
                .eq('account_id', accountId)
                .eq('user_id', user.id);

            if (error) throw error;

            toast({
                title: "All Trades Cleared",
                description: "Your account balance for this account has not been reset. You may need to edit it manually in Settings.",
            });
            return true;
        } catch (error) {
            console.error("Error deleting all trades:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not clear trade log." });
            return false;
        }
    }, [user, toast]);

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
