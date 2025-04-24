"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./AuthContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}
