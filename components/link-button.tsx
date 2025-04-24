"use client"

import { motion } from "framer-motion"
import { GlassButton } from "@/components/ui/glass-button"

interface LinkButtonProps {
  title: string
  url: string
  buttonStyle: string
  animation: string
}

export default function LinkButton({ title, url, buttonStyle, animation }: LinkButtonProps) {
  const getButtonClass = () => {
    let baseClass = "w-full"

    // Button style
    switch (buttonStyle) {
      case "pill":
        baseClass += " rounded-full"
        break
      case "outline":
        baseClass += " border-2"
        break
      default: // rounded
        baseClass += " rounded-md"
        break
    }

    return baseClass
  }

  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return {
          whileHover: { opacity: 0.8 },
        }
      case "scale":
        return {
          whileHover: { scale: 1.05 },
        }
      case "slide":
        return {
          whileHover: { x: 5 },
        }
      case "bounce":
        return {
          whileHover: { y: -5 },
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }
      default:
        return {}
    }
  }

  return (
    <motion.div {...getAnimationProps()}>
      <GlassButton asChild className={getButtonClass()} intensity="medium">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </GlassButton>
    </motion.div>
  )
}
