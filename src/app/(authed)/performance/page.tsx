
"use client";

/**
 * @fileoverview This file defines the Performance page.
 * This page provides a deep dive into risk analytics and performance metrics,
 * focusing on drawdown, risk-adjusted returns, and overall consistency.
 */

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import type { Trade } from "@/lib/types";
import { useTradingRules } from "@/hooks/use-trading-rules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamically import tab content
const RiskAnalysisTab = dynamic(() => import('@/components/performance/risk-analysis-tab'), { ssr: false, loading: () => <TabSkeleton /> });
const PsychologyTab = dynamic(() => import('@/components/performance/psychology-tab'), { ssr: false, loading: () => <TabSkeleton /> });
const TimeAnalysisTab = dynamic(() => import('@/components/performance/time-analysis-tab'), { ssr: false, loading: () => <TabSkeleton /> });

const TabSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4">
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[250px]" />
        <Skeleton className="h-[250px]" />
    </div>
)

interface PerformancePageProps {
  trades: Trade[];
}

/**
 * The main component for the Performance page.
 * It handles fetching all trade data and passing it to the risk analysis components.
 */
export default function PerformancePage({ trades }: PerformancePageProps) {
    const { tradingRules } = useTradingRules();
    
    return (
         <Tabs defaultValue="psychology" className="space-y-4">
            <TabsList>
                <TabsTrigger value="psychology">Psychology</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                <TabsTrigger value="time">Time Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="psychology">
                <PsychologyTab trades={trades} tradingRules={tradingRules} />
            </TabsContent>
            <TabsContent value="risk">
                <RiskAnalysisTab trades={trades} />
            </TabsContent>
            <TabsContent value="time">
                <TimeAnalysisTab trades={trades} />
            </TabsContent>
        </Tabs>
    );
}
