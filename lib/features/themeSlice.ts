"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export const gradients = {
  midnight: "linear-gradient(135deg, #121063, #1a0038)",
  sunset: "linear-gradient(135deg, #fa8142, #ff4088)",
  ocean: "linear-gradient(135deg, #0083B0, #00B4DB)",
  forest: "linear-gradient(135deg, #134E5E, #71B280)",
  aurora: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
  cosmic: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
  ember: "linear-gradient(135deg, #232526, #414345)",
  neon: "linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)",
} as const

export const cardStyles = {
  glass: "bg-white/10 backdrop-blur-sm border border-white/20",
  solid: "bg-black/30",
  gradient: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20",
  minimal: "bg-transparent border border-white/10",
  outline: "border-2 border-white/20",
} as const

export interface ThemeState {
  background: "solid" | "gradient" | "image"
  backgroundImage: string | null
  backgroundImageId: string | null
  gradientStyle: keyof typeof gradients
  buttonStyle: "rounded" | "pill" | "outline"
  cardStyle: keyof typeof cardStyles
  animation: "none" | "fade" | "scale" | "slide" | "bounce"
  opacity: number
  blurAmount: number
  useCustomGradient: boolean
  customGradient: {
    color1: string
    color2: string
    angle: number
  }
}

const initialState: ThemeState = {
  background: "gradient",
  backgroundImage: null,
  backgroundImageId: null,
  gradientStyle: "midnight",
  buttonStyle: "rounded",
  cardStyle: "glass",
  animation: "none",
  opacity: 0.7,
  blurAmount: 0,
  customGradient: {
    color1: "#121063",
    color2: "#1a0038",
    angle: 135,
  },
  useCustomGradient: false,
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<Partial<ThemeState>>) => {
      return { ...state, ...action.payload }
    },
    setBackgroundImage: (state, action: PayloadAction<string | null>) => {
      state.backgroundImage = action.payload
    },
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
    setBlurAmount: (state, action: PayloadAction<number>) => {
      state.blurAmount = action.payload
    },
    setCustomGradient: (state, action: PayloadAction<Partial<ThemeState["customGradient"]>>) => {
      state.customGradient = { ...state.customGradient, ...action.payload }
    },
    toggleCustomGradient: (state, action: PayloadAction<boolean>) => {
      state.useCustomGradient = action.payload
    },
  },
})

export const { 
  updateTheme, 
  setBackgroundImage, 
  setOpacity, 
  setBlurAmount, 
  setCustomGradient, 
  toggleCustomGradient 
} = themeSlice.actions

export default themeSlice.reducer
