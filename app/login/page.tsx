"use client"

import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [error, setError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      await resetPassword(email)
      setResetSuccess(true)
      // Show success message for 3 seconds then return to login
      setTimeout(() => {
        setIsResetPassword(false)
        setResetSuccess(false)
      }, 3000)
    } catch (err) {
      if (err instanceof Error) {
        switch ((err as any).code) {
          case 'auth/user-not-found':
            setError("No account exists with this email.")
            break
          case 'auth/invalid-email':
            setError("Please enter a valid email address.")
            break
          default:
            setError("Failed to send reset email. Please try again.")
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isSignUp) {
        await signUp(email, password)
        // New users go directly to dashboard
        router.push("/dashboard")
      } else {
        await signIn(email, password)
        // Existing users go to dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      // Handle specific Firebase auth errors
      if (err instanceof Error) {
        const errorCode = (err as any).code;
        switch (errorCode) {
          case 'auth/user-not-found':
            setError("No account exists with this email. Please sign up first.");
            break;
          case 'auth/wrong-password':
            setError("Incorrect password. Please try again.");
            break;
          case 'auth/invalid-email':
            setError("Invalid email address.");
            break;
          case 'auth/weak-password':
            setError("Password should be at least 6 characters.");
            break;
          case 'auth/email-already-in-use':
            setError("An account already exists with this email.");
            break;
          default:
            setError("An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  if (isResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 to-black">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}
            
            {resetSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-md mb-4 text-sm"
              >
                Reset link sent! Check your email.
              </motion.div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Send Reset Link
              </Button>

              <button
                type="button"
                onClick={() => setIsResetPassword(false)}
                className="w-full text-sm text-gray-400 hover:text-white mt-4"
              >
                Back to login
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 to-black">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/50">
        <CardHeader>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
              <CardDescription>
                {isSignUp 
                  ? "Create a new account to manage your links" 
                  : "Sign in to manage your LinkTree"}
              </CardDescription>
            </motion.div>
          </AnimatePresence>
        </CardHeader>
        <CardContent>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-white"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setIsResetPassword(true)}
                className="block w-full text-sm text-gray-400 hover:text-white mt-2"
              >
                Forgot your password?
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

  