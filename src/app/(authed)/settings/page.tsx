
'use client';

/**
 * @fileoverview This file defines the user Settings page.
 * It provides a centralized hub for managing user profile information,
 * application preferences, and security settings.
 */

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserProfileCard from '@/components/settings/user-profile-card';
import PreferencesCard from '@/components/settings/preferences-card';
import SecurityCard from '@/components/settings/security-card';
import { ManageAccountsCard } from '@/components/settings/manage-accounts-card';


interface SettingsPageProps {
  // This prop is used to satisfy the page component signature in MainLayout
  trades: never; 
}

export default function SettingsPage({ trades }: SettingsPageProps) {
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 grid gap-6">
                    <PreferencesCard />
                    <SecurityCard />
                </div>
                <div className="lg:col-span-1 grid gap-6">
                    <UserProfileCard />
                    <ManageAccountsCard />
                </div>
            </div>
        </>
    );
}
