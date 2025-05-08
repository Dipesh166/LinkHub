"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import AdvancedEditorPanel from "@/components/advanced-editor-panel"
import PreviewPanel from "@/components/preview-panel"
import LinkGeneratorModal from "@/components/link-generator-modal"
import { useMediaQuery } from "@/hooks/use-media-query"
import Header from "@/components/header"
import { useSearchParams, useRouter } from "next/navigation"
import { getUserProfile } from "@/lib/services/firebase-service"
import { setUserInfo } from "@/lib/features/userSlice"
import { useAuth } from "@/lib/AuthContext"

export default function EditorPage() {
  const [isMobileView, setIsMobileView] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useAuth()
  const profileId = searchParams.get('profileId');
  const isValidProfileId = profileId && profileId !== 'profiles' && typeof profileId === 'string' && profileId.trim() !== '';
  
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.uid && isValidProfileId) {
        try {
          const profile = await getUserProfile(user.uid, profileId);
          if (profile) {
            dispatch(setUserInfo({
              id: profileId,
              slug: profile.slug,
              username: profile.username,
              bio: profile.bio || '',
              profession: profile.profession || '',
              socialHandles: profile.socialHandles || [],
              links: profile.links || [],
              theme: profile.theme,
              profileImage: profile.profileImage,
              profileImageId: profile.profileImageId
            }))
          } else {
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          router.push('/dashboard');
        }
      } else if (user?.uid && !isValidProfileId) {
        router.push('/dashboard');
      }
    };
  
    loadProfile();
  }, [user, profileId, dispatch, router]);

  useEffect(() => {
    setIsMobileView(!isDesktop)
  }, [isDesktop])

  // For mobile view, toggle between editor and preview
  const toggleView = () => {
    setShowPreview(!showPreview)
  }

  if (!isValidProfileId || !user) {
    return null
  }

  return (
    <>
      <Header/>
      <div className="flex-1 flex flex-col lg:flex-row">
        {isModalOpen && <LinkGeneratorModal />}

        {isMobileView ? (
          <>
            {showPreview ? <PreviewPanel onToggleView={toggleView} /> : <AdvancedEditorPanel onToggleView={toggleView} />}
          </>
        ) : (
          <>
            <div className="w-1/2 p-6 overflow-y-auto">
              <AdvancedEditorPanel />
            </div>
            <div className="w-1/2 bg-gray-900 lg:fixed lg:right-0 lg:top-0 lg:h-screen lg:w-1/2 flex items-center justify-center pt-8">
              <PreviewPanel />
            </div>
          </>
        )}
      </div>
    </>
  )
}
