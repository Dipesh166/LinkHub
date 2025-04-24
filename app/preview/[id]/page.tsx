"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/lib/store"
import Image from "next/image"
import LinkButton from "@/components/link-button"
import { motion } from "framer-motion"
import { gradients } from "@/lib/features/themeSlice"
import SocialIcon from "@/components/social-icon"
import { use } from 'react'

interface PageParams {
  id: string;
}

export default function PreviewPage({ params }: { params: PageParams }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { username, bio, profession, profileImage, socialHandles } = useSelector((state: RootState) => state.user)
  const links = useSelector((state: RootState) => state.links)
  const theme = useSelector((state: RootState) => state.theme)
  const generatedLink = useSelector((state: RootState) => state.modal.generatedLink)
  
  // Properly unwrap params using React.use()
  const { id } = use(params as Promise<PageParams>)

  useEffect(() => {
    setIsClient(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      if ((!generatedLink || id !== generatedLink) && !username) {
        router.push("/")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [generatedLink, id, router, username])

  if (!isClient || isLoading) {
    return (
      <>
      </>
    )
  }

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
      return { background: gradients[theme.gradientStyle as keyof typeof gradients] || gradients.midnight }
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
    <div className="min-h-screen flex flex-col items-center p-6" style={getBackgroundStyle()}>
      {/* Add an overlay for better text readability when using background image */}
      {theme.background === "image" && theme.backgroundImage && (
        <div className="absolute inset-0 bg-black" style={{ opacity: theme.opacity }}></div>
      )}

      <motion.div
        className="w-full max-w-md flex flex-col items-center gap-6 mt-10 relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {profileImage && (
          <motion.div
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-lg"
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

        {/* Add Social Media Links */}
        {socialHandles && socialHandles.length > 0 && (
          <motion.div className="flex gap-4 my-4" variants={item}>
            {socialHandles.map((handle, index) => (
              <SocialIcon 
                key={index}
                platform={handle.platform}
                url={handle.url}
                displayStyle="icon"
              />
            ))}
          </motion.div>
        )}

        <motion.div className="w-full space-y-4 my-6" variants={container}>
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
    </div>
  )
}
