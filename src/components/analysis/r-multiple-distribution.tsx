
"use client";

import { useMemo, memo, useState, useEffect } from 'react';
import type { Trade } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from "next-themes";
import { Skeleton } from '@/components/ui/skeleton';

type RMultipleDistributionProps = {
    trades: Trade[];
};

const R_BINS = [
    { name: "-1R", range: [-Infinity, 0] },
    { name: "0-1R", range: [0, 1] },
    { name: "1-2R", range: [1, 2] },
    { name: "2-3R", range: [2, 3] },
    { name: ">3R", range: [3, Infinity] },
];

export default memo(function RMultipleDistribution({ trades }: RMultipleDistributionProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const rMultipleData = useMemo(() => {
        if (trades.length === 0) return [];

        const bins: { [key: string]: { name: string, netR: number, trades: number } } = R_BINS.reduce((acc, bin) => {
            acc[bin.name] = { name: bin.name, netR: 0, trades: 0 };
            return acc;
        }, {} as { [key: string]: { name: string, netR: number, trades: number } });

        trades.forEach(trade => {
            let rValue = 0;
            if (trade.result === 'Win') {
                rValue = trade.rr || 0;
            } else if (trade.result === 'Loss') {
                rValue = -1;
            } else {
                return; // Skip BE trades for this calculation
            }
            
            const bin = R_BINS.find(b => rValue >= b.range[0] && rValue < b.range[1]);
            if (bin) {
                bins[bin.name].netR += rValue;
                bins[bin.name].trades++;
            }
        });

        return Object.values(bins)
            .filter(b => b.trades > 0)
            .map(b => ({ ...b, netR: parseFloat(b.netR.toFixed(2))}));

    }, [trades]);

    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const successColor = 'hsl(var(--success))';
    const destructiveColor = 'hsl(var(--destructive))';

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="col-span-2 font-bold mb-1">R-Multiple: {label}</div>
                        <div className="text-muted-foreground">Net R</div>
                        <div className="font-semibold text-right">{data.netR.toFixed(2)}R</div>
                        <div className="text-muted-foreground">Trades</div>
                        <div className="font-semibold text-right">{data.trades}</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>R-Multiple Distribution</CardTitle>
                <CardDescription>Net R-value per trade outcome category.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                {!mounted ? (
                    <Skeleton className="h-full w-full" />
                ) : rMultipleData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rMultipleData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                             <defs>
                                <linearGradient id="successGradientR" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={successColor} stopOpacity={0.8} />
                                  <stop offset="100%" stopColor={successColor} stopOpacity={0.2} />
                                </linearGradient>
                                <linearGradient id="destructiveGradientR" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={destructiveColor} stopOpacity={0.8} />
                                  <stop offset="100%" stopColor={destructiveColor} stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={tickColor} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                              stroke={tickColor}
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              label={{ value: 'Net R', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 12, dy: 40 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                                cursor={{ fill: 'hsla(var(--accent) / 0.2)' }}
                                content={<CustomTooltip />}
                            />
                            <Bar dataKey="netR" name="Net R" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                {rMultipleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.netR >= 0 ? "url(#successGradientR)" : "url(#destructiveGradientR)"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground p-4 text-center">
                        No trade data with R-multiples to show distribution.
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
