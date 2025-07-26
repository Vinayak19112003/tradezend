
'use client';

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import type { Trade } from "@/lib/types";
import { useTrades } from "@/contexts/trades-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, LineChart, Package, Users, Settings } from 'lucide-react';
import DashboardPage from "@/app/(authed)/dashboard/page";
import JournalPage from "@/app/(authed)/journal/page";
import AnalyticsPage from "@/app/(authed)/analytics/page";
import PerformancePage from "@/app/(authed)/performance/page";
import SettingsPage from "@/app/(authed)/settings/page";

const NAV_TABS = [
    { value: 'dashboard', label: 'Dashboard', icon: Home, component: DashboardPage },
    { value: 'journal', label: 'Journal', icon: Package, component: JournalPage },
    { value: 'analytics', label: 'Analytics', icon: LineChart, component: AnalyticsPage },
    { value: 'performance', label: 'Performance', icon: Users, component: PerformancePage },
];

const TabSkeleton = () => (
    <div className="space-y-6 mt-4">
        <Skeleton className="h-10 w-full sm:w-[470px] self-end" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <Skeleton className="h-[250px]" />
            <Skeleton className="h-[250px]" />
            <Skeleton className="h-[250px]" />
            <Skeleton className="h-[250px]" />
        </div>
         <Skeleton className="h-[400px]" />
    </div>
);


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

    const CurrentPageComponent = NAV_TABS.find(tab => tab.value === activeTab)?.component || DashboardPage;
    
    if (activeTab === 'settings') {
         return (
             <div className="mt-4">
                {isTradesLoading ? <TabSkeleton /> : <SettingsPage trades={trades} />}
             </div>
         )
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight font-headline capitalize">{activeTab}</h1>
                <TabsList className="hidden sm:flex">
                    {NAV_TABS.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                           <tab.icon className="h-4 w-4" />
                           {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            
            <TabsContent value={activeTab} forceMount className="mt-4">
               {isTradesLoading ? <TabSkeleton /> : <CurrentPageComponent trades={trades} />}
            </TabsContent>
        </Tabs>
    );
}
