import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    action,
    className,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8", className)} {...props}>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold tracking-tight text-white font-headline">
                    {title}
                </h1>
                {description && (
                    <p className="text-zinc-400 text-base max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <div className="flex items-center gap-2">
                    {action}
                </div>
            )}
        </div>
    );
}
