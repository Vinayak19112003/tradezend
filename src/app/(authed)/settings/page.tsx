'use client';

/**
 * @fileoverview Settings page with dynamic imports for better performance
 *
 * This page loads settings cards dynamically to reduce initial bundle size
 * and improve page load speed.
 */

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for all settings cards - loaded only when needed
const UserProfileCard = dynamic(() => import('@/components/settings/user-profile-card'), {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />
});

const PreferencesCard = dynamic(() => import('@/components/settings/preferences-card'), {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />
});

const SecurityCard = dynamic(() => import('@/components/settings/security-card'), {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />
});

const ManageAccountsCard = dynamic(() => import('@/components/settings/manage-accounts-card').then(mod => ({ default: mod.ManageAccountsCard })), {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />
});

const ManageStrategiesCard = dynamic(() => import('@/components/settings/manage-strategies-card').then(mod => ({ default: mod.ManageStrategiesCard })), {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />
});

export default function SettingsPage() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
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
            <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 grid gap-6">
                        <PreferencesCard />
                        <ManageStrategiesCard />
                        <SecurityCard />
                    </div>
                    <div className="lg:col-span-1 grid gap-6">
                        <UserProfileCard />
                        <ManageAccountsCard />
                    </div>
                </div>
            </Suspense>
        </>
    );
}
