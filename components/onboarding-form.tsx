"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfo,
  professions,
  socialPlatforms,
  type SocialHandle,
} from "@/lib/features/userSlice";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  Briefcase,
  AtSign,
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

export default function OnboardingForm() {
  const dispatch = useDispatch();
  const currentUsername = useSelector(
    (state: RootState) => state.user.username
  );
  

  const [formData, setFormData] = useState({
    username: currentUsername,
    bio: "",
    profession: "",
    socialHandles: [] as SocialHandle[],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Username", "Bio", "Profession", "Social Media"];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.profession) {
      dispatch(
        setUserInfo({
          username: formData.username.trim(),
          bio: formData.bio.trim(),
          profession: formData.profession,
          socialHandles: formData.socialHandles,
        })
      );
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addSocialHandle = () => {
    if (formData.socialHandles.length < 5) {
      setFormData({
        ...formData,
        socialHandles: [
          ...formData.socialHandles,
          { platform: "", url: "" },
        ],
      });
    }
  };

  const updateSocialHandle = (
    index: number,
    field: keyof SocialHandle,
    value: string
  ) => {
    const updatedHandles = [...formData.socialHandles];
    updatedHandles[index] = { ...updatedHandles[index], [field]: value };
    setFormData({ ...formData, socialHandles: updatedHandles });
  };

  const removeSocialHandle = (index: number) => {
    const updatedHandles = [...formData.socialHandles];
    updatedHandles.splice(index, 1);
    setFormData({ ...formData, socialHandles: updatedHandles });
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0.2, scale: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [0, 1, 0],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
          <motion.div
            className="absolute -top-4 -right-4 text-yellow-400 scale-125"
            animate={{ rotate: 360, scale: [1.25, 1.5, 1.25] }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>

          <div className="pb-8">
            <motion.h2
              className="text-center text-3xl font-bold bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%"],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            >
              Create Your Digital Identity
            </motion.h2>

            {/* Enhanced progress steps with bigger icons */}
            <div className="flex justify-center mt-8">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-sm relative ${
                      index === currentStep
                        ? "bg-white text-black shadow-lg shadow-white/20"
                        : index < currentStep
                        ? "bg-purple-500/50 text-white"
                        : "bg-black/30 border-2 border-white/10 text-gray-400"
                    }`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index === currentStep && (
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-white/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    {index === 0 ? (
                      <User className="h-7 w-7" />
                    ) : index === 1 ? (
                      <FileText className="h-7 w-7" />
                    ) : index === 2 ? (
                      <Briefcase className="h-7 w-7" />
                    ) : (
                      <AtSign className="h-7 w-7" />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className={`w-16 h-1 ${
                        index < currentStep ? "bg-purple-500/50" : "bg-black/30"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.2 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInUp}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-300"
                      >
                        Username
                      </label>
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          handleChange("username", e.target.value)
                        }
                        className="bg-black/30 border-white/20 text-white focus:ring-white/25 focus:border-white/40"
                        required
                      />
                      <p className="text-xs text-gray-400">
                        This will be used in your profile URL: linkhub.com/
                        {formData.username}
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="bio"
                        className="text-sm font-medium text-gray-300"
                      >
                        Bio
                      </label>
                      <Textarea
                        id="bio"
                        placeholder="Tell people a bit about yourself..."
                        value={formData.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className="bg-black/30 border-white/20 text-white min-h-[120px] focus:ring-white/25 focus:border-white/40"
                      />
                      <p className="text-xs text-gray-400 flex justify-end">
                        {formData.bio.length}/150 characters
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="profession"
                        className="text-sm font-medium text-gray-300"
                      >
                        Profession
                      </label>
                      <Select
                        value={formData.profession}
                        onValueChange={(value) =>
                          handleChange("profession", value)
                        }
                        required
                      >
                        <SelectTrigger
                          id="profession"
                          className="bg-black/30 border-white/20 focus:ring-white/25 focus:border-white/40"
                        >
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                          {professions.map((profession) => (
                            <SelectItem key={profession} value={profession}>
                              {profession}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">
                          Social Media Links
                        </label>
                        <span className="text-xs text-gray-400">
                          {formData.socialHandles.length}/5
                        </span>
                      </div>

                      <div className="space-y-3">
                        {formData.socialHandles.map((handle, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-2 group"
                          >
                            <div className="flex items-center gap-2">
                              <Select
                                value={handle.platform}
                                onValueChange={(value) =>
                                  updateSocialHandle(index, "platform", value)
                                }
                              >
                                <SelectTrigger className="bg-black/30 border-white/20 focus:ring-white/25 focus:border-white/40">
                                  <SelectValue placeholder="Select Platform" />
                                </SelectTrigger>
                                <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                                  {socialPlatforms.map((platform) => (
                                    <SelectItem
                                      key={platform.id}
                                      value={platform.id}
                                    >
                                      {platform.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSocialHandle(index)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <Input
                              value={handle.url}
                              onChange={(e) =>
                                updateSocialHandle(index, "url", e.target.value)
                              }
                              placeholder="Enter your profile URL"
                              className="bg-black/30 border-white/20 text-white focus:ring-white/25 focus:border-white/40"
                            />
                          </div>
                        ))}

                        {formData.socialHandles.length < 5 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addSocialHandle}
                            className="w-full bg-black/30 border-white/20 text-white hover:bg-white/10"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Social Media Link
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-4">
                  <GlassButton
                    type="button"
                    onClick={prevStep}
                    className={`${
                      isFirstStep ? "opacity-0 pointer-events-none" : ""
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                  </GlassButton>
                  <GlassButton
                    type={isLastStep ? "submit" : "button"}
                    onClick={isLastStep ? undefined : nextStep}
                    className="rounded-full px-6"
                    intensity="high"
                    disabled={
                      (currentStep === 0 && !formData.username) ||
                      (currentStep === 2 && !formData.profession)
                    }
                  >
                    {isLastStep ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create My LinkHub
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </GlassButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
