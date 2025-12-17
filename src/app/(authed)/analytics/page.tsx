"use client";

/**
 * @fileoverview This file defines the Analysis page.
 */

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import type { DateRange } from "react-day-picker";
import { startOfMonth, endOfDay } from "date-fns";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import type { Trade } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingModelPage from "./trading-model-view";
import { useTrades } from "@/contexts/trades-context";
import { PageHeader } from "@/components/ui/page-header";

// Dynamically import all charting components
const CoreMetrics = dynamic(() => import('@/components/analysis/core-metrics'), { ssr: false, loading: () => <Skeleton className="h-[250px] w-full" /> });
const RiskRewardMetrics = dynamic(() => import('@/components/analysis/risk-reward-metrics'), { ssr: false, loading: () => <Skeleton className="h-[250px] w-full" /> });
const DrawdownStreakAnalysis = dynamic(() => import('@/components/analysis/drawdown-streak-analysis'), { ssr: false, loading: () => <Skeleton className="h-[250px] w-full" /> });
const SystemQualityMetrics = dynamic(() => import('@/components/analysis/system-quality-metrics'), { ssr: false, loading: () => <Skeleton className="h-[250px] w-full" /> });

const DailyPerformance = dynamic(() => import('@/components/analysis/daily-performance').then(mod => mod.DailyPerformance), { ssr: false, loading: () => <Skeleton className="h-[400px]" /> });
const SessionAnalysis = dynamic(() => import('@/components/analysis/session-analysis'), { ssr: false, loading: () => <Skeleton className="h-[400px]" /> });
const PnlDistribution = dynamic(() => import('@/components/analysis/pnl-distribution'), { ssr: false, loading: () => <Skeleton className="h-[400px]" /> });
const RMultipleDistribution = dynamic(() => import('@/components/analysis/r-multiple-distribution'), { ssr: false, loading: () => <Skeleton className="h-[400px]" /> });


export default function AnalyticsPage() {
    const { trades: allTrades } = useTrades();
    const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    useEffect(() => {
        if (dateRange?.from && allTrades) {
            const from = dateRange.from;
            const to = endOfDay(dateRange.to ?? dateRange.from);
            const newFilteredTrades = allTrades.filter(trade => {
                const tradeDate = new Date(trade.date);
                return tradeDate >= from && tradeDate <= to;
            });
            setFilteredTrades(newFilteredTrades);
        } else {
            setFilteredTrades(allTrades || []);
        }
    }, [dateRange, allTrades]);


    return (
        <div className="space-y-4 md:space-y-6">
            <PageHeader
                title="Performance Analytics"
                description="Deep dive into your trading statistics."
                action={<DateRangeFilter date={dateRange} onDateChange={setDateRange} />}
            />

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="model">Trading Model</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                    <div className="space-y-4 md:space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <CoreMetrics trades={filteredTrades} />
                            <RiskRewardMetrics trades={filteredTrades} />
                            <DrawdownStreakAnalysis trades={filteredTrades} />
                            <SystemQualityMetrics trades={filteredTrades} />
                        </div>

                        <div className="w-full">
                            <DailyPerformance trades={filteredTrades} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            <PnlDistribution trades={filteredTrades} />
                            <RMultipleDistribution trades={filteredTrades} />
                        </div>

                        <div className="w-full">
                            <SessionAnalysis trades={filteredTrades} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="model" className="mt-4">
                    <TradingModelPage />
                </TabsContent>
            </Tabs>
        </div>
    );
}
