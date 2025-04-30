"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import AdvancedEditorPanel from "@/components/advanced-editor-panel"
import PreviewPanel from "@/components/preview-panel"
import LinkGeneratorModal from "@/components/link-generator-modal"
import { useMediaQuery } from "@/hooks/use-media-query"
import Header from "@/components/header"


export default function EditorPage() {
  const [isMobileView, setIsMobileView] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    setIsMobileView(!isDesktop)
  }, [isDesktop])

  // For mobile view, toggle between editor and preview
  const toggleView = () => {
    setShowPreview(!showPreview)
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
    </div></>
  )
}
