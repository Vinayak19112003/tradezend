'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-xl mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                        New: AI-Powered Trade Analysis
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl"
                >
                    Master Your Psychology. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Automate Your Edge.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl"
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
                        <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-105">
                            Start Trading Smarter
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="text-zinc-500 text-sm flex items-center gap-4 mt-4 sm:mt-0">
                        <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> Free Forever Plan</span>
                        <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> No Credit Card</span>
                    </div>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 w-full max-w-6xl relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-xl blur-lg opacity-75" />
                    <div className="relative rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                        {/* Placeholder for actual dashboard screenshot */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                            <div className="p-8 text-center text-zinc-600">
                                <BarChart2 className="w-24 h-24 mx-auto mb-4 opacity-50" />
                                <p className="text-2xl font-medium">Interactive Dashboard Preview</p>
                            </div>
                        </div>
                        {/* If you have a screenshot image, replace the above div with:
                 <Image src="/dashboard-mockup.png" alt="Dashboard" fill className="object-cover" /> 
                 */}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
