
"use client";

import { useMemo, memo } from 'react';
import { type Trade } from '@/lib/types';
import { isThisMonth } from 'date-fns';
import { TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { StreamerModeText } from '@/components/streamer-mode-text';
import { useTargets } from '@/hooks/use-targets';
import { Progress } from '@/components/ui/progress';
import { SetTargetsDialog } from '@/components/settings/set-targets-dialog';
import { useCurrency } from '@/contexts/currency-context';
import { cn } from '@/lib/utils';

type SummaryBannerProps = {
    trades: Trade[];
};

export const SummaryBanner = memo(function SummaryBanner({ trades }: SummaryBannerProps) {
    const { targets } = useTargets();
    const { formatCurrency } = useCurrency();

    const monthStats = useMemo(() => {
        const thisMonthsTrades = trades.filter(trade => isThisMonth(new Date(trade.date)));
        if (thisMonthsTrades.length === 0) {
            return { pnl: 0, topMistake: null };
        }

        const pnl = thisMonthsTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
        const mistakeCounts: { [key: string]: number } = {};
        thisMonthsTrades.forEach(trade => {
            trade.mistakes?.forEach(mistake => {
                mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1;
            });
        });

        const topMistake = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

        return { pnl, topMistake };
    }, [trades]);

    const pnlProgress = targets.profit > 0 ? Math.min((monthStats.pnl / targets.profit) * 100, 100) : 0;
    const lossProgress = targets.loss > 0 ? Math.min((Math.abs(monthStats.pnl < 0 ? monthStats.pnl : 0) / targets.loss) * 100, 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Profit Target Card */}
            <div className={cn(
                "group relative flex flex-col justify-between gap-4 rounded-xl border bg-card/80 backdrop-blur-sm text-card-foreground p-5 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300",
                pnlProgress > 0 && "hover:shadow-success/10"
            )}>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Monthly Profit Target</p>
                        <StreamerModeText as="p" className="text-2xl font-bold font-headline text-success tracking-tight">
                            {`${formatCurrency(monthStats.pnl)} / ${formatCurrency(targets.profit)}`}
                        </StreamerModeText>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success transition-transform duration-300 group-hover:scale-110">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-success">{pnlProgress.toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-gradient-to-r from-success to-success/70 transition-all duration-500 ease-out"
                            style={{ width: `${pnlProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Loss Limit Card */}
            <div className={cn(
                "group relative flex flex-col justify-between gap-4 rounded-xl border bg-card/80 backdrop-blur-sm text-card-foreground p-5 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300",
                lossProgress > 50 && "hover:shadow-destructive/10"
            )}>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Max Loss Limit</p>
                        <StreamerModeText as="p" className="text-2xl font-bold font-headline text-destructive tracking-tight">
                            {`${formatCurrency(Math.abs(monthStats.pnl < 0 ? monthStats.pnl : 0))} / ${formatCurrency(targets.loss)}`}
                        </StreamerModeText>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-transform duration-300 group-hover:scale-110">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Risk Used</span>
                        <span className={cn("font-medium", lossProgress > 75 ? "text-destructive" : "text-muted-foreground")}>{lossProgress.toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={cn(
                                "h-full transition-all duration-500 ease-out",
                                lossProgress > 75 ? "bg-gradient-to-r from-destructive to-destructive/70" : "bg-gradient-to-r from-orange-500 to-orange-500/70"
                            )}
                            style={{ width: `${lossProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Top Mistake & Targets Card */}
            <div className="group relative flex flex-col justify-between gap-3 rounded-xl border bg-card/80 backdrop-blur-sm text-card-foreground p-5 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300 hover:shadow-primary/10">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Top Mistake This Month</p>
                        <p className="text-xl font-semibold truncate">{monthStats.topMistake || 'None'}</p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                        <Target className="h-6 w-6" />
                    </div>
                </div>
                <SetTargetsDialog>
                    <button className="w-full text-center text-sm text-primary font-medium py-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors duration-200">
                        Set Targets
                    </button>
                </SetTargetsDialog>
            </div>
        </div>
    );
});
