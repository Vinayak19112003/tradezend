
'use client';

/**
 * @fileoverview This file defines the Header component, which acts as the main topbar navigation.
 * It includes the application logo, primary navigation links, an "Add Trade" button,
 * and the user menu. It is responsive and adapts for mobile viewing.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import { UserMenu } from './user-menu';
import { useTradeForm } from '@/contexts/trade-form-context';
import { AccountSwitcher } from './account-switcher';
import ShimmerButton from '../ui/shimmer-button';
import { Logo } from '../logo';
import Link from 'next/link';

export const Header = React.memo(function Header() {
    const { openForm } = useTradeForm();

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/60 backdrop-blur-xl px-4 md:px-6 shadow-sm">
            <Link href="/dashboard" className="mr-6 flex items-center">
                <Logo />
            </Link>

            <div className='ml-auto flex items-center gap-3'>
                <AccountSwitcher />
                <ShimmerButton onClick={() => openForm()} className="h-9 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Add Trade</span>
                </ShimmerButton>
                <UserMenu />
            </div>
        </header>
    );
});
