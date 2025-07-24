
'use client';

/**
 * @fileoverview This file defines the Header component, which acts as the main topbar navigation.
 * It includes the application logo, primary navigation links, an "Add Trade" button,
 * and the user menu. It is responsive and adapts for mobile viewing.
 */

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, PlusCircle, RefreshCw } from 'lucide-react';
import { UserMenu } from './user-menu';
import { useTradeForm } from '@/contexts/trade-form-context';
import { Logo } from '../logo';
import { AccountSwitcher } from './account-switcher';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useTrades } from '@/contexts/trades-context';

export const Header = React.memo(function Header() {
    const { openForm } = useTradeForm();
    const isMobile = useIsMobile();
    const { triggerRefresh, isTradesLoading } = useTrades();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Logo />
                        <span className="sr-only">Anony Trading</span>
                    </Link>
                </div>
                
                <div className="flex items-center gap-4">
                    <p className='hidden sm:block text-sm text-muted-foreground'>
                        Welcome back
                    </p>
                    <div className='w-[1px] h-6 bg-border hidden sm:block'/>
                    <div className="flex items-center gap-2">
                        <AccountSwitcher />
                        <Button onClick={() => triggerRefresh()} variant="ghost" size="icon" disabled={isTradesLoading} aria-label="Refresh data">
                            <RefreshCw className={cn("h-4 w-4", isTradesLoading && "animate-spin")} />
                        </Button>
                        <Button onClick={() => openForm()} size={isMobile ? "icon" : "default"}>
                            <PlusCircle className={cn(!isMobile && "mr-2", "h-4 w-4")} />
                            <span className="hidden md:inline">Add Trade</span>
                        </Button>
                        <UserMenu />
                    </div>
                </div>
            </div>
        </header>
    );
});
