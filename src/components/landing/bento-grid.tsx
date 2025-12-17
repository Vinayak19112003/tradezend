'use client';

import { cn } from "@/lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-2xl transition duration-500 shadow-input dark:shadow-none p-4 dark:bg-black/40 dark:border-white/[0.1] bg-white border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden backdrop-blur-md",
                className
            )}
        >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-blue-400 group-hover/bento:text-white group-hover/bento:bg-blue-500/20 transition-colors">
                    {icon}
                </div>
                <div className="font-sans font-bold text-neutral-200 mb-2 mt-2 text-lg">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-400 text-sm leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
