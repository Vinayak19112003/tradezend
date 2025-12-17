
"use client";

import { useState, useMemo, Fragment, useEffect, memo } from 'react';
import type { Trade } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameMonth,
    startOfWeek,
    endOfWeek,
    isToday
} from 'date-fns';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { StreamerModeText } from '@/components/streamer-mode-text';
import { useCurrency } from '@/contexts/currency-context';
import { GlassCard, GlassCardHeader, GlassCardContent, GlassCardTitle } from "@/components/ui/glass-card";

type MonthlyCalendarProps = {
    trades: Trade[];
    onDateSelect: (date: Date) => void;
};

type DailyData = {
    netR: number;
    totalTrades: number;
    pnl: number;
    wins: number;
    losses: number;
};

export default memo(function MonthlyCalendar({ trades, onDateSelect }: MonthlyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const isMobile = useIsMobile();
    const { formatCurrency, currencySymbol } = useCurrency();

    useEffect(() => {
        setMounted(true);
    }, []);

    const dailyData = useMemo(() => {
        const dataByDate = new Map<string, DailyData>();

        if (!trades) {
            return dataByDate;
        }

        trades.forEach(trade => {
            const dateKey = format(new Date(trade.date), 'yyyy-MM-dd');
            const dayData = dataByDate.get(dateKey) || { netR: 0, totalTrades: 0, pnl: 0, wins: 0, losses: 0 };

            dayData.totalTrades += 1;
            dayData.pnl += trade.pnl || 0;

            if (trade.result === 'Win') {
                dayData.wins += 1;
                dayData.netR += trade.rr || 0;
            } else if (trade.result === 'Loss') {
                dayData.losses += 1;
                dayData.netR -= 1;
            }
            dataByDate.set(dateKey, dayData);
        });

        return dataByDate;
    }, [trades]);

    const firstDayOfGrid = startOfWeek(startOfMonth(currentDate));
    const lastDayOfGrid = endOfWeek(endOfMonth(currentDate));
    const calendarDays = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });

    const weeks = useMemo(() => {
        const weekChunks: Date[][] = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            weekChunks.push(calendarDays.slice(i, i + 7));
        }
        return weekChunks;
    }, [calendarDays]);

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const weekdays = isMobile
        ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const showWeeklyPnl = !isMobile;
    const gridColsClass = showWeeklyPnl ? 'grid-cols-8' : 'grid-cols-7';


    // Layout constants handled by logic above

    if (!mounted) {
        return (
            <GlassCard>
                <GlassCardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-7 w-40" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </GlassCardHeader>
                <GlassCardContent className="p-2">
                    <Skeleton className="h-[600px] w-full" />
                </GlassCardContent>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="h-full">
            <GlassCardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                <GlassCardTitle className="text-2xl font-bold font-headline pl-2">{format(currentDate, 'MMMM yyyy')}</GlassCardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 hover:bg-white/10">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 hover:bg-white/10">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </GlassCardHeader>
            <GlassCardContent className="p-0">
                <TooltipProvider>
                    <div className={cn("grid border-l border-white/5", gridColsClass)}>
                        {weekdays.map((day, i) => (
                            <div key={`${day}-${i}`} className="p-3 text-center font-semibold text-zinc-400 text-sm border-r border-b border-white/5 bg-zinc-900/40">
                                {day}
                            </div>
                        ))}
                        {showWeeklyPnl && (
                            <div className="p-3 text-center font-semibold text-zinc-400 text-sm border-r border-b border-white/5 bg-zinc-900/40">
                                Weekly
                            </div>
                        )}
                        {weeks.map((week, weekIndex) => {
                            const { pnl, netR } = week.reduce(
                                (totals, day) => {
                                    const dateKey = format(day, "yyyy-MM-dd");
                                    const data = dailyData.get(dateKey);
                                    if (data) {
                                        totals.pnl += data.pnl;
                                        totals.netR += data.netR;
                                    }
                                    return totals;
                                },
                                { pnl: 0, netR: 0 }
                            );
                            return (
                                <Fragment key={weekIndex}>
                                    {week.map((day) => {
                                        const dateKey = format(day, 'yyyy-MM-dd');
                                        const data = dailyData.get(dateKey);
                                        const isCurrentMonth = isSameMonth(day, currentDate);

                                        // Enhanced Premium Coloring
                                        let bgColorClass = 'bg-transparent hover:bg-white/5';
                                        if (isCurrentMonth && data?.totalTrades) {
                                            if (data.pnl > 0) bgColorClass = 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20'; // Win green tint
                                            else if (data.pnl < 0) bgColorClass = 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20'; // Loss red tint
                                            else bgColorClass = 'bg-zinc-800/30 hover:bg-zinc-800/50';
                                        } else if (!isCurrentMonth) {
                                            bgColorClass = 'bg-black/40'; // Darker for other months
                                        }

                                        const DayCell = (
                                            <div
                                                className={cn(
                                                    "p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 border-r border-b border-white/5 min-h-[140px] relative group",
                                                    bgColorClass,
                                                )}
                                                onClick={() => onDateSelect(day)}
                                            >
                                                <span className={cn(
                                                    "font-medium text-sm flex items-center justify-center w-7 h-7 rounded-full mb-1",
                                                    isToday(day) ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" :
                                                        isCurrentMonth ? "text-zinc-300 group-hover:bg-white/10" : "text-zinc-700"
                                                )}>
                                                    {format(day, 'd')}
                                                </span>
                                                {isCurrentMonth && data && (
                                                    <div className="text-right space-y-1.5 mt-auto">
                                                        <StreamerModeText>
                                                            <p className={cn(
                                                                "font-bold text-lg tracking-tight", // Larger font for P&L
                                                                data.pnl > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' :
                                                                    data.pnl < 0 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]' :
                                                                        'text-zinc-400'
                                                            )}>
                                                                {formatCurrency(data.pnl, { sign: true, decimals: 0 })}
                                                            </p>
                                                        </StreamerModeText>
                                                        <div className="flex justify-end items-center gap-2">
                                                            <p className="text-[10px] uppercase font-bold text-zinc-500">{data.totalTrades}T</p>
                                                            <p className={cn(
                                                                "font-semibold text-xs py-0.5 px-1.5 rounded-md bg-white/5 inline-block",
                                                                data.netR > 0 ? 'text-emerald-400/90' :
                                                                    data.netR < 0 ? 'text-rose-400/90' :
                                                                        'text-zinc-500'
                                                            )}>
                                                                {data.netR.toFixed(1)}R
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )

                                        if (isCurrentMonth && data) {
                                            return (
                                                <Tooltip key={dateKey} delayDuration={0}>
                                                    <TooltipTrigger asChild>{DayCell}</TooltipTrigger>
                                                    <TooltipContent className="bg-zinc-900 border-white/10 text-white">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                            <span className="font-semibold text-zinc-400">P&L:</span>
                                                            <span className={cn(data.pnl > 0 ? 'text-emerald-400' : data.pnl < 0 ? 'text-rose-400' : '')}>
                                                                <StreamerModeText>{formatCurrency(data.pnl)}</StreamerModeText>
                                                            </span>
                                                            <span className="font-semibold text-zinc-400">Net R:</span>
                                                            <span>{data.netR.toFixed(2)}</span>
                                                            <span className="font-semibold text-zinc-400">Trades:</span>
                                                            <span>{data.totalTrades}</span>
                                                            <span className="font-semibold text-zinc-400">Wins:</span>
                                                            <span className="text-emerald-400">{data.wins}</span>
                                                            <span className="font-semibold text-zinc-400">Losses:</span>
                                                            <span className="text-rose-400">{data.losses}</span>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        }

                                        return (
                                            <Fragment key={dateKey}>{DayCell}</Fragment>
                                        );
                                    })}
                                    {showWeeklyPnl && (
                                        <div className="p-3 flex flex-col justify-center items-center text-center border-r border-b border-white/5 bg-zinc-900/20 backdrop-blur-sm">
                                            <p className="text-xs text-zinc-500 font-bold uppercase mb-1 tracking-wider">Total</p>
                                            <StreamerModeText>
                                                <p className={cn(
                                                    "font-bold text-lg",
                                                    pnl > 0 ? 'text-emerald-400' : pnl < 0 ? 'text-rose-400' : 'text-zinc-500'
                                                )}>
                                                    {formatCurrency(pnl, { sign: true, decimals: 0 })}
                                                </p>
                                            </StreamerModeText>
                                            <p className={cn(
                                                "font-medium text-xs mt-1",
                                                netR > 0 ? 'text-emerald-400/70' : netR < 0 ? 'text-rose-400/70' : 'text-zinc-600'
                                            )}>
                                                {netR.toFixed(1)}R
                                            </p>
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </GlassCardContent>
        </GlassCard>
    );
});
