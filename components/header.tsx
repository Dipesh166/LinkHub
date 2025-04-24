"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { toggleModal, setGeneratedLink } from "@/lib/features/modalSlice"
import { Button } from "@/components/ui/button"
import { Link2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"

export default function Header() {
  const dispatch = useDispatch()
  const username = useSelector((state: RootState) => state.user.username)
  const onboardingComplete = useSelector((state: RootState) => state.user.onboardingComplete)

  const handleGenerateLink = () => {
    if (username) {
      const uuid = uuidv4()
      dispatch(setGeneratedLink(uuid))
      dispatch(toggleModal())
    }
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
          className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          LinkHub
        </motion.div>

        {username && onboardingComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button
              onClick={handleGenerateLink}
              className="bg-white text-black hover:bg-gray-200 rounded-full font-medium"
            >
              <Link2 className="mr-2 h-4 w-4" /> Generate Link
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
