
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
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

export const Header = React.memo(function Header() {
    const { openForm } = useTradeForm();
    const isMobile = useIsMobile();
    
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sidebar />
            <div className='ml-auto flex items-center gap-2'>
                <AccountSwitcher />
                <Button onClick={() => openForm()} size={isMobile ? "icon" : "default"}>
                    <PlusCircle className={cn(!isMobile && "mr-2", "h-4 w-4")} />
                    <span className="hidden md:inline">Add Trade</span>
                </Button>
                <UserMenu />
            </div>
        </header>
    );
});
