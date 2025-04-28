"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { addLink } from "@/lib/features/linksSlice"
import { toggleModal } from "@/lib/features/modalSlice"
import { Button } from "@/components/ui/button"
import { Link2, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export default function Header() {
  const dispatch = useDispatch()
  const username = useSelector((state: RootState) => state.user.username)
  const onboardingComplete = useSelector((state: RootState) => state.user.onboardingComplete)
  const theme = useSelector((state: RootState) => state.theme)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleGenerateLink = async () => {
    if (username && user) {
      const linkData = {
        id: uuidv4(),
        title: `${username}'s LinkHub`,
        url: `${window.location.origin}/preview/${user.uid}`,
      };

      // Add link to Redux store, which will trigger save to Firebase through editor panel
      dispatch(addLink(linkData));
      dispatch(toggleModal());
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navigateToHome = () => {
    router.push('/')
  }

  return (
    <motion.header
      className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={navigateToHome}
        >
          LinkHub
        </motion.div>

        <div className="flex items-center gap-4">
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400"
            >
              {user.email}
            </motion.div>
          )}

          {username && onboardingComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Button
                onClick={handleGenerateLink}
                className="bg-white text-black hover:bg-gray-200 rounded-full font-medium"
              >
                <Link2 className="mr-2 h-4 w-4" /> Generate Link
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
