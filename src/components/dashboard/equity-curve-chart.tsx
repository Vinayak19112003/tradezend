
"use client";

import { useMemo, useState, useEffect, memo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type Trade } from "@/lib/types";
import { useTheme } from "next-themes";
import { format, startOfDay } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

type EquityCurveChartProps = {
  trades: Trade[];
};

export const EquityCurveChart = memo(function EquityCurveChart({ trades }: EquityCurveChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    if (trades.length === 0) return [];

    let cumulativeR = 0;
    const dailyNetR: { [date: string]: number } = {};

    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrades.forEach(trade => {
      const dateKey = format(startOfDay(new Date(trade.date)), 'yyyy-MM-dd');
      if (!dailyNetR[dateKey]) {
        dailyNetR[dateKey] = 0;
      }
      let rValue = 0;
      if (trade.result === 'Win' && trade.rr) {
        rValue = trade.rr;
      } else if (trade.result === 'Loss') {
        rValue = -1;
      }
      dailyNetR[dateKey] += rValue;
    });

    const chartData = Object.keys(dailyNetR)
      .sort()
      .map(dateKey => {
        cumulativeR += dailyNetR[dateKey];
        return {
          date: format(new Date(dateKey), 'dd MMM'),
          cumulativeR: parseFloat(cumulativeR.toFixed(2)),
        };
      });

    return [{ date: 'Start', cumulativeR: 0 }, ...chartData];

  }, [trades]);

  const tickColor = theme === 'dark' ? 'hsl(215, 20%, 65%)' : 'hsl(240, 5%, 35%)';
  const gridColor = theme === 'dark' ? 'hsl(217, 33%, 17%)' : 'hsl(220, 14%, 90%)';

  // Use success color for positive trajectory
  const finalR = data.length > 0 ? data[data.length - 1].cumulativeR : 0;
  const isPositive = finalR >= 0;
  const strokeColor = isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)';
  const fillColorStart = isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Equity Curve
          </CardTitle>
          <CardDescription>Cumulative R-multiple over time</CardDescription>
        </div>
        {data.length > 1 && (
          <div className={`text-2xl font-bold font-headline ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{finalR}R
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {!mounted ? (
          <Skeleton className="h-[350px] w-full" />
        ) : data.length > 1 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fillColorStart} stopOpacity={0.4} />
                    <stop offset="50%" stopColor={fillColorStart} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={fillColorStart} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke={tickColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke={tickColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `${value}R`}
                  dx={-5}
                />
                <Tooltip
                  cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.3)',
                    padding: '12px 16px',
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                  formatter={(value: number) => [`${value}R`, 'Cumulative R']}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeR"
                  stroke={strokeColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#equityGradient)"
                  dot={false}
                  activeDot={{ r: 6, fill: strokeColor, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground p-4 text-center rounded-lg bg-muted/30">
            <div className="space-y-2">
              <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p>No trade data in the selected range</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
