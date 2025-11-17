
'use client';

/**
 * @fileOverview Main Layout Component with Dynamic Page Loading
 *
 * This component uses dynamic imports to load pages only when needed,
 * significantly reducing the initial bundle size and improving performance.
 */

import { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import type { Trade } from "@/lib/types";
import { useTrades } from "@/contexts/trades-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

// Dynamic imports for all pages - loads only when needed
const DashboardPage = dynamic(() => import("@/app/(authed)/dashboard/page"), {
    ssr: false,
    loading: () => <PageLoadingSkeleton />
});

const JournalPage = dynamic(() => import("@/app/(authed)/journal/page"), {
    ssr: false,
    loading: () => <PageLoadingSkeleton />
});

const AnalyticsPage = dynamic(() => import("@/app/(authed)/analytics/page"), {
    ssr: false,
    loading: () => <PageLoadingSkeleton />
});

const PerformancePage = dynamic(() => import("@/app/(authed)/performance/page"), {
    ssr: false,
    loading: () => <PageLoadingSkeleton />
});

const SettingsPage = dynamic(() => import("@/app/(authed)/settings/page"), {
    ssr: false,
    loading: () => <PageLoadingSkeleton />
});

const NAV_TABS = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'journal', label: 'Journal' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'performance', label: 'Performance' },
];

/**
 * Loading skeleton for page transitions
 */
const PageLoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
    </div>
);

const TabSkeleton = () => <PageLoadingSkeleton />;

export default function MainLayout() {
    const { trades, isTradesLoading } = useTrades();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'dashboard';

    const [activeTab, setActiveTab] = useState(tabFromUrl);

    useEffect(() => {
        setActiveTab(tabFromUrl);
    }, [tabFromUrl]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("tab", value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    };

    // Render settings page separately
    if (activeTab === 'settings') {
         return (
             <div className="mt-4">
                <Suspense fallback={<TabSkeleton />}>
                    {isTradesLoading ? <TabSkeleton /> : <SettingsPage trades={trades} />}
                </Suspense>
             </div>
         )
    }

    // Render page component based on active tab
    const renderPageComponent = () => {
        if (isTradesLoading) return <TabSkeleton />;

        switch(activeTab) {
            case 'dashboard':
                return <DashboardPage trades={trades} />;
            case 'journal':
                return <JournalPage trades={trades} />;
            case 'analytics':
                return <AnalyticsPage trades={trades} />;
            case 'performance':
                return <PerformancePage trades={trades} />;
            default:
                return <DashboardPage trades={trades} />;
        }
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight font-headline capitalize">{activeTab}</h1>
                <div className="hidden sm:block">
                    <TabsList>
                        {NAV_TABS.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                               {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
            </div>

            <TabsContent value={activeTab} className="mt-4">
                <Suspense fallback={<TabSkeleton />}>
                    {renderPageComponent()}
                </Suspense>
            </TabsContent>
        </Tabs>
    );
}
