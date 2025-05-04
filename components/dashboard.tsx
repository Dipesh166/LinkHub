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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-black">
      <Header />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {showLimitAlert && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <span>You can only create up to 3 links. Please delete an existing link to create a new one.</span>
            </Alert>
          )}
            <DashboardCard />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Create New Link Card */}
            <button
              onClick={handleCreateClick}
              className={`group relative overflow-hidden rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
                links.length >= 3 
                  ? 'bg-red-500/5 hover:bg-red-500/10 border-2 border-dashed border-red-500/30 hover:border-red-500/50' 
                  : 'bg-purple-500/5 hover:bg-purple-500/10 border-2 border-dashed border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus 
                size={48} 
                className={`${
                  links.length >= 3 
                    ? "text-red-500/70 group-hover:text-red-500" 
                    : "text-purple-500/70 group-hover:text-purple-500"
                } transition-colors duration-300`} 
              />
              <span className={`${
                links.length >= 3 
                  ? "text-red-500/70 group-hover:text-red-500" 
                  : "text-purple-500/70 group-hover:text-purple-500"
                } font-medium mt-4 text-lg transition-colors duration-300`}
              >
                {links.length >= 3 ? "Link Limit Reached" : "Create New Link"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}