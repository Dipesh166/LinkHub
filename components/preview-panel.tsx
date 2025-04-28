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
          className="rounded-xl overflow-hidden relative shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={getBackgroundStyle()}
        >
          {/* Background layers with proper z-index */}
          {theme.background === "image" && theme.backgroundImage && (
            <>
              <div
                className="absolute inset-0"
                style={{
                  zIndex: 0,
                  backgroundImage: `url(${theme.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: `blur(${theme.blurAmount}px)`,
                }}
              ></div>
              <div
                className="absolute inset-0 bg-black"
                style={{ zIndex: 1, opacity: theme.opacity }}
              ></div>
            </>
          )}

          {/* Content layers with increased z-index */}
          <motion.div
            className="flex flex-col items-center gap-6 relative p-8 md:p-10"
            style={{ zIndex: 2 }}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {profileImage && (
              <motion.div
                className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-xl relative"
                variants={item}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none"></div>
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt={username || "Profile"}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            <motion.div className="text-center" variants={item}>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{username}</h1>
              {profession && (
                <p className="text-sm md:text-base text-gray-300 mt-1 font-medium tracking-wide">
                  {profession}
                </p>
              )}
            </motion.div>

            {bio && (
              <motion.p 
                className="text-center text-sm md:text-base text-gray-200 max-w-xs font-light leading-relaxed"
                variants={item}
              >
                {bio}
              </motion.p>
            )}

            {socialHandles.length > 0 && (
              <motion.div 
                className="flex gap-5 my-4" 
                variants={item}
              >
                {socialHandles.map((handle, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <SocialIcon 
                      platform={handle.platform}
                      url={handle.url}
                      displayStyle="icon"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div className="w-full space-y-4 my-4" variants={container}>
              {links.map((link, index) => (
                <motion.div 
                  key={link.id} 
                  variants={item} 
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
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
          className="mt-8 relative"
          style={{ zIndex: 10 }}
        >
          <GlassButton 
            onClick={onToggleView} 
            className="rounded-full font-medium px-6 py-2.5 shadow-lg" 
            intensity="high"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit className="mr-2 h-4 w-4" /> Back to Editor
          </GlassButton>
        </motion.div>
      )}
    </div>
  )
}
