
'use client';

import { useMemo } from 'react';
import { type Trade } from '@/lib/types';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChart } from '@/components/ui/gauge-chart';
import { useCurrency } from '@/contexts/currency-context';
import { StreamerModeText } from '../streamer-mode-text';
import { cn } from '@/lib/utils';
import { InteractiveCard } from '../ui/interactive-card';

type DirectionalStats = {
    netProfit: number;
    wins: number;
    grossProfit: number;
    losses: number;
    grossLoss: number;
    winRate: number;
};

const calculateStats = (trades: Trade[]): DirectionalStats => {
    const winningTrades = trades.filter(t => t.pnl != null && t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl != null && t.pnl < 0);
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    
    const totalTrades = winningTrades.length + losingTrades.length;

    return {
        netProfit: grossProfit - grossLoss,
        wins: winningTrades.length,
        grossProfit,
        losses: losingTrades.length,
        grossLoss,
        winRate: totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0,
    };
};

const StatItem = ({ label, value, subValue, valueClassName }: { label: string, value: string, subValue?: string, valueClassName?: string }) => (
    <div className="flex-1 text-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("text-lg font-semibold font-headline", valueClassName)}><StreamerModeText>{value}</StreamerModeText></p>
        {subValue && <StreamerModeText as="p" className="text-xs text-muted-foreground">{subValue}</StreamerModeText>}
    </div>
);


const AnalysisCard = ({ title, stats }: { title: string, stats: DirectionalStats }) => {
    const { formatCurrency } = useCurrency();
    const totalVolume = stats.grossProfit + stats.grossLoss;
    const profitPercentage = totalVolume > 0 ? (stats.grossProfit / totalVolume) * 100 : 0;
    
    return (
        <InteractiveCard>
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <GaugeChart 
                    value={profitPercentage} 
                    gaugePrimaryColor="hsl(var(--success))"
                    gaugeSecondaryColor="hsl(var(--destructive))"
                >
                     <div className="text-center">
                        <p className="text-xs text-muted-foreground">Net Profit</p>
                         <StreamerModeText className={cn("text-xl font-bold text-foreground font-headline", stats.netProfit > 0 ? "text-success" : stats.netProfit < 0 ? "text-destructive" : "")}>
                            {formatCurrency(stats.netProfit, {sign: true})}
                         </StreamerModeText>
                     </div>
                </GaugeChart>
                <div className="flex w-full justify-between items-start pt-2">
                    <StatItem 
                        label={`Wins (${stats.wins})`}
                        value={formatCurrency(stats.grossProfit)}
                        valueClassName="text-success"
                    />
                     <StatItem 
                        label={`Losses (${stats.losses})`}
                        value={formatCurrency(stats.grossLoss)}
                        valueClassName="text-destructive"
                    />
                </div>
            </CardContent>
        </InteractiveCard>
    )
};


const ProfitabilityCard = ({ winRate, wins, losses }: { winRate: number, wins: number, losses: number }) => {
    return (
        <InteractiveCard>
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-base font-semibold">Overall Profitability</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <GaugeChart 
                    value={winRate} 
                    gaugePrimaryColor="hsl(var(--success))"
                    gaugeSecondaryColor="hsl(var(--destructive))"
                >
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Total Trades</p>
                        <span className="text-xl font-bold text-foreground font-headline">
                            {wins + losses}
                        </span>
                    </div>
                </GaugeChart>
                 <div className="flex w-full justify-around items-start pt-2">
                    <StatItem 
                        label={`Wins: ${wins}`}
                        value={`${winRate.toFixed(1)}%`}
                        valueClassName="text-success"
                    />
                     <StatItem 
                        label={`Losses: ${losses}`}
                        value={`${(100 - winRate).toFixed(1)}%`}
                        valueClassName="text-destructive"
                    />
                </div>
            </CardContent>
        </InteractiveCard>
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
