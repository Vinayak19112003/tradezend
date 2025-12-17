'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function SiteHeader() {
    const { user } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="rounded-lg bg-blue-600 p-1.5">
                        <BarChart2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">TradeZend</span>
                </Link>
                <nav className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link href="#testimonials" className="hover:text-white transition-colors">Success Stories</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">
                                {user ? 'Dashboard' : 'Log in'}
                            </Button>
                        </Link>
                        {!user && (
                            <Link href="/signup">
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-0">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
