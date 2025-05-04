"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUsername } from "@/lib/features/userSlice";
import { Input } from "@/components/ui/input";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import Header from "@/components/header";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Link,
  Palette,
  Globe,
  Sparkles,
  Instagram,
  Twitter,
  Github,
  Linkedin,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const [name, setName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Features array with enhanced animations
  const features = [
    {
      icon: <Link className="h-6 w-6 text-purple-400" />,
      title: "Custom Links",
      description: "Add up to 10 custom links to your profile with beautiful animations and styles.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Palette className="h-6 w-6 text-blue-400" />,
      title: "Beautiful Themes",
      description: "Choose from a variety of gradients or upload your own background image.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className="h-6 w-6 text-green-400" />,
      title: "Social Media Integration",
      description: "Connect your social media profiles with just a username.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-400" />,
      title: "Glassmorphism UI",
      description: "Modern glass-like interface with blur effects and transparency.",
      gradient: "from-amber-500 to-orange-500"
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(setUsername(name.trim()));
    }
  };

  const handleAuthClick = (type: 'login' | 'signup') => {
    router.push('/login');
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  // If user is not logged in, show landing page
  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col bg-[#0A0A0F]">
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Enhanced animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#120F2F] to-black z-0 animate-gradient-slow"></div>
            
            {/* Improved animated blobs with more complex animations */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 90, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.1, 0.2],
                rotate: [90, 0, 90]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 2
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full filter blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
                rotate: [-90, 0, -90]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 4
              }}
            />

            <div className="container mx-auto z-10">
              <div className="flex flex-col items-center justify-center gap-8">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{ opacity, scale }}
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-fuchsia-300 to-indigo-300">
                    Welcome to LinkHub
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300/90 mb-8 max-w-2xl mx-auto">
                    Create a stunning link-sharing page that represents your personal brand with our beautiful, minimalist platform
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex gap-4 flex-col sm:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  <GlassButton
                    onClick={() => handleAuthClick('login')}
                    className="px-8 py-3 text-lg group relative overflow-hidden"
                    intensity="high"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </GlassButton>
                  <GlassButton
                    onClick={() => handleAuthClick('signup')}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 group relative overflow-hidden"
                    intensity="high"
                  >
                    <span className="relative z-10">Create Account</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </GlassButton>
                </motion.div>

                <motion.button
                  onClick={scrollToFeatures}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 hover:text-white transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <ChevronDown className="h-8 w-8" />
                </motion.button>
              </div>
            </div>
          </section>

          {/* Features section with enhanced animations */}
          <section id="features" className="py-20 bg-[#0A0A0F] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),rgba(0,0,0,0))]"></div>
            <div className="container mx-auto px-6">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  Everything You Need
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Create your perfect link-sharing page with our powerful features
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <GlassCard className="h-full p-6 group hover:border-violet-500/30 transition-colors duration-300">
                      <div className={`mb-4 p-3 rounded-full bg-gradient-to-br ${feature.gradient} w-fit group-hover:scale-110 transform transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-violet-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {feature.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Keep the rest of the sections... */}
        </div>
      </>
    );
  }

  // If user is logged in, redirect them (handled by the router)
  return null;
}
