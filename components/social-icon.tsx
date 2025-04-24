"use client"

import {
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Twitch,
  DribbbleIcon,
  PinIcon as Pinterest,
} from "lucide-react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { GlassButton } from "@/components/ui/glass-button"

interface SocialIconProps {
  platform: string
  username: string
  displayStyle?: "icon" | "button" | "pill"
}

export function SocialIcon({ platform, username, displayStyle = "icon" }: SocialIconProps) {
  const theme = useSelector((state: RootState) => state.theme)

  const getIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "youtube":
        return <Youtube className="h-5 w-5" />
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "twitch":
        return <Twitch className="h-5 w-5" />
      case "dribbble":
        return <DribbbleIcon className="h-5 w-5" />
      case "pinterest":
        return <Pinterest className="h-5 w-5" />
      default:
        return <Instagram className="h-5 w-5" />
    }
  }

  const getPlatformName = () => {
    switch (platform) {
      case "instagram":
        return "Instagram"
      case "twitter":
        return "Twitter"
      case "linkedin":
        return "LinkedIn"
      case "github":
        return "GitHub"
      case "youtube":
        return "YouTube"
      case "facebook":
        return "Facebook"
      case "twitch":
        return "Twitch"
      case "dribbble":
        return "Dribbble"
      case "pinterest":
        return "Pinterest"
      default:
        return platform
    }
  }

  const getUrl = () => {
    switch (platform) {
      case "instagram":
        return `https://instagram.com/${username}`
      case "twitter":
        return `https://twitter.com/${username}`
      case "linkedin":
        return `https://linkedin.com/in/${username}`
      case "github":
        return `https://github.com/${username}`
      case "youtube":
        return `https://youtube.com/@${username}`
      case "facebook":
        return `https://facebook.com/${username}`
      case "twitch":
        return `https://twitch.tv/${username}`
      case "dribbble":
        return `https://dribbble.com/${username}`
      case "pinterest":
        return `https://pinterest.com/${username}`
      default:
        return "#"
    }
  }

  const getButtonClass = () => {
    if (displayStyle === "pill") {
      return "rounded-full"
    }
    return "rounded-md"
  }

  const getIconColor = () => {
    switch (platform) {
      case "instagram":
        return "text-pink-400"
      case "twitter":
        return "text-blue-400"
      case "linkedin":
        return "text-blue-500"
      case "github":
        return "text-gray-200"
      case "youtube":
        return "text-red-500"
      case "facebook":
        return "text-blue-600"
      case "twitch":
        return "text-purple-500"
      case "dribbble":
        return "text-pink-500"
      case "pinterest":
        return "text-red-600"
      default:
        return ""
    }
  }

  if (displayStyle === "icon") {
    return (
      <motion.a
        href={getUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {getIcon()}
      </motion.a>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
      <GlassButton
        asChild
        className={`w-full ${getButtonClass()} flex items-center gap-3 justify-center`}
        intensity="medium"
      >
        <a href={getUrl()} target="_blank" rel="noopener noreferrer">
          <span className={getIconColor()}>{getIcon()}</span>
          <span>{getPlatformName()}</span>
        </a>
      </GlassButton>
    </motion.div>
  )
}

export default SocialIcon
