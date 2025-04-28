"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { addLink, removeLink, updateLink } from "@/lib/features/linksSlice"
import {
  updateTheme,
  setBackgroundImage,
  setOpacity,
  setBlurAmount,
  setCustomGradient,
  toggleCustomGradient,
  gradients,
  cardStyles,
} from "@/lib/features/themeSlice"
import { setProfession, socialPlatforms } from "@/lib/features/userSlice"
import { v4 as uuidv4 } from "uuid"
import { AlertCircle, CreditCard, Eye, Link, Palette, Plus, Trash2, User } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import { SocialIcon } from "@/components/social-icon"
import { useAuth } from "@/lib/AuthContext"
import { updateProfile } from "@/lib/features/userSlice"
import { saveTheme, saveLinks } from "@/lib/services/firebase-service"

interface AdvancedEditorPanelProps {
  onToggleView?: () => void
}

const professions = [
  "Software Developer",
  "Designer",
  "Content Creator",
  "Photographer",
  "Artist",
  "Musician",
  "Writer",
  "Entrepreneur",
  "Marketing Professional",
  "Student",
  "Other"
];

export default function AdvancedEditorPanel({ onToggleView }: AdvancedEditorPanelProps) {
  const { user } = useAuth();
  const dispatch = useDispatch()
  const links = useSelector((state: RootState) => state.links)
  const theme = useSelector((state: RootState) => state.theme)
  const { username, bio, profession, socialHandles, profileImage } = useSelector((state: RootState) => state.user)

  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [userBio, setUserBio] = useState(bio)
  const [activeTab, setActiveTab] = useState("profile")
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setUserBio(bio)
  }, [bio])

  const handleAddLink = async () => {
    if (newLink.title && newLink.url && links.length < 10 && user) {
      const newLinkData = {
        id: uuidv4(), // Generate a unique ID for the link
        title: newLink.title,
        url: newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`,
      }

      // Update Redux state
      dispatch(addLink(newLinkData))
      setNewLink({ title: "", url: "" })

      // Save to Firebase
      try {
        const updatedLinks = [...links, newLinkData]
        await saveLinks(user.uid, updatedLinks)
      } catch (error) {
        console.error('Error saving links:', error)
      }
    }
  }

  const handleUpdateLink = (id: string, field: "title" | "url", value: string) => {
    dispatch(updateLink({ id, [field]: value }))
  }

  const handleRemoveLink = (id: string) => {
    dispatch(removeLink(id))
  }

  const handleThemeChange = (key: keyof typeof theme, value: string | number | boolean) => {
    const updatedTheme = { ...theme, [key]: value };
    dispatch(updateTheme(updatedTheme));
    
    // Save theme to Firestore
    if (user && user.uid) {
      saveTheme(user.uid, updatedTheme)
        .catch(error => console.error('Error saving theme:', error));
    }
  };


  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= 150) {
      setUserBio(value)
    }
  }

  const handleBioSave = async () => {
    if (user) {
      await dispatch(updateProfile({
        userId: user.uid,
        data: { bio: userBio }
      }));
    }
  };

  const handleProfessionChange = (value: string) => {
    if (user?.uid) {
      dispatch(setProfession(value));
    }
  }

  const handleOpacityChange = (value: number[]) => {
    dispatch(setOpacity(value[0]))
  }

  const handleBlurChange = (value: number[]) => {
    dispatch(setBlurAmount(value[0]))
  }

  const handleCustomGradientChange = (field: keyof typeof theme.customGradient, value: string | number) => {
    dispatch(setCustomGradient({ [field]: value }))
  }

  const handleToggleCustomGradient = (checked: boolean) => {
    dispatch(toggleCustomGradient(checked))
  }

  const getCustomGradientStyle = () => {
    const { color1, color2, angle } = theme.customGradient
    return {
      background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: "profile" | "background") => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (type === "profile" && user?.uid) {
        dispatch(updateProfile({
          userId: user.uid,
          data: { profileImage: dataUrl }
        }));
      } else if (type === "background") {
        dispatch(updateTheme({ backgroundImage: dataUrl }));
        if (user?.uid) {
          saveTheme(user.uid, { ...theme, backgroundImage: dataUrl });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Add useEffect to sync links with Firebase whenever they change
  useEffect(() => {
    const syncLinksWithFirebase = async () => {
      if (user && user.uid && links) {
        try {
          await saveLinks(user.uid, links);
        } catch (error) {
          console.error('Error syncing links with Firebase:', error);
        }
      }
    };

    syncLinksWithFirebase();
  }, [user, links]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-full">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-white data-[state=active]:text-black rounded-full"
          >
            <User className="h-4 w-4 mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="links"
            className="data-[state=active]:bg-white data-[state=active]:text-black rounded-full"
          >
            <Link className="h-4 w-4 mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Links</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-white data-[state=active]:text-black rounded-full"
          >
            <Palette className="h-4 w-4 mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Design</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <GlassCard className="mb-6 p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Profile Image</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-4">
                    <Label htmlFor="profileImageUrl" className="text-sm">
                      Profile Image URL
                    </Label>
                    <Input
                      id="profileImageUrl"
                      type="text"
                      placeholder="https://example.com/your-image.jpg"
                      value={profileImage || ""}
                      onChange={e => {
                        const url = e.target.value;
                        if (user && user.uid) {
                          dispatch(updateProfile({
                            userId: user.uid,
                            data: { profileImage: url }
                          }));
                        }
                      }}
                      className="bg-black/30 border-white/20 text-white"
                    />
                    {profileImage && (
                      <div className="flex flex-col items-center mt-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-4">
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-gray-400 mb-2">Preview</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="mb-6 p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Bio</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-2">
                    <Textarea
                      id="bio"
                      value={userBio}
                      onChange={handleBioChange}
                      onBlur={handleBioSave}
                      placeholder="Tell people a bit about yourself..."
                      className="bg-black/30 border-white/20 text-white min-h-[120px] focus:ring-white/25 focus:border-white/40"
                    />
                    <p className="text-xs text-gray-400 flex justify-end">{userBio.length}/150 characters</p>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="mb-6 p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Profession</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-2">
                    <Select value={profession} onValueChange={handleProfessionChange}>
                      <SelectTrigger
                        id="profession"
                        className="bg-black/30 border-white/20 focus:ring-white/25 focus:border-white/40"
                      >
                        <SelectValue placeholder="Select your profession" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        {professions.map((prof) => (
                          <SelectItem key={prof} value={prof}>
                            {prof}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Social Media</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-3">
                    {socialHandles.map((handle, index) => (
                      <div key={index} className="flex items-center gap-2 group">
                        <div className="w-1/3">
                          <p className="text-sm font-medium text-gray-300">
                            {socialPlatforms.find((p) => p.id === handle.platform)?.name || handle.platform}
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              value={handle.url}
                              className="bg-black/30 border-white/20 text-white pl-3"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {socialHandles.length === 0 && (
                      <p className="text-gray-400 text-center py-2">No social media handles added</p>
                    )}

                    <div className="mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="text-center mb-2 text-sm text-gray-400">Social Media Preview</div>
                      <div className="space-y-2">
                        {socialHandles.length > 0 ? (
                          socialHandles
                            .slice(0, 1)
                            .map((handle, index) => (
                              <SocialIcon
                                key={index}
                                platform={handle.platform}
                                url={handle.url}
                                displayStyle="button"
                              />
                            ))
                        ) : (
                          <div className="text-center text-sm text-gray-500 py-2">
                            Add social media handles in the onboarding step
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="links" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <GlassCard className="p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>Your Links</span>
                    <span className="text-sm font-normal text-gray-400">{links.length}/10</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  {links.length >= 10 && (
                    <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>You've reached the maximum of 10 links.</AlertDescription>
                    </Alert>
                  )}

                  <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                    {links.map((link) => (
                      <motion.div key={link.id} className="flex items-center gap-2 group" variants={item} layout>
                        <div className="flex-1 space-y-2">
                          <Input
                            value={link.title}
                            onChange={(e) => handleUpdateLink(link.id, "title", e.target.value)}
                            placeholder="Link Title"
                            className="bg-black/30 border-white/20 text-white focus:ring-white/25 focus:border-white/40"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                            placeholder="URL"
                            className="bg-black/30 border-white/20 text-white focus:ring-white/25 focus:border-white/40"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLink(link.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>

                  {links.length < 10 && (
                    <motion.div className="flex items-end gap-2 pt-4" variants={item}>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                          placeholder="New Link Title"
                          className="bg-black/30 border-white/20 text-white focus:ring-white/25 focus:border-white/40"
                        />
                        <Input
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                          placeholder="https://example.com"
                          className="bg-black/30 border-white/20 text-white focus:ring-white/25 focus:border-white/40"
                        />
                      </div>
                      <GlassButton
                        onClick={handleAddLink}
                        className="rounded-full"
                        disabled={!newLink.title || !newLink.url}
                      >
                        <Plus className="h-5 w-5" />
                      </GlassButton>
                    </motion.div>
                  )}
                </CardContent>
              </GlassCard>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <GlassCard className="mb-6 p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Background</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="background">Background Type</Label>
                    <Select value={theme.background} onValueChange={(value) => handleThemeChange("background", value)}>
                      <SelectTrigger
                        id="background"
                        className="bg-black/30 border-white/20 focus:ring-white/25 focus:border-white/40"
                      >
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="solid">Solid Black</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="image">Custom Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {theme.background === "gradient" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Gradient Style</Label>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="custom-gradient" className="text-sm text-gray-400">
                            Custom
                          </Label>
                          <Switch
                            id="custom-gradient"
                            checked={theme.useCustomGradient}
                            onCheckedChange={handleToggleCustomGradient}
                          />
                        </div>
                      </div>

                      {theme.useCustomGradient ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="color1" className="text-sm">
                                Color 1
                              </Label>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-md border border-white/20"
                                  style={{ backgroundColor: theme.customGradient.color1 }}
                                ></div>
                                <Input
                                  id="color1"
                                  type="text"
                                  value={theme.customGradient.color1}
                                  onChange={(e) => handleCustomGradientChange("color1", e.target.value)}
                                  className="bg-black/30 border-white/20 text-white"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="color2" className="text-sm">
                                Color 2
                              </Label>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-md border border-white/20"
                                  style={{ backgroundColor: theme.customGradient.color2 }}
                                ></div>
                                <Input
                                  id="color2"
                                  type="text"
                                  value={theme.customGradient.color2}
                                  onChange={(e) => handleCustomGradientChange("color2", e.target.value)}
                                  className="bg-black/30 border-white/20 text-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="angle" className="text-sm">
                                Angle
                              </Label>
                              <span className="text-xs text-gray-400">{theme.customGradient.angle}°</span>
                            </div>
                            <Slider
                              id="angle"
                              min={0}
                              max={360}
                              step={5}
                              value={[theme.customGradient.angle as number]}
                              onValueChange={(value) => handleCustomGradientChange("angle", value[0])}
                            />
                          </div>

                          <div
                            className="h-16 rounded-lg border border-white/20"
                            style={getCustomGradientStyle()}
                          ></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(gradients).map(([name, value]) => (
                            <div
                              key={name}
                              className={`h-16 rounded-lg cursor-pointer transition-all ${
                                theme.gradientStyle === name ? "ring-2 ring-white scale-105" : "ring-1 ring-white/20"
                              }`}
                              style={{ background: value }}
                              onClick={() => handleThemeChange("gradientStyle", name)}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {theme.background === "image" && (
                    <div className="space-y-4">
                      <Label htmlFor="backgroundImageUrl" className="text-sm">
                        Background Image URL
                      </Label>
                      <Input
                        id="backgroundImageUrl"
                        type="text"
                        placeholder="https://example.com/background.jpg"
                        value={theme.backgroundImage || ""}
                        onChange={e => {
                          const url = e.target.value;
                          dispatch(updateTheme({
                            backgroundImage: url
                          }));
                          if (user && user.uid) {
                            saveTheme(user.uid, { ...theme, backgroundImage: url });
                          }
                        }}
                        className="bg-black/30 border-white/20 text-white"
                      />
                      {theme.backgroundImage && (
                        <div className="flex flex-col items-center mt-4">
                          <div className="w-32 h-20 rounded-lg overflow-hidden border-2 border-white/20 mb-4">
                            <img
                              src={theme.backgroundImage}
                              alt="Background"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-gray-400 mb-2">Preview</p>
                        </div>
                      )}
                      {theme.backgroundImage && (
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="blur">Gaussian Blur</Label>
                              <span className="text-xs text-gray-400">{theme.blurAmount}px</span>
                            </div>
                            <Slider
                              id="blur"
                              min={0}
                              max={20}
                              step={1}
                              value={[theme.blurAmount]}
                              onValueChange={handleBlurChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="overlay">Overlay Opacity</Label>
                              <span className="text-xs text-gray-400">{Math.round(theme.opacity * 100)}%</span>
                            </div>
                            <Slider
                              id="overlay"
                              min={0}
                              max={1}
                              step={0.05}
                              value={[theme.opacity]}
                              onValueChange={handleOpacityChange}
                            />
                          </div>

                          <div className="relative h-24 rounded-lg overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `url(${theme.backgroundImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: `blur(${theme.blurAmount}px)`,
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-black" style={{ opacity: theme.opacity }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-white font-medium">Preview</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="mb-6 p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Card Style</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardStyle">Card Appearance</Label>
                    <Select
                      value={theme.cardStyle}
                      onValueChange={(value) => handleThemeChange("cardStyle", value as keyof typeof cardStyles)}
                    >
                      <SelectTrigger
                        id="cardStyle"
                        className="bg-black/30 border-white/20 focus:ring-white/25 focus:border-white/40"
                      >
                        <SelectValue placeholder="Select card style" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(cardStyles).map(([style, className]) => (
                      <div
                        key={style}
                        className={`h-24 rounded-lg cursor-pointer flex items-center justify-center p-4 transition-all ${
                          theme.cardStyle === style ? "ring-2 ring-white scale-105" : ""
                        } ${className}`}
                        onClick={() => handleThemeChange("cardStyle", style)}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          <span className="capitalize">{style}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="p-6">
                <CardHeader className="pb-3 px-0 pt-0">
                  <CardTitle className="text-xl">Button Style</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="buttonStyle">Button Shape</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        className={`flex flex-col items-center justify-center h-20 border-white/20 hover:border-white/40 ${
                          theme.buttonStyle === "rounded" ? "border-white ring-1 ring-white" : ""
                        }`}
                        onClick={() => handleThemeChange("buttonStyle", "rounded")}
                      >
                        <div className="w-16 h-8 bg-white/20 backdrop-blur-md rounded-md mb-2"></div>
                        <span className="text-xs">Rounded</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex flex-col items-center justify-center h-20 border-white/20 hover:border-white/40 ${
                          theme.buttonStyle === "pill" ? "border-white ring-1 ring-white" : ""
                        }`}
                        onClick={() => handleThemeChange("buttonStyle", "pill")}
                      >
                        <div className="w-16 h-8 bg-white/20 backdrop-blur-md rounded-full mb-2"></div>
                        <span className="text-xs">Pill</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex flex-col items-center justify-center h-20 border-white/20 hover:border-white/40 ${
                          theme.buttonStyle === "outline" ? "border-white ring-1 ring-white" : ""
                        }`}
                        onClick={() => handleThemeChange("buttonStyle", "outline")}
                      >
                        <div className="w-16 h-8 bg-transparent border-2 border-white rounded-md mb-2"></div>
                        <span className="text-xs">Outline</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="animation">Button Animation</Label>
                    <Select value={theme.animation} onValueChange={(value) => handleThemeChange("animation", value)}>
                      <SelectTrigger
                        id="animation"
                        className="bg-black/30 border-white/20 focus:ring-white/25 focus:border-white/40"
                      >
                        <SelectValue placeholder="Select animation" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="text-center mb-2 text-sm text-gray-400">Animation Preview</div>
                      <motion.div
                        whileHover={
                          theme.animation === "fade"
                            ? { opacity: 0.8 }
                            : theme.animation === "scale"
                              ? { scale: 1.05 }
                              : theme.animation === "slide"
                                ? { x: 5 }
                                : theme.animation === "bounce"
                                  ? { y: -5 }
                                  : {}
                        }
                        transition={theme.animation === "bounce" ? { type: "spring", stiffness: 400, damping: 10 } : {}}
                      >
                        <GlassButton className="w-full">Example Button</GlassButton>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {onToggleView && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassButton onClick={onToggleView} className="w-full rounded-full font-medium" intensity="high">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </GlassButton>
        </motion.div>
      )}
    </div>
  )
}
