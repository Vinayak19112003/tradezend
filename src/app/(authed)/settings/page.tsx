
'use client';

/**
 * @fileoverview This file defines the user Settings page.
 * It uses a two-column layout with a sidebar for navigating different
 * settings panels (General, Accounts, Tag Management).
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Settings as SettingsIcon, Shield, Tag, Users } from 'lucide-react';
import GeneralSettings from '@/components/settings/general-settings';
import { ManageAccountsCard } from '@/components/settings/manage-accounts-card';

interface SettingsPageProps {
  trades: any[]; // Trades prop is not used here but required by the main layout
}

export default function SettingsPage({ trades }: SettingsPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleBack = () => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("tab", 'dashboard');
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    };
    
    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Settings
                </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 grid gap-6">
                    <GeneralSettings />
                </div>
                <div className="lg:col-span-1">
                    <ManageAccountsCard />
                </div>
            </div>
        </>
    );
}
