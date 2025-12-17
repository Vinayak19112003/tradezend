
"use client";

import { useMemo, memo } from "react";
import type { Trade } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StreamerModeText } from "@/components/streamer-mode-text";
import {
    DollarSign,
    CalendarDays,
    BarChart3,
    Hash,
    Target,
    TrendingUp,
    Divide,
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

type StatCardProps = {
    label: string;
    value: string | number;
    subValue?: string;
    icon: React.ElementType;
    valueClassName?: string;
    variant?: 'success' | 'destructive' | 'default';
};

const StatCard = memo(function StatCard({ label, value, subValue, icon: Icon, valueClassName, variant = 'default' }: StatCardProps) {
    const iconBg = {
        success: 'bg-success/10 text-success',
        destructive: 'bg-destructive/10 text-destructive',
        default: 'bg-primary/10 text-primary'
    };

    return (
        <div className={cn(
            "group relative flex flex-col gap-3 rounded-xl bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
            variant === 'success' && "hover:shadow-success/10",
            variant === 'destructive' && "hover:shadow-destructive/10"
        )}>
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className={cn("text-2xl font-bold font-headline tracking-tight", valueClassName)}>
                        <StreamerModeText>{value}</StreamerModeText>
                    </p>
                </div>
                <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    iconBg[variant]
                )}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {subValue && (
                <p className="text-xs text-muted-foreground/80">
                    <StreamerModeText>{subValue}</StreamerModeText>
                </p>
            )}
        </div>
    );
});

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
            winRate: `${winRate.toFixed(1)}%`,
            totalR: totalR.toFixed(2) + 'R',
            profitFactor: isFinite(profitFactor) ? profitFactor.toFixed(2) : "∞",
            totalWins: wins,
            totalLosses: losses,
        };
    }, [trades]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total P&L"
                value={formatCurrency(stats.totalPnl, { sign: true })}
                subValue="Net profit/loss for period"
                icon={DollarSign}
                valueClassName={stats.totalPnl >= 0 ? "text-success" : "text-destructive"}
                variant={stats.totalPnl >= 0 ? 'success' : 'destructive'}
            />
            <StatCard
                label="Avg Daily P&L"
                value={formatCurrency(stats.avgDailyPnl, { sign: true })}
                subValue="Avg profit/loss per day"
                icon={CalendarDays}
                valueClassName={stats.avgDailyPnl >= 0 ? "text-success" : "text-destructive"}
                variant={stats.avgDailyPnl >= 0 ? 'success' : 'destructive'}
            />
            <StatCard
                label="Win / Loss"
                value={`${stats.totalWins} / ${stats.totalLosses}`}
                subValue="Total winning & losing trades"
                icon={BarChart3}
            />
            <StatCard
                label="Total Trades"
                value={stats.totalTrades}
                subValue="Total trades in period"
                icon={Hash}
            />
            <StatCard
                label="Win Rate"
                value={stats.winRate}
                subValue="Winning trades percentage"
                icon={Target}
                valueClassName={parseFloat(stats.winRate) >= 50 ? "text-success" : "text-destructive"}
                variant={parseFloat(stats.winRate) >= 50 ? 'success' : 'destructive'}
            />
            <StatCard
                label="Net R"
                value={stats.totalR}
                subValue="Net R-multiple for period"
                icon={TrendingUp}
                valueClassName={parseFloat(stats.totalR) >= 0 ? "text-success" : "text-destructive"}
                variant={parseFloat(stats.totalR) >= 0 ? 'success' : 'destructive'}
            />
            <StatCard
                label="Profit Factor"
                value={stats.profitFactor}
                subValue="Gross profit / Gross loss"
                icon={Divide}
                valueClassName={parseFloat(stats.profitFactor) >= 1 ? "text-success" : "text-destructive"}
                variant={parseFloat(stats.profitFactor) >= 1 ? 'success' : 'destructive'}
            />
        </div>
    );
});
