
"use client";

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    return (
        <div
            ref={ref}
            onMouseMove={(e) => {
                const { left, top } = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - left);
                mouseY.set(e.clientY - top);
            }}
            className={cn(
            "group relative w-full rounded-2xl border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10",
            className
            )}
            {...props}
        >
             <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(400px at ${mouseX}px ${mouseY}px, hsl(var(--primary) / 0.15), transparent 80%)
                    `,
                }}
            />
            <div className="relative z-10">{props.children}</div>
        </div>
    )
})
InteractiveCard.displayName = "InteractiveCard"

export { InteractiveCard }
