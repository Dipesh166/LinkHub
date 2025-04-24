"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ModalState {
  isOpen: boolean
  generatedLink: string | null
}

const initialState: ModalState = {
  isOpen: false,
  generatedLink: null,
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isOpen = !state.isOpen
    },
    setGeneratedLink: (state, action: PayloadAction<string>) => {
      state.generatedLink = action.payload
    },
  },
})

export const { toggleModal, setGeneratedLink } = modalSlice.actions
export default modalSlice.reducer
