"use client";

import { useMemo } from "react";
import type { Trade } from "@/lib/types";
import { useCurrency } from "@/contexts/currency-context";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Target, AlertTriangle, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SummaryBanner({ trades }: { trades: Trade[] }) {
    const { formatCurrency } = useCurrency();

    const stats = useMemo(() => {
        // Calculate PnL for the current month
        const currentMonthPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
        const monthlyTarget = 500; // Example target from screenshot
        const maxLossLimit = 200; // Example limit from screenshot

        const targetProgress = Math.min((Math.max(currentMonthPnl, 0) / monthlyTarget) * 100, 100);
        const riskUsed = Math.min((Math.abs(Math.min(currentMonthPnl, 0)) / maxLossLimit) * 100, 100);

        // Calculate "Top Mistake" (simplified logic: most frequent mistake in losing trades)
        const mistakes: Record<string, number> = {};
        trades.filter(t => t.result === 'Loss').forEach(t => {
            t.mistakes?.forEach(m => {
                mistakes[m] = (mistakes[m] || 0) + 1;
            });
        });

        let topMistake = "None";
        let maxCount = 0;
        Object.entries(mistakes).forEach(([mistake, count]) => {
            if (count > maxCount) {
                maxCount = count;
                topMistake = mistake;
            }
        });

        return {
            currentMonthPnl,
            monthlyTarget,
            maxLossLimit,
            targetProgress,
            riskUsed,
            topMistake
        };
    }, [trades]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Monthly Profit Target */}
            <DashboardCard
                title="Monthly Profit Target"
                value={
                    <div className="flex items-end gap-2">
                        <span className={stats.currentMonthPnl >= 0 ? "text-green-500" : "text-white"}>
                            {formatCurrency(stats.currentMonthPnl)}
                        </span>
                        <span className="text-zinc-500 text-lg mb-0.5">/ {formatCurrency(stats.monthlyTarget)}</span>
                    </div>
                }
                subtitle={
                    <div className="w-full mt-2">
                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                            <span>Progress</span>
                            <span>{stats.targetProgress.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.targetProgress}%` }}
                            />
                        </div>
                    </div>
                }
                icon={<Target className="w-5 h-5" />}
                trend={stats.currentMonthPnl > 0 ? 'up' : 'neutral'}
            />

            {/* Max Loss Limit */}
            <DashboardCard
                title="Max Loss Limit"
                value={
                    <div className="flex items-end gap-2">
                        <span className={stats.currentMonthPnl < 0 ? "text-red-500" : "text-white"}>
                            {formatCurrency(Math.abs(Math.min(stats.currentMonthPnl, 0)))}
                        </span>
                        <span className="text-zinc-500 text-lg mb-0.5">/ {formatCurrency(stats.maxLossLimit)}</span>
                    </div>
                }
                subtitle={
                    <div className="w-full mt-2">
                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                            <span>Risk Used</span>
                            <span>{stats.riskUsed.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.riskUsed}%` }}
                            />
                        </div>
                    </div>
                }
                icon={<AlertTriangle className="w-5 h-5" />}
                trend={stats.riskUsed > 50 ? 'down' : 'neutral'}
            />

            {/* Top Mistake */}
            <DashboardCard
                title="Top Mistake This Month"
                value={stats.topMistake}
                subtitle="Focus on eliminating this error"
                icon={<Crosshair className="w-5 h-5" />}
                action={
                    <Button variant="outline" size="sm" className="w-full border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300">
                        Set Targets
                    </Button>
                }
            />
        </div>
    );
}
