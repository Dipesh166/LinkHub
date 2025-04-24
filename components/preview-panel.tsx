"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import Image from "next/image"
import { Edit } from "lucide-react"
import LinkButton from "@/components/link-button"
import { motion } from "framer-motion"
import { gradients } from "@/lib/features/themeSlice"
import SocialIcon from "@/components/social-icon"
import { GlassButton } from "@/components/ui/glass-button"

interface PreviewPanelProps {
  onToggleView?: () => void
}

export default function PreviewPanel({ onToggleView }: PreviewPanelProps) {
  const { username, bio, profession, profileImage, socialHandles } = useSelector((state: RootState) => state.user)
  const links = useSelector((state: RootState) => state.links)
  const theme = useSelector((state: RootState) => state.theme)

  const getBackgroundStyle = () => {
    if (theme.background === "image" && theme.backgroundImage) {
      return {
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }

    if (theme.background === "gradient") {
      if (theme.useCustomGradient) {
        const { color1, color2, angle } = theme.customGradient
        return { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }
      } else {
        return { background: gradients[theme.gradientStyle as keyof typeof gradients] || gradients.midnight }
      }
    }

    return { background: "#000000" }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          className="rounded-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={getBackgroundStyle()}
        >
          {/* Background layers with proper z-index */}
          {theme.background === "image" && theme.backgroundImage && (
            <>
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${theme.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: `blur(${theme.blurAmount}px)`,
                }}
              ></div>
              <div className="absolute inset-0 bg-black z-10" style={{ opacity: theme.opacity }}></div>
            </>
          )}

          <motion.div
            className="flex flex-col items-center gap-6 relative z-20 p-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Content layers with increased z-index */}
            {profileImage && (
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-lg relative z-30"
                variants={item}
              >
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt={username || "Profile"}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            <motion.div className="text-center" variants={item}>
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              {profession && <p className="text-sm text-gray-300 mt-1">{profession}</p>}
            </motion.div>

            {bio && (
              <motion.p className="text-center text-sm text-gray-200 max-w-xs" variants={item}>
                {bio}
              </motion.p>
            )}

            {socialHandles.length > 0 && (
              <motion.div className="flex gap-4 my-4" variants={item}>
                {socialHandles.map((handle, index) => (
                  <SocialIcon 
                    key={index}
                    platform={handle.platform}
                    username={handle.username}
                    displayStyle="icon"
                  />
                ))}
              </motion.div>
            )}

            <motion.div className="w-full space-y-4 my-4" variants={container}>
              {links.map((link, index) => (
                <motion.div key={link.id} variants={item} custom={index}>
                  <LinkButton
                    title={link.title}
                    url={link.url}
                    buttonStyle={theme.buttonStyle}
                    animation={theme.animation}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {onToggleView && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 relative z-30"
        >
          <GlassButton onClick={onToggleView} className="rounded-full font-medium" intensity="high">
            <Edit className="mr-2 h-4 w-4" /> Back to Editor
          </GlassButton>
        </motion.div>
      )}
    </div>
  )
}
