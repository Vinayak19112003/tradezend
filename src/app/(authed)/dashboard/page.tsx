"use client";

/**
 * @fileoverview This file defines the main Dashboard page.
 * It serves as the primary landing page for authenticated users.
 */

import { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Skeleton } from "@/components/ui/skeleton";
import type { DateRange } from "react-day-picker";
import { startOfMonth, endOfDay, isSameDay, subMonths } from "date-fns";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import type { Trade } from "@/lib/types";
import { useTrades } from "@/contexts/trades-context";
import { GridBackground } from "@/components/ui/grid-background";
import { PageHeader } from "@/components/ui/page-header";

// Dynamically import components to improve initial page load performance.
const SummaryBanner = dynamic(() => import('@/components/dashboard/summary-banner').then(mod => mod.SummaryBanner), { ssr: false, loading: () => <Skeleton className="h-28" /> });
const DirectionalAnalysis = dynamic(() => import('@/components/dashboard/directional-analysis'), { ssr: false, loading: () => <Skeleton className="h-[250px] w-full" /> });
const EquityCurveChart = dynamic(() => import('@/components/dashboard/equity-curve-chart').then(mod => mod.EquityCurveChart), { ssr: false, loading: () => <Skeleton className="h-[420px]" /> });
const MonthlyCalendar = dynamic(() => import('@/components/dashboard/monthly-calendar'), { ssr: false, loading: () => <Skeleton className="h-[600px]" /> });

export default function DashboardPage() {
  const { trades: allTrades } = useTrades();
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);

  // Default to showing last 3 months of data for a better initial view.
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: endOfDay(new Date()),
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


  const handleCalendarDateSelect = (date: Date) => {
    const from = dateRange?.from;
    const to = dateRange?.to;
    if (from && to && isSameDay(date, from) && isSameDay(date, to)) {
      setDateRange({
        from: startOfMonth(subMonths(new Date(), 2)),
        to: endOfDay(new Date())
      });
    } else {
      setDateRange({ from: date, to: date });
    }
  };

  const summaryTrades = useMemo(() => {
    const startOfThisMonth = startOfMonth(new Date());
    return (allTrades || []).filter(trade => new Date(trade.date) >= startOfThisMonth);
  }, [allTrades]);


  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <GridBackground />
      </div>

      <div className="space-y-4 md:space-y-8 relative z-10">
        <PageHeader
          title="Dashboard"
          description="Welcome back, Trader."
          action={<DateRangeFilter date={dateRange} onDateChange={setDateRange} />}
        />

        <SummaryBanner trades={summaryTrades} />

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              Key Performance Indicators
            </h2>
            <StatsCards trades={filteredTrades} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full" />
              Monthly Overview
            </h2>
            {/* Full Width Calendar */}
            <div className="mb-8">
              <MonthlyCalendar trades={allTrades} onDateSelect={handleCalendarDateSelect} />
            </div>

            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full" />
              Performance Analysis
            </h2>
            <div className="space-y-8">
              {/* Full Width Equity Curve */}
              <div>
                <EquityCurveChart trades={filteredTrades} />
              </div>

              {/* Full Width Directional Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full" />
                  Directional Stats
                </h3>
                <DirectionalAnalysis trades={filteredTrades} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
