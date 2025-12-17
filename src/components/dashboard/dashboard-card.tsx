import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value: string | number | ReactNode;
    subtitle?: string | ReactNode;
    icon?: ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    className?: string;
    action?: ReactNode;
}

export function DashboardCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendValue,
    className,
    action,
}: DashboardCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 shadow-xl transition-all hover:border-white/10 hover:shadow-2xl hover:bg-zinc-900/60 group",
                className
            )}
        >
            {/* Glossy sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">{value}</div>
                    {subtitle && <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>}
                </div>

                {icon && (
                    <div className={cn(
                        "p-2.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 group-hover:scale-110 transition-transform duration-300",
                        trend === 'up' && "text-green-500 bg-green-500/10 border-green-500/20",
                        trend === 'down' && "text-red-500 bg-red-500/10 border-red-500/20",
                    )}>
                        {icon}
                    </div>
                )}
            </div>

            {(trendValue || action) && (
                <div className="mt-4 flex items-center justify-between">
                    {trendValue && (
                        <div className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full border",
                            trend === 'up' && "text-green-400 border-green-500/20 bg-green-500/10",
                            trend === 'down' && "text-red-400 border-red-500/20 bg-red-500/10",
                            trend === 'neutral' && "text-zinc-400 border-zinc-500/20 bg-zinc-500/10",
                        )}>
                            {trendValue}
                        </div>
                    )}
                    {action && (
                        <div>{action}</div>
                    )}
                </div>
            )}
        </div>
    );
}
