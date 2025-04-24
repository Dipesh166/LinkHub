import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof Button>, "variant"> {
  asChild?: boolean
  intensity?: "low" | "medium" | "high"
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, intensity = "medium", asChild = false, size, children, ...props }, ref) => {
    const getIntensityClasses = () => {
      switch (intensity) {
        case "low":
          return "bg-white/5 hover:bg-white/10 backdrop-blur-sm border-white/10"
        case "high":
          return "bg-white/20 hover:bg-white/30 backdrop-blur-xl border-white/20"
        case "medium":
        default:
          return "bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/15"
      }
    }

    return (
      <Button
        ref={ref}
        className={cn("border shadow-sm shadow-black/10 text-white transition-all", getIntensityClasses(), className)}
        size={size}
        variant="ghost"
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

GlassButton.displayName = "GlassButton"

export { GlassButton }
