
"use client";

import { useMemo, memo, useState, useEffect } from 'react';
import type { Trade } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';
import { useTheme } from "next-themes";
import { Skeleton } from '@/components/ui/skeleton';
import { StreamerModeText } from '@/components/streamer-mode-text';

type PnlDistributionProps = {
    trades: Trade[];
};

export default memo(function PnlDistribution({ trades }: PnlDistributionProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { pnlData, yDomain } = useMemo(() => {
        if (trades.length === 0) return { pnlData: [], yDomain: [0, 0] };
        
        const pnls = trades.map(t => t.pnl || 0).filter(pnl => pnl !== 0);
        if (pnls.length === 0) return { pnlData: [], yDomain: [0, 0] };

        const maxAbsPnl = Math.max(...pnls.map(Math.abs));
        const binSize = Math.ceil(maxAbsPnl / 10 / 10) * 10; // Create nice round bins
        if (binSize === 0) return { pnlData: [], yDomain: [0, 0] };

        const bins: { [key: number]: { wins: number; losses: number; range: string } } = {};

        pnls.forEach(pnl => {
            const binIndex = Math.floor(Math.abs(pnl) / binSize);
            if (!bins[binIndex]) {
                 bins[binIndex] = { wins: 0, losses: 0, range: `${(binIndex * binSize).toFixed(0)}-${((binIndex + 1) * binSize).toFixed(0)}` };
            }
            if (pnl > 0) {
                bins[binIndex].wins++;
            } else {
                bins[binIndex].losses++;
            }
        });

        const pnlData = Object.values(bins).map(bin => ({
            range: bin.range,
            wins: bin.wins,
            losses: -bin.losses, // Negative for butterfly chart
        }));
        
        const maxFrequency = Math.max(...pnlData.map(d => Math.max(d.wins, Math.abs(d.losses))));
        const yDomain = [-maxFrequency, maxFrequency];

        return { pnlData, yDomain };
    }, [trades]);

    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const winData = payload.find(p => p.dataKey === 'wins');
            const lossData = payload.find(p => p.dataKey === 'losses');
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                    <div className="font-bold mb-1">P&L Range: ${label}</div>
                    <div className="text-success">Wins: {winData?.value || 0}</div>
                    <div className="text-destructive">Losses: {Math.abs(lossData?.value || 0)}</div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade P&L Distribution</CardTitle>
                <CardDescription>Frequency of trade outcomes by P&L amount.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                {!mounted ? (
                    <Skeleton className="h-full w-full" />
                ) : pnlData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={pnlData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            barCategoryGap="20%"
                        >
                            <defs>
                                <linearGradient id="pnlSuccessGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="pnlDestructiveGradient" x1="1" y1="0" x2="0" y2="0">
                                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                             <XAxis type="number" stroke={tickColor} domain={yDomain} allowDataOverflow={true} tickFormatter={(tick) => Math.abs(tick).toString()} />
                            <YAxis type="category" dataKey="range" stroke={tickColor} width={80} />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'hsla(var(--accent) / 0.2)' }}
                            />
                            <ReferenceLine x={0} stroke={tickColor} strokeWidth={1} />
                            <Bar dataKey="wins" fill="url(#pnlSuccessGradient)" radius={[0, 4, 4, 0]} >
                                <LabelList dataKey="wins" position="right" offset={5} className="fill-foreground" fontSize={12} />
                            </Bar>
                            <Bar dataKey="losses" fill="url(#pnlDestructiveGradient)" radius={[4, 0, 0, 4]}>
                                <LabelList dataKey="losses" position="left" offset={5} className="fill-foreground" fontSize={12} formatter={(val: number) => Math.abs(val)} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground p-4 text-center">
                        No trade data with P&L to show distribution.
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
