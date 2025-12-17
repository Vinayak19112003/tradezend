"use client";

/**
 * @fileoverview This file defines the Trade Log page.
 */

import * as React from 'react';
import { useTrades } from "@/contexts/trades-context";
import { useToast } from "@/hooks/use-toast";
import { useTradeForm } from "@/contexts/trade-form-context";
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { useAccountContext } from '@/contexts/account-context';
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";

// Dynamically import child components to optimize initial load.
const TradeTable = dynamic(() => import('@/components/journal/trade-table'), {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />
});
const ImportTrades = dynamic(() => import('@/components/journal/import-trades'), { ssr: false });
const ExportTrades = dynamic(() => import('@/components/journal/export-trades').then(mod => mod.ExportTrades), { ssr: false });
const ClearAllTrades = dynamic(() => import('@/components/journal/clear-all-trades').then(mod => mod.ClearAllTrades), { ssr: false });

export default function JournalPage() {
    const { trades, deleteTrade, deleteAllTrades, addMultipleTrades } = useTrades();
    const { toast } = useToast();
    const { openForm } = useTradeForm();
    const { selectedAccountId } = useAccountContext();

    const handleDeleteTrade = async (id: string) => {
        const success = await deleteTrade(id);
        if (success) {
            toast({ title: "Trade Deleted", description: "The trade has been removed from your log." });
        }
    };

    const handleClearAll = async () => {
        if (!selectedAccountId) {
            toast({ variant: 'destructive', title: 'Error', description: 'No account selected to clear.' });
            return;
        }
        const success = await deleteAllTrades(selectedAccountId);
        if (success) {
            toast({ title: "All Trades Deleted", description: "Your trade log has been cleared." });
        }
    }

    const handleImport = async (addedCount: number, skippedCount: number) => {
        toast({
            title: "Import Complete",
            description: `${addedCount} trades were imported. ${skippedCount} duplicates were skipped.`,
        });
    }

    const reversedTrades = React.useMemo(() => [...(trades || [])].reverse(), [trades]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Trade Journal"
                description="Your complete history of trades."
                action={
                    <div className="flex items-center gap-2">
                        <ImportTrades onImport={handleImport} addMultipleTrades={addMultipleTrades} />
                        <ExportTrades trades={reversedTrades} />
                        <ClearAllTrades onClear={handleClearAll} disabled={reversedTrades.length === 0} />
                    </div>
                }
            />

            <div className="space-y-6">
                <GlassCard>
                    <GlassCardContent className="p-0 sm:p-0">
                        <TradeTable
                            trades={reversedTrades}
                            onEdit={openForm}
                            onDelete={handleDeleteTrade}
                        />
                    </GlassCardContent>
                </GlassCard>
            </div>
        </div>
    );
}
