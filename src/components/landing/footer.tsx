'use client';

import Link from 'next/link';
import { BarChart2, Github, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black py-12 border-t border-white/10">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="rounded-lg bg-blue-600 p-1.5">
                                <BarChart2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">TradeZend</span>
                        </Link>
                        <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
                            The professional's choice for trade journaling and performance analytics. Master your psychology, master the markets.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li><Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                            <li><Link href="/changelog" className="hover:text-blue-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-sm">
                        © {new Date().getFullYear()} TradeZend. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-zinc-500 text-xs font-mono">SYSTEM OPERATIONAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
