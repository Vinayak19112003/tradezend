
'use client';

/**
 * @fileoverview This file defines the Header component, which acts as the main topbar navigation.
 * It includes the application logo, primary navigation links, an "Add Trade" button,
 * and the user menu. It is responsive and adapts for mobile viewing.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import { UserMenu } from './user-menu';
import { useTradeForm } from '@/contexts/trade-form-context';
import { AccountSwitcher } from './account-switcher';
import { useIsMobile } from '@/hooks/use-is-mobile';
import ShimmerButton from '../ui/shimmer-button';
import { Logo } from '../logo';
import Link from 'next/link';

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/analytics", label: "Analytics" },
    { href: "/performance", label: "Performance" },
];

export const Header = React.memo(function Header() {
    const { openForm } = useTradeForm();
    const isMobile = useIsMobile();
    
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
            <Link href="/dashboard" className="mr-6 hidden md:flex">
                <Logo />
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
                {NAV_ITEMS.map((item) => (
                    <Button key={item.href} asChild variant="ghost" size="sm">
                       <Link href={item.href}>{item.label}</Link>
                    </Button>
                ))}
            </nav>

            <div className='ml-auto flex items-center gap-2'>
                <AccountSwitcher />
                <ShimmerButton onClick={() => openForm()} className="h-9">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Add Trade</span>
                </ShimmerButton>
                <UserMenu />
            </div>
        </header>
    );
});
