'use client';

import { BarChart3, BrainCircuit, LineChart, Lock, ScrollText, Timer } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/landing/bento-grid';

const features = [
    {
        icon: <BrainCircuit className="w-8 h-8 text-neutral-200" />,
        title: "AI-Powered Analysis",
        description: "Our AI analyzes your trading patterns, identifying emotional leaks and suggesting concrete improvements.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10" />
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-neutral-200" />,
        title: "Advanced Analytics",
        description: "Go beyond simple P&L. Track your win rate, profit factor, R-multiple, and drawdown across multiple accounts.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10" />
    },
    {
        icon: <ScrollText className="w-8 h-8 text-neutral-200" />,
        title: "Detailed Journaling",
        description: "Capture the 'Why' behind every trade. Log entry reasons, emotional states, and market context.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10" />
    },
    {
        icon: <Timer className="w-8 h-8 text-neutral-200" />,
        title: "Execution Speed",
        description: "Optimized for valid setups. Quickly enter trade details without slowing down your workflow.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10" />
    },
    {
        icon: <LineChart className="w-8 h-8 text-neutral-200" />,
        title: "Equity Curves",
        description: "Visualize your growth over time. Compare theoretical performance vs. actual results.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/10" />
    },
    {
        icon: <Lock className="w-8 h-8 text-neutral-200" />,
        title: "Bank-Grade Security",
        description: "Your data is encrypted and isolated. Row-Level Security ensures only you can access your journal.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-white/10" />
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-black">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
                        Everything for the <br /><span className="text-blue-500">Professional Trader</span>
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Stop using spreadsheets. Upgrade to a trading ops platform designed for serious profitability.
                    </p>
                </div>

                <BentoGrid>
                    {features.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
