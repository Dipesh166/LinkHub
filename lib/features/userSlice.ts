"use client"

import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { saveUserProfile, saveLinks, saveTheme, UserData, LinkData, ThemeData } from '../services/firebase-service';

export const professions = [
  "Software Developer",
  "Designer",
  "Content Creator",
  "Photographer",
  "Musician",
  "Artist",
  "Writer",
  "Entrepreneur",
  "Marketing Specialist",
  "Fitness Instructor",
]

export const socialPlatforms = [
  { id: "instagram", name: "Instagram", placeholder: "username" },
  { id: "twitter", name: "Twitter", placeholder: "username" },
  { id: "linkedin", name: "LinkedIn", placeholder: "username" },
  { id: "github", name: "GitHub", placeholder: "username" },
  { id: "youtube", name: "YouTube", placeholder: "channel" },
  { id: "facebook", name: "Facebook", placeholder: "username" },
  { id: "tiktok", name: "TikTok", placeholder: "username" },
  { id: "twitch", name: "Twitch", placeholder: "username" },
  { id: "pinterest", name: "Pinterest", placeholder: "username" },
  { id: "dribbble", name: "Dribbble", placeholder: "username" },
]

export interface SocialHandle {
  platform: string;
  username?: string; // Make username optional
  url: string;
}

interface UserState {
  username: string
  bio: string
  profession: string
  profileImage: string | null
  onboardingComplete: boolean
  socialHandles: SocialHandle[]
  savedLinks: { id: string; username: string }[]
}

const initialState: UserState = {
  username: "",
  bio: "",
  profession: "",
  profileImage: null,
  onboardingComplete: false,
  socialHandles: [],
  savedLinks: [],
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload
    },
    setProfession: (state, action: PayloadAction<string>) => {
      state.profession = action.payload
    },
    setProfileImage: (state, action: PayloadAction<string>) => {
      state.profileImage = action.payload
    },
    completeOnboarding: (state) => {
      state.onboardingComplete = true
    },
    setSocialHandles: (state, action: PayloadAction<SocialHandle[]>) => {
      state.socialHandles = action.payload
    },
    addSocialHandle: (state, action: PayloadAction<SocialHandle>) => {
      state.socialHandles.push(action.payload)
    },
    updateSocialHandle: (state, action: PayloadAction<{ index: number; handle: SocialHandle }>) => {
      const { index, handle } = action.payload
      if (index >= 0 && index < state.socialHandles.length) {
        state.socialHandles[index] = handle
      }
    },
    removeSocialHandle: (state, action: PayloadAction<number>) => {
      state.socialHandles.splice(action.payload, 1)
    },
    addSavedLink: (state, action: PayloadAction<{ id: string; username: string }>) => {
      state.savedLinks.push(action.payload)
    },
    setUserInfo: (
      state,
      action: PayloadAction<{
        username: string
        bio: string
        profession: string
        socialHandles: SocialHandle[]
      }>,
    ) => {
      state.username = action.payload.username
      state.bio = action.payload.bio
      state.profession = action.payload.profession
      state.socialHandles = action.payload.socialHandles
      state.onboardingComplete = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      // Merge the updated fields into the state
      Object.assign(state, action.payload);
    });
    // You can add similar handlers for updateLinks and updateTheme if needed
  }
})

export const {
  setUsername,
  setBio,
  setProfession,
  setProfileImage,
  completeOnboarding,
  setSocialHandles,
  addSocialHandle,
  updateSocialHandle,
  removeSocialHandle,
  addSavedLink,
  setUserInfo,
} = userSlice.actions

export default userSlice.reducer

// REMOVE THE DUPLICATE IMPORTS BELOW
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { saveUserProfile, saveLinks, saveTheme, UserData, LinkData, ThemeData } from '../services/firebase-service';

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }: { userId: string; data: Partial<UserData> }) => {
    await saveUserProfile(userId, data);
    return data;
  }
);

export const updateLinks = createAsyncThunk(
  'links/updateLinks',
  async ({ userId, links }: { userId: string; links: LinkData[] }) => {
    await saveLinks(userId, links);
    return links;
  }
);

export const updateTheme = createAsyncThunk(
  'theme/updateTheme',
  async ({ userId, theme }: { userId: string; theme: ThemeData }) => {
    await saveTheme(userId, theme);
    return theme;
  }
);
