"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { useAuth } from "@/lib/AuthContext"
import { getUserProfile } from "@/lib/services/firebase-service"
import { setUserInfo } from "@/lib/features/userSlice"
import OnboardingForm from "@/components/onboarding-form"
import HomePage from "@/components/home-page"

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const onboardingComplete = useSelector((state: RootState) => state.user.onboardingComplete)

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user?.uid) {
        try {
          const userProfile = await getUserProfile(user.uid)
          if (userProfile) {
            // User exists in Firebase, update Redux state and redirect to dashboard
            dispatch(setUserInfo({
              username: userProfile.username,
              bio: userProfile.bio,
              profession: userProfile.profession,
              socialHandles: userProfile.socialHandles || [],
              onboardingComplete: true
            }))
            router.push('/dashboard')
            return
          }
        } catch (error) {
          console.error('Error checking user profile:', error)
        }
      }
    }

    checkUserProfile()
  }, [user, dispatch, router])

  // If no user, show the home page
  if (!user) {
    return <HomePage />
  }

  // Show onboarding form if user hasn't completed it
  if (!onboardingComplete) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <OnboardingForm />
      </main>
    )
  }

  return null
}
