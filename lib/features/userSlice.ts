"use client"

import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { updateProfiles, saveLinks, saveTheme, type UserData } from '../services/firebase-service';

export interface LinkData {
  id: string;
  title: string;
  url: string;
  theme?: any;
}

export interface ThemeData {
  background: string;
  backgroundImage: string | null;
  backgroundImageId: string | null;
  gradientStyle: string;
  buttonStyle: string;
  cardStyle: string;
  animation: string;
  opacity: number;
  blurAmount: number;
  useCustomGradient: boolean;
  customGradient?: {
    color1: string;
    color2: string;
    angle: number;
  };
}

export interface SocialHandle {
  platform: string;
  url: string;
}

interface UserState {
  id: string | null;
  username: string;
  bio: string;
  profession: string;
  profileImage: string | null;
  profileImageId: string | null;
  onboardingComplete: boolean;
  socialHandles: SocialHandle[];
  savedLinks: { id: string; username: string }[];
  links: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  theme: ThemeData;
  slug: string;
}

const initialState: UserState = {
  id: null,
  username: "",
  bio: "",
  profession: "",
  profileImage: null,
  profileImageId: null,
  onboardingComplete: false,
  socialHandles: [],
  savedLinks: [],
  links: [],
  theme: {
    background: "gradient",
    backgroundImage: null,
    backgroundImageId: null,
    gradientStyle: "midnight",
    buttonStyle: "rounded",
    cardStyle: "glass",
    animation: "none",
    opacity: 0.7,
    blurAmount: 0,
    useCustomGradient: false,
    customGradient: {
      color1: "#121063",
      color2: "#1a0038",
      angle: 135
    }
  },
  slug: ""
}

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

interface ImagePayload {
  url: string;
  id: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload;
    },
    setProfession: (state, action: PayloadAction<string>) => {
      state.profession = action.payload;
    },
    setProfileImage: (state, action: PayloadAction<ImagePayload>) => {
      state.profileImage = action.payload.url;
      state.profileImageId = action.payload.id;
    },
    setProfileId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    completeOnboarding: (state) => {
      state.onboardingComplete = true;
    },
    setSocialHandles: (state, action: PayloadAction<SocialHandle[]>) => {
      state.socialHandles = action.payload;
    },
    addSocialHandle: (state, action: PayloadAction<SocialHandle>) => {
      state.socialHandles.push(action.payload);
    },
    updateSocialHandle: (state, action: PayloadAction<{ index: number; handle: SocialHandle }>) => {
      const { index, handle } = action.payload;
      if (index >= 0 && index < state.socialHandles.length) {
        state.socialHandles[index] = handle;
      }
    },
    removeSocialHandle: (state, action: PayloadAction<number>) => {
      state.socialHandles.splice(action.payload, 1);
    },
    addSavedLink: (state, action: PayloadAction<{ id: string; username: string }>) => {
      state.savedLinks.push(action.payload);
    },
    setLinks: (state, action: PayloadAction<LinkData[]>) => {
      state.links = action.payload;
    },
    setTheme: (state, action: PayloadAction<ThemeData>) => {
      state.theme = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<{
      id: string;
      username: string;
      bio: string;
      profession: string;
      socialHandles: SocialHandle[];
      links: LinkData[];
      theme: ThemeData;
      profileImage: string | null;
      profileImageId: string | null;
      slug: string;
    }>) => {
      return {
        ...state,
        ...action.payload,
        onboardingComplete: true
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    })
    .addCase(updateLinks.fulfilled, (state, action) => {
      state.links = action.payload;
    })
    .addCase(updateTheme.fulfilled, (state, action) => {
      state.theme = action.payload;
    });
  }
});

export const {
  setUsername,
  setBio,
  setProfession,
  setProfileImage,
  setProfileId,
  completeOnboarding,
  setSocialHandles,
  addSocialHandle,
  updateSocialHandle,
  removeSocialHandle,
  addSavedLink,
  setLinks,
  setTheme,
  setUserInfo,
} = userSlice.actions;

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, profileId, data }: { userId: string; profileId: string; data: Partial<UserData> }) => {
    await updateProfiles(userId, profileId, data);
    return data;
  }
);

export const updateLinks = createAsyncThunk(
  'user/updateLinks',
  async ({ userId, profileId, links }: { userId: string; profileId: string; links: LinkData[] }) => {
    await saveLinks(userId, profileId, links);
    return links;
  }
);

export const updateTheme = createAsyncThunk(
  'user/updateTheme',
  async ({ userId, profileId, theme }: { userId: string; profileId: string; theme: ThemeData }) => {
    await saveTheme(userId, profileId, theme);
    return theme;
  }
);

export default userSlice.reducer;
