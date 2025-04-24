"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Link {
  id: string
  title: string
  url: string
}

const initialState: Link[] = []

export const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    addLink: (state, action: PayloadAction<Link>) => {
      state.push(action.payload)
    },
    updateLink: (state, action: PayloadAction<Partial<Link> & { id: string }>) => {
      const index = state.findIndex((link) => link.id === action.payload.id)
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload }
      }
    },
    removeLink: (state, action: PayloadAction<string>) => {
      return state.filter((link) => link.id !== action.payload)
    },
  },
})

export const { addLink, updateLink, removeLink } = linksSlice.actions
export default linksSlice.reducer
