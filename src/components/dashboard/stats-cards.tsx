"use client";

import { useMemo, memo } from "react";
import type { Trade } from "@/lib/types";
import { useCurrency } from "@/contexts/currency-context";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
    DollarSign,
    CalendarDays,
    BarChart3,
    Hash,
    Target,
    TrendingUp,
    Divide,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from "lucide-react";

export const StatsCards = memo(function StatsCards({ trades }: { trades: Trade[] }) {
    const { formatCurrency } = useCurrency();
    const stats = useMemo(() => {
        const totalTrades = trades.length;

        const winTrades = trades.filter((t) => t.result === "Win");
        const lossTrades = trades.filter((t) => t.result === "Loss");

        const wins = winTrades.length;
        const losses = lossTrades.length;

        const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;

        const totalPnl = trades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);

        const tradeDates = trades.map(t => t.date.toISOString().split('T')[0]);
        const uniqueTradeDays = new Set(tradeDates).size;
        const avgDailyPnl = uniqueTradeDays > 0 ? totalPnl / uniqueTradeDays : 0;

        const totalR = trades.reduce((acc, trade) => {
            if (trade.result === 'Win') return acc + (trade.rr || 0);
            if (trade.result === 'Loss') return acc - 1;
            return acc;
        }, 0);

        const grossProfit = winTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
        const grossLoss = Math.abs(lossTrades.reduce((acc, t) => acc + (t.pnl || 0), 0));
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : 0);

        return {
            totalPnl,
            avgDailyPnl,
            totalTrades,
            winRate: winRate,
            totalR: totalR,
            profitFactor: profitFactor,
            totalWins: wins,
            totalLosses: losses,
        };
    }, [trades]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <DashboardCard
                title="Total P&L"
                value={formatCurrency(stats.totalPnl, { sign: true })}
                subtitle="Net profit/loss for period"
                icon={<DollarSign className="w-5 h-5" />}
                trend={stats.totalPnl > 0 ? 'up' : stats.totalPnl < 0 ? 'down' : 'neutral'}
                trendValue={stats.totalPnl > 0 ? '+Profit' : stats.totalPnl < 0 ? '-Loss' : 'Flat'}
            />

            <DashboardCard
                title="Avg Daily P&L"
                value={formatCurrency(stats.avgDailyPnl, { sign: true })}
                subtitle="Avg profit/loss per day"
                icon={<CalendarDays className="w-5 h-5" />}
                trend={stats.avgDailyPnl > 0 ? 'up' : stats.avgDailyPnl < 0 ? 'down' : 'neutral'}
            />

            <DashboardCard
                title="Win Rate"
                value={`${stats.winRate.toFixed(1)}%`}
                subtitle={` ${stats.totalWins}W / ${stats.totalLosses}L`}
                icon={<Target className="w-5 h-5" />}
                trend={stats.winRate >= 50 ? 'up' : 'down'}
            />

            <DashboardCard
                title="Profit Factor"
                value={isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : "∞"}
                subtitle="Gross profit / Gross loss"
                icon={<Divide className="w-5 h-5" />}
                trend={stats.profitFactor >= 1.5 ? 'up' : stats.profitFactor < 1 ? 'down' : 'neutral'}
            />

            <DashboardCard
                title="Net R"
                value={`${stats.totalR.toFixed(2)}R`}
                subtitle="Net R-multiple for period"
                icon={<TrendingUp className="w-5 h-5" />}
                trend={stats.totalR > 0 ? 'up' : stats.totalR < 0 ? 'down' : 'neutral'}
            />

            <DashboardCard
                title="Total Trades"
                value={stats.totalTrades}
                subtitle="Total trades in period"
                icon={<Hash className="w-5 h-5" />}
                trend={'neutral'}
            />
        </div>
    );
});
