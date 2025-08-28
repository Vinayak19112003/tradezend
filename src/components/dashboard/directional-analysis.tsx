
'use client';

import { useMemo } from 'react';
import { type Trade } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChart } from '@/components/ui/gauge-chart';
import { useCurrency } from '@/contexts/currency-context';
import { StreamerModeText } from '../streamer-mode-text';
import { cn } from '@/lib/utils';

type DirectionalStats = {
    profit: number;
    wins: number;
    totalWinsAmount: number;
    losses: number;
    totalLossesAmount: number;
    winRate: number;
};

const calculateStats = (trades: Trade[]): DirectionalStats => {
    const wins = trades.filter(t => t.result === 'Win');
    const losses = trades.filter(t => t.result === 'Loss');
    const totalWinsAmount = wins.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLossesAmount = losses.reduce((sum, t) => sum + (t.pnl || 0), 0);

    return {
        profit: totalWinsAmount + totalLossesAmount,
        wins: wins.length,
        totalWinsAmount,
        losses: losses.length,
        totalLossesAmount,
        winRate: wins.length + losses.length > 0 ? (wins.length / (wins.length + losses.length)) * 100 : 0,
    };
};

const StatItem = ({ label, value, subValue, valueClassName }: { label: string, value: string, subValue?: string, valueClassName?: string }) => (
    <div className="flex-1 text-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("text-base font-semibold", valueClassName)}>{value}</p>
        {subValue && <StreamerModeText as="p" className="text-xs text-muted-foreground">{subValue}</StreamerModeText>}
    </div>
);


const AnalysisCard = ({ title, stats }: { title: string, stats: DirectionalStats }) => {
    const { formatCurrency } = useCurrency();
    const totalAmount = stats.totalWinsAmount + Math.abs(stats.totalLossesAmount);
    const profitPercentage = totalAmount > 0 ? (stats.totalWinsAmount / totalAmount) * 100 : 0;
    
    return (
        <Card>
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <GaugeChart 
                    value={profitPercentage} 
                    label="Profit" 
                    gaugePrimaryColor="hsl(var(--success))"
                    gaugeSecondaryColor="hsl(var(--destructive))"
                    showValue
                >
                     <StreamerModeText className="text-3xl font-bold text-foreground font-headline">
                        {formatCurrency(stats.profit, {sign: true})}
                     </StreamerModeText>
                </GaugeChart>
                <div className="flex w-full justify-between items-start pt-2">
                    <StatItem 
                        label={`Wins (${stats.wins})`}
                        value={formatCurrency(stats.totalWinsAmount)}
                        valueClassName="text-success"
                    />
                    <StatItem 
                        label="Win Rate"
                        value={`${stats.winRate.toFixed(1)}%`}
                    />
                     <StatItem 
                        label={`Losses (${stats.losses})`}
                        value={formatCurrency(Math.abs(stats.totalLossesAmount))}
                        valueClassName="text-destructive"
                    />
                </div>
            </CardContent>
        </Card>
    )
};


const ProfitabilityCard = ({ winRate, wins, losses }: { winRate: number, wins: number, losses: number }) => {
    return (
        <Card>
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-base font-semibold">Profitability</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <GaugeChart 
                    value={winRate} 
                    label="Total Trades" 
                    gaugePrimaryColor="hsl(var(--success))"
                    gaugeSecondaryColor="hsl(var(--destructive))"
                >
                     <span className="text-3xl font-bold text-foreground font-headline">
                        {wins + losses}
                     </span>
                </GaugeChart>
                 <div className="flex w-full justify-around items-start pt-2">
                    <StatItem 
                        label="Win Rate"
                        value={`${winRate.toFixed(1)}%`}
                        subValue={`Wins: ${wins}`}
                        valueClassName="text-success"
                    />
                     <StatItem 
                        label="Loss Rate"
                        value={`${(100-winRate).toFixed(1)}%`}
                        subValue={`Losses: ${losses}`}
                        valueClassName="text-destructive"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default function DirectionalAnalysis({ trades }: { trades: Trade[] }) {
    const { longStats, shortStats } = useMemo(() => {
        const longTrades = trades.filter(t => t.direction === 'Buy');
        const shortTrades = trades.filter(t => t.direction === 'Sell');
        return {
            longStats: calculateStats(longTrades),
            shortStats: calculateStats(shortTrades),
        };
    }, [trades]);

    const totalWins = longStats.wins + shortStats.wins;
    const totalLosses = longStats.losses + shortStats.losses;
    const totalWinRate = totalWins + totalLosses > 0 ? (totalWins / (totalWins + totalLosses)) * 100 : 0;
    
    if (trades.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalysisCard title="Long Analysis" stats={longStats} />
            <ProfitabilityCard winRate={totalWinRate} wins={totalWins} losses={totalLosses} />
            <AnalysisCard title="Short Analysis" stats={shortStats} />
        </div>
    );
}
