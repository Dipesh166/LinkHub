"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { toggleModal } from "@/lib/features/modalSlice"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, X, Share2, Twitter, Facebook, Linkedin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import QRCode from "react-qr-code"

export default function LinkGeneratorModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profileId = useSelector((state: RootState) => state.user.id);

  // Check if window is available
  const isWindowAvailable = () => {
    return typeof window !== 'undefined';
  };

  if (!isOpen || !user) return null;

  const getShareableLink = () => {
    if (!user?.uid || !profileId) return '';
    if (!isWindowAvailable()) return '';
    
    const protocol = window.location.protocol;
    const hostname = window.location.host;
    return `${protocol}//${hostname}/${user.uid}_${profileId}`;
  };

  const handlePreviewOpen = () => {
    setIsLoading(true);
    if (isWindowAvailable()) {
      window.open(getShareableLink(), '_blank');
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCopy = () => {
    const link = getShareableLink();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    dispatch(toggleModal());
  };

  const handleShare = (platform: string) => {
    if (!isWindowAvailable()) return;
    const url = getShareableLink();
    if (!url) return;
    
    const text = "Check out my LinkHub page!";
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />
        
        <motion.div
          className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl w-full max-w-md relative border border-white/10 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-200 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              Your Preview Link
            </h2>
            <p className="text-gray-400">Share your LinkHub page with the world</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 space-y-6"
          >
            <div className="space-y-4">
              <div className="group relative flex items-center gap-2 bg-black/50 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex-1 font-mono text-sm text-gray-300 overflow-x-auto whitespace-nowrap">
                  {getShareableLink()}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="border-white/20 text-white hover:bg-white hover:text-black transition-all"
                >
                  {copied ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Button
                onClick={handlePreviewOpen}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-6 relative overflow-hidden group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-white/20 to-violet-600/0"
                    animate={{ x: ["0%", "200%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : null}
                <span className="relative">Open Preview</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0A0A0F] px-4 text-sm text-gray-400">Share on social media</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20 transition-colors"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                  onClick={() => handleShare('linkedin')}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-black p-6 rounded-lg flex items-center justify-center">
                <QRCode
                  value={getShareableLink()}
                  size={200}
                  level="M"
                  fgColor="#fff"
                  bgColor="transparent"
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%"
                  }}
                  viewBox="0 0 256 256"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
