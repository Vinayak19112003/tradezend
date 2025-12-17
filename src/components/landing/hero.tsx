'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { GridBackground } from '@/components/ui/grid-background';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-100" fill="white" />
            <GridBackground />

            {/* Beating Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '7s' }} />

            <div className="container relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl px-3 py-1 text-sm font-medium text-blue-300 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse" />
                        New: AI-Powered Trade Analysis
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-6 max-w-4xl"
                >
                    Master Your Psychology. <br />
                    Automate Your Edge.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto mb-8"
                >
                    Stop trading blind. Use our AI-driven journal to identify your emotional triggers, track your setups, and scale your profitability with data-backed confidence.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
                >
                    <Link href="/signup">
                        <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 border border-blue-500/50">
                            Start Trading Smarter
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="text-zinc-500 text-sm flex items-center gap-4 mt-4 sm:mt-0">
                        <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> Free Forever Plan</span>
                        <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> No Credit Card</span>
                    </div>
                </motion.div>

                {/* Dashboard Preview Mockup with 3D Tilt Effect */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
                    className="mt-20 w-full max-w-6xl relative perspective-1000"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-purple-500/10 rounded-xl blur-3xl -z-10" />
                    <div className="relative rounded-xl border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] ring-1 ring-white/10 group">
                        {/* Fake UI Bars for "Real App" feel */}
                        <div className="absolute top-0 w-full h-8 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center pt-8">
                            <div className="text-center text-zinc-600">
                                <BarChart2 className="w-24 h-24 mx-auto mb-4 opacity-50 group-hover:text-blue-500 transition-colors duration-500" />
                                <p className="text-2xl font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Interactive Dashboard Preview</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
