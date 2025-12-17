'use client';

import { BarChart3, BrainCircuit, LineChart, Lock, ScrollText, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <BrainCircuit className="w-8 h-8 text-blue-500" />,
        title: "AI-Powered Analysis",
        description: "Our AI analyzes your trading patterns, identifying emotional leaks and suggesting concrete improvements."
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
        title: "Advanced Analytics",
        description: "Go beyond simple P&L. Track your win rate, profit factor, R-multiple, and drawdown across multiple accounts."
    },
    {
        icon: <ScrollText className="w-8 h-8 text-pink-500" />,
        title: "Detailed Journaling",
        description: "Capture the 'Why' behind every trade. Log entry reasons, emotional states, and market context."
    },
    {
        icon: <Timer className="w-8 h-8 text-orange-500" />,
        title: "Execution Speed",
        description: "Optimized for valid setups. Quickly enter trade details without slowing down your workflow."
    },
    {
        icon: <LineChart className="w-8 h-8 text-green-500" />,
        title: "Equity Curves",
        description: "Visualize your growth over time. Compare theoretical performance vs. actual results."
    },
    {
        icon: <Lock className="w-8 h-8 text-cyan-500" />,
        title: "Bank-Grade Security",
        description: "Your data is encrypted and isolated. Row-Level Security ensures only you can access your journal."
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-zinc-950">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                        Everything you need to <span className="text-blue-500">Scale Up</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Stop using spreadsheets. Upgrade to a professional trading ops platform designed for serious profitability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-blue-500/30 transition-all duration-300"
                        >
                            <div className="mb-4 p-3 rounded-xl bg-zinc-950 w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
