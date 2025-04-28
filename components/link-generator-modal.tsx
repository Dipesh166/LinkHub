"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { toggleModal } from "@/lib/features/modalSlice"
import { Button } from "@/components/ui/button"
import { Copy, Check, X, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"

export default function LinkGeneratorModal() {
  const dispatch = useDispatch()
  const generatedLink = useSelector((state: RootState) => state.modal.generatedLink)
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const fullLink = user ? `${window.location.origin}/preview/${user.uid}` : ""

  const handleCopy = () => {
    if (fullLink) {
      navigator.clipboard.writeText(fullLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    dispatch(toggleModal())
  }

  const handleOpenPreview = () => {
    if (user) {
      window.open(`/preview/${user.uid}`, "_blank")
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md relative border border-white/10 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your Shareable Link
            </h2>
            <p className="text-gray-400 mb-6">Share this link with others to show your LinkHub page</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-nowrap font-mono text-sm">
                {fullLink}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-white/20 text-white hover:bg-white hover:text-black transition-all"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <Button
              className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium"
              onClick={handleOpenPreview}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Open Preview
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
