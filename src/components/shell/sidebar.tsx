"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, LineChart, Package, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/journal", label: "Journal", icon: Package },
    { href: "/analytics", label: "Analytics", icon: LineChart },
    { href: "/performance", label: "Performance", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
];

const NavLink = ({ href, icon: Icon, children, closeSheet }: { href: string; icon: React.ElementType, children: React.ReactNode, closeSheet: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Button
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={closeSheet}
        >
            <a href={href}>
                <Icon className="h-4 w-4" />
                {children}
            </a>
        </Button>
    )
};


export function Sidebar() {
    const [isOpen, setIsOpen] = React.useState(false);

    const closeSheet = () => setIsOpen(false);
  
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    {NAV_ITEMS.map(item => (
                        <NavLink key={item.href} href={item.href} icon={item.icon} closeSheet={closeSheet}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </SheetContent>
      </Sheet>
    )
}
