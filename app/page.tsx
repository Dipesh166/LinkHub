"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import OnboardingForm from "@/components/onboarding-form"
import EditorPage from "@/components/editor-page"
import HomePage from "@/components/home-page"

export default function Home() {
  const router = useRouter()
  const username = useSelector((state: RootState) => state.user.username)
  const onboardingComplete = useSelector((state: RootState) => state.user.onboardingComplete)
  const generatedLink = useSelector((state: RootState) => state.modal.generatedLink)

  useEffect(() => {
    if (generatedLink) {
      router.push(`/preview/${generatedLink}`)
    }
  }, [generatedLink, router])

  // If no username, show the home page with the username form
  if (!username) {
    return <HomePage />
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {!onboardingComplete ? <OnboardingForm /> : <EditorPage />}
    </main>
  )
}
