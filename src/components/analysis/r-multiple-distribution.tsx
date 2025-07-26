
"use client";

import { useMemo, memo, useState, useEffect } from 'react';
import type { Trade } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
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

        const bins: { [key: string]: { name: string, wins: number, losses: number } } = R_BINS.reduce((acc, bin) => {
            acc[bin.name] = { name: bin.name, wins: 0, losses: 0 };
            return acc;
        }, {} as { [key: string]: { name: string, wins: number, losses: number } });

        trades.forEach(trade => {
            if (trade.result === 'Loss') {
                bins['-1R'].losses++;
            } else if (trade.result === 'Win') {
                const rValue = trade.rr || 0;
                const bin = R_BINS.find(b => rValue >= b.range[0] && rValue < b.range[1]);
                if (bin) {
                    bins[bin.name].wins++;
                }
            }
        });

        return Object.values(bins).filter(b => b.wins > 0 || b.losses > 0);

    }, [trades]);

    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return (
        <Card>
            <CardHeader>
                <CardTitle>R-Multiple Distribution</CardTitle>
                <CardDescription>Frequency of trade outcomes by R-multiple.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                {!mounted ? (
                    <Skeleton className="h-full w-full" />
                ) : rMultipleData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rMultipleData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={tickColor} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                              allowDecimals={false}
                              stroke={tickColor}
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 12, dy: -10 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                                cursor={{ fill: 'hsla(var(--accent) / 0.2)' }}
                            />
                            <Legend wrapperStyle={{fontSize: "0.8rem"}} />
                            <Bar dataKey="wins" name="Wins" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="losses" name="Losses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={40} />
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
