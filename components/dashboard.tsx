"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Plus, Settings, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserProfile } from "@/lib/services/firebase-service"
import { GlassCard } from "@/components/ui/glass-card"
import { Alert } from "@/components/ui/alert"
import Header from "@/components/header"
import { setUserInfo } from "@/lib/features/userSlice"

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [activeTab, setActiveTab] = useState('generated')
  const [showLimitAlert, setShowLimitAlert] = useState(false)

  useEffect(() => {
    const fetchUserLinks = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const userProfile = await getUserProfile(user.uid, user.uid)
        if (userProfile) {
          setLinks(userProfile.links || [])
          // Update Redux state with user info
          dispatch(setUserInfo({
            id: user.uid,
            username: userProfile.username,
            bio: userProfile.bio || '',
            profession: userProfile.profession || '',
            profileImage: userProfile.profileImage,
            profileImageId: userProfile.profileImageId,
            socialHandles: userProfile.socialHandles || [],
            links: userProfile.links || [],
            theme: userProfile.theme
          }))
        }
      } catch (error) {
        console.error('Error fetching user links:', error)
      }
    }

    fetchUserLinks()
  }, [user, dispatch, router])

  const handleCreateClick = async () => {
    if (links.length >= 3) {
      setShowLimitAlert(true)
      setTimeout(() => setShowLimitAlert(false), 5000)
      return
    }

    if (user) {
      try {
        const profile = await getUserProfile(user.uid, user.uid)
        if (!profile || !profile.username) {
          // If no profile exists or username not set, go to onboarding
          router.push('/onboarding')
        } else {
          // If profile exists, go directly to editor with the profile ID
          router.push(`/Editor?profileId=${user.uid}`)
        }
      } catch (error) {
        console.error('Error checking user profile:', error)
        router.push('/onboarding')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0F]">
      <Header />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {showLimitAlert && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <span>You can only create up to 3 links. Please delete an existing link to create a new one.</span>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <GlassCard key={link.id} className="p-6 hover:border-purple-500/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">{link.title}</h3>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 text-sm break-all"
                >
                  {link.url}
                </a>
              </GlassCard>
            ))}
            
            {/* Create New Link Card */}
            <button
              onClick={handleCreateClick}
              className={`bg-[#151520] rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#1a1a2a] transition-all border-2 border-dashed ${
                links.length >= 3 ? 'border-red-500/30 hover:border-red-500' : 'border-purple-500/30 hover:border-purple-500'
              }`}
            >
              <Plus size={40} className={links.length >= 3 ? "text-red-500" : "text-purple-500"} />
              <span className={`${links.length >= 3 ? "text-red-500" : "text-purple-500"} font-medium mt-2`}>
                {links.length >= 3 ? "Link Limit Reached" : "Create New Link"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}