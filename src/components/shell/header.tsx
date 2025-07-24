
'use client';

/**
 * @fileoverview This file defines the Header component, which acts as the main topbar navigation.
 * It includes the application logo, primary navigation links, an "Add Trade" button,
 * and the user menu. It is responsive and adapts for mobile viewing.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Home, LineChart, Menu, Package, Users, PlusCircle } from 'lucide-react';
import { UserMenu } from './user-menu';
import { useTradeForm } from '@/contexts/trade-form-context';
import { Logo } from '../logo';
import { AccountSwitcher } from './account-switcher';
import { useIsMobile } from '@/hooks/use-is-mobile';

export const Header = React.memo(function Header() {
    const pathname = usePathname();
    const { openForm } = useTradeForm();
    const isMobile = useIsMobile();

    const NAV_LINKS = [
      { href: '/dashboard', text: 'Dashboard', icon: Home },
      { href: '/journal', text: 'Journal', icon: Package },
      { href: '/analytics', text: 'Analytics', icon: LineChart },
      { href: '/performance', text: 'Performance', icon: Users },
      { href: '/settings', text: 'Settings', icon: Users }, // Using Users icon for settings as an example
    ];
    
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                     <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-lg font-semibold md:text-base"
                        >
                            <Logo />
                            <span className="sr-only">Anony Trading</span>
                        </Link>
                         {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "transition-colors hover:text-foreground",
                                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {link.text}
                            </Link>
                         ))}
                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <SheetClose asChild>
                                     <Link
                                        href="#"
                                        className="flex items-center gap-2 text-lg font-semibold"
                                    >
                                        <Logo />
                                        <span className="sr-only">Anony Trading</span>
                                    </Link>
                                </SheetClose>

                                {NAV_LINKS.map(link => (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                                pathname === link.href && "text-primary"
                                            )}
                                        >
                                            <link.icon className="h-4 w-4" />
                                            {link.text}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
                
                <div className="flex items-center gap-2">
                    <AccountSwitcher />
                    <Button onClick={() => openForm()} size={isMobile ? "icon" : "default"}>
                        <PlusCircle className={cn(!isMobile && "mr-2", "h-4 w-4")} />
                        <span className="hidden md:inline">Add Trade</span>
                    </Button>
                    <UserMenu />
                </div>
            </div>
        </header>
    );
});
