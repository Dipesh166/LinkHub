import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"

const inter = Inter({ subsets: ["latin"] })

// Dynamic import of Providers with proper loading state
const DynamicProviders = dynamic(
  () => import("@/lib/providers").then((mod) => mod.Providers),
  {
    ssr: true,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  }
)

export const metadata: Metadata = {
  title: "LinkHub - Minimalist Link Sharing",
  description: "A sleek, minimalist link-sharing platform",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <DynamicProviders>
          {children}
        </DynamicProviders>
      </body>
    </html>
  )
}
