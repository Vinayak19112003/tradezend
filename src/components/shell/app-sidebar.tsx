"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    BarChart2,
    Settings,
    ChevronLeft,
    Menu,
    LogOut,
    User,
    LineChart
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTradeForm } from "@/contexts/trade-form-context";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AccountSwitcher } from "./account-switcher";
import { UserMenu } from "./user-menu";
import { Logo } from "../logo";

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Journal", icon: BookOpen, href: "/journal" },
    { label: "Performance", icon: BarChart2, href: "/analytics" },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { openForm } = useTradeForm();

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <aside
            className={cn(
                "group/sidebar h-screen sticky top-0 bg-black/60 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 z-50",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-white/5 relative">
                <NextLink href="/dashboard" className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0">
                        <Logo />
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-bold text-xl tracking-tight text-white whitespace-nowrap"
                        >
                            TradeZend
                        </motion.span>
                    )}
                </NextLink>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
                    onClick={toggleCollapse}
                >
                    <ChevronLeft className={cn("h-3 w-3 transition-transform", isCollapsed && "rotate-180")} />
                </Button>
            </div>

            {/* Account Switcher Area */}
            <div className="p-4 border-b border-white/5">
                {!isCollapsed ? (
                    <AccountSwitcher />
                ) : (
                    <div className="flex justify-center">
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 rounded-full">
                            <User className="h-5 w-5 text-zinc-400" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-6 px-3">
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <NextLink key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start h-12 mb-1",
                                        isCollapsed ? "justify-center px-0" : "px-4",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 border border-blue-600/20 shadow-[0_0_15px_-3px_rgba(37,99,235,0.2)]"
                                            : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-blue-500" : "text-zinc-500")} />
                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium transition-all duration-300">
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            layoutId="active-nav-indicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                                        />
                                    )}
                                </Button>
                            </NextLink>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/5 space-y-4 bg-zinc-950/30">
                {/* Add Trade Button */}
                <Button
                    onClick={() => openForm()}
                    className={cn(
                        "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border-0 transition-all duration-300",
                        isCollapsed ? "h-12 w-12 rounded-xl p-0" : "h-11"
                    )}
                >
                    {isCollapsed ? (
                        <div className="bg-white/20 p-2 rounded-full">
                            <span className="text-lg leading-none">+</span>
                        </div>
                    ) : (
                        <span className="font-semibold tracking-wide">New Trade</span>
                    )}
                </Button>

                {/* User Menu */}
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    <UserMenu showLabel={!isCollapsed} />
                </div>
            </div>
        </aside>
    );
}
