
'use client';
import { cn } from "@/lib/utils";
import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export default function ShimmerButton({
    children,
    className,
    ...props
}: ShimmerButtonProps) {
  return (
    <button {...props} className={cn("relative inline-flex items-center justify-center p-[1px] bg-card-foreground/10 dark:bg-black rounded-lg overflow-hidden group", className)}>
        <div 
          className="absolute inset-[-150%] animate-[shimmer-spin_2.5s_linear_infinite]"
          style={{
            background: 'conic-gradient(from var(--angle), transparent 25%, hsl(var(--primary)), transparent 50%)',
          }}
        />
        <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-4 py-2 text-sm font-medium text-foreground bg-card rounded-[7px] group-hover:bg-muted transition-colors duration-300">
          {children}
        </span>
      </button>
  );
}
