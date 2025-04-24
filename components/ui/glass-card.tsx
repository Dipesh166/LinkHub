import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"
  children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "medium", children, ...props }, ref) => {
    const getIntensityClasses = () => {
      switch (intensity) {
        case "low":
          return "bg-white/5 backdrop-blur-sm border-white/10"
        case "high":
          return "bg-white/15 backdrop-blur-xl border-white/20"
        case "medium":
        default:
          return "bg-white/10 backdrop-blur-md border-white/15"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("rounded-xl border shadow-lg shadow-black/10", getIntensityClasses(), className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
