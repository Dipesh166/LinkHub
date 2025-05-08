"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import LinkButton from "@/components/link-button"
import { motion } from "framer-motion"
import { gradients } from "@/lib/features/themeSlice"
import SocialIcon from "@/components/social-icon"
import { getPublicPage, getPublicPageBySlug } from "@/lib/services/firebase-service"
import type { UserData } from "@/lib/services/firebase-service"
import { useAuth } from "@/lib/AuthContext"
import { use } from 'react'
import { Share2 } from 'lucide-react';

interface PageParams {
  pageId: string
}

type GradientStyle = keyof typeof gradients

export default function Page({ params }: { params: PageParams | Promise<PageParams> }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [pageData, setPageData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Properly unwrap params using React.use()
  const { pageId } = use(params as Promise<PageParams>)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Try to split as userId_profileId
        const [userId, profileId] = pageId.split('_')
        let data = null

        if (userId && profileId) {
          data = await getPublicPage(userId, profileId)
        } else {
          // If not a combo, treat as slug (force lowercase)
          data = await getPublicPageBySlug(pageId.toLowerCase())
        }

        // Add this line to log the result of getPublicPageBySlug
        if (!userId || !profileId) {
          console.log("Fetched data using getPublicPageBySlug:", data)
        }

        if (data) {
          setPageData(data)
        } else {
          setError("Page not found")
          setTimeout(() => {
            router.push("/")
          }, 3000)
        }
      } catch (err) {
        setError("Something went wrong")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPageData()
  }, [pageId, router])

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  // Show error state if data fetch failed
  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
          <p className="text-gray-400">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  const getBackgroundStyle = () => {
    if (pageData.theme.background === "image" && pageData.theme.backgroundImage) {
      return {
        backgroundImage: `url(${pageData.theme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }

    if (pageData.theme.background === "gradient") {
      if (pageData.theme.useCustomGradient && pageData.theme.customGradient) {
        const { color1, color2, angle } = pageData.theme.customGradient
        return { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }
      }
      const style = pageData.theme.gradientStyle as GradientStyle
      return { background: gradients[style] || gradients.midnight }
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
    <div className="min-h-screen flex flex-col items-center p-6 relative" style={getBackgroundStyle()}>
      {/* Background overlay for image backgrounds */}
      {pageData.theme.background === "image" && pageData.theme.backgroundImage && (
        <>
          <div
            className="absolute inset-0"
            style={{
              zIndex: 0,
              backgroundImage: `url(${pageData.theme.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: `blur(${pageData.theme.blurAmount}px)`,
            }}
          ></div>
          <div
            className="absolute inset-0 bg-black"
            style={{ zIndex: 1, opacity: pageData.theme.opacity }}
          ></div>
        </>
      )}

      <motion.div
        className="w-full max-w-md flex flex-col items-center gap-6 mt-10 relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Add Share Button at the top */}
        <motion.button
          className="absolute top-0 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={async () => {
            const url = window.location.href;
            const title = `${pageData.username}'s LinkHub Profile`;
            const text = `Check out ${pageData.username}'s LinkHub profile!`;

            try {
              if (navigator.share) {
                // Use native share on mobile devices
                await navigator.share({
                  title,
                  text,
                  url
                });
              } else {
                // Fallback for desktop - copy to clipboard
                await navigator.clipboard.writeText(url);
                // You might want to add a toast notification here
                alert('Link copied to clipboard!');
              }
            } catch (error) {
              console.error('Error sharing:', error);
            }
          }}
        >
          <Share2 className="w-5 h-5 text-white" />
        </motion.button>

        {/* Profile Image */}
        {pageData.profileImage && (
          <motion.div
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-lg"
            variants={item}
          >
            <Image
              src={pageData.profileImage || "/placeholder.svg"}
              alt={pageData.username || "Profile"}
              width={100}
              height={100}
              className="w-full h-full object-cover"
              unoptimized={pageData.profileImage?.startsWith('data:')}
            />
          </motion.div>
        )}

        {/* Username and Profession */}
        <motion.div className="text-center" variants={item}>
          <h1 className="text-2xl font-bold text-white">{pageData.username}</h1>
          {pageData.profession && (
            <p className="text-sm text-gray-300 mt-1">{pageData.profession}</p>
          )}
        </motion.div>

        {/* Bio */}
        {pageData.bio && (
          <motion.p 
            className="text-center text-sm text-gray-200 max-w-xs" 
            variants={item}
          >
            {pageData.bio}
          </motion.p>
        )}

        {/* Social Handles */}
        {pageData.socialHandles && pageData.socialHandles.length > 0 && (
          <motion.div className="flex gap-4 my-4" variants={item}>
            {pageData.socialHandles.map((handle, index) => (
              <SocialIcon
                key={index}
                platform={handle.platform}
                username={handle.url}
                displayStyle="icon"
              />
            ))}
          </motion.div>
        )}

        {/* Links */}
        <motion.div className="w-full space-y-4 my-6" variants={container}>
          {pageData.links && pageData.links.map((link, index) => (
            <motion.div key={link.id} variants={item} custom={index}>
              <LinkButton
                title={link.title}
                url={link.url}
                buttonStyle={pageData.theme.buttonStyle}
                animation={pageData.theme.animation}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Add this footer at the very end */}
      <footer className="w-full text-center mt-10 mb-2 text-sm text-gray-400 z-20 opacity-30">
        Made with <span className="text-red-500">❤️</span> by Dipesh Kumar Mandal
      </footer>
    </div>
  )
}