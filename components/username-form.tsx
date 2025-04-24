"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setUsername } from "@/lib/features/userSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function UsernameForm() {
  const [name, setName] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      dispatch(setUsername(name.trim()))
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome to LinkHub
          </h1>
          <p className="text-gray-400 text-center mb-8">Create your minimalist link-sharing page in seconds</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-300">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800/50 border-gray-700/50 text-white focus:ring-white/25 focus:border-white/25 transition-all"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 transition-all rounded-full font-medium"
          >
            Continue
          </Button>
        </motion.form>
      </motion.div>
    </div>
  )
}
