import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "neobrutalism" | "softer";
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    variant = "default",
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl transition-all duration-300",
                hoverEffect && "hover:bg-zinc-900/70 hover:border-white/10 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {/* Optional Grain/Noise overlay could go here */}
            {children}
        </div>
    );
}

export function GlassCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function GlassCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)} {...props} />;
}

export function GlassCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pt-0 text-zinc-400", className)} {...props} />;
}
