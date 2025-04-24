"use client"

import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import linksReducer from "./features/linksSlice"
import themeReducer from "./features/themeSlice"
import modalReducer from "./features/modalSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    links: linksReducer,
    theme: themeReducer,
    modal: modalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
