"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Plus, AlertCircle } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import { getUserProfile } from "@/lib/services/firebase-service"
import Header from "@/components/header"
import { setUserInfo } from "@/lib/features/userSlice"
import DashboardCard from "@/components/dashboardCard"

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0A0F] via-[#1a1333] to-[#2d1a4d]">
      <Header />
      <div className="flex-1 px-2 py-4 sm:px-4 sm:py-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Your Link Hub
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Manage and customize your link profiles with ease
            </p>
          </div>

          {showLimitAlert && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">You can only create up to 3 links. Please delete an existing link to create a new one.</span>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
            {/* Create New Link Card */}
            <div className="w-full max-w-xs mx-auto md:mx-auto lg:mx-0 md:w-[320px] lg:w-[360px]">
              <button
                onClick={handleCreateClick}
                disabled={links.length >= 3}
                className={`group relative overflow-hidden rounded-2xl w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[520px] flex flex-col items-center justify-center transition-all duration-500 backdrop-blur-sm ${
                  links.length >= 3 
                    ? 'bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] opacity-60 cursor-not-allowed' 
                    : 'bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Animated Content Container */}
                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500" />
                    <Plus 
                      size={40} 
                      className={`${
                        links.length >= 3 
                          ? "text-red-400 group-hover:text-red-300" 
                          : "text-purple-400 group-hover:text-purple-300"
                      } relative transition-colors duration-500`} 
                    />
                  </div>
                  <span className={`${
                    links.length >= 3 
                      ? "text-red-400 group-hover:text-red-300" 
                      : "text-purple-400 group-hover:text-purple-300"
                    } font-semibold mt-6 text-base sm:text-lg md:text-xl text-center transition-colors duration-500`}
                  >
                    {links.length >= 3 ? "Link Limit Reached" : "Create New Link"}
                  </span>
                </div>
                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 md:h-32 lg:h-36 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>
            <div className="flex-1 w-full">
              <DashboardCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}