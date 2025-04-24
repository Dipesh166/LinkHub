"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUsername } from "@/lib/features/userSlice";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
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
} from "lucide-react";

export default function HomePage() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
     <>
     <p>loading</p>
     </>
    );
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(setUsername(name.trim()));
    }
  };

  const features = [
    {
      icon: <Link className="h-6 w-6 text-purple-400" />,
      title: "Custom Links",
      description:
        "Add up to 10 custom links to your profile with beautiful animations and styles.",
    },
    {
      icon: <Palette className="h-6 w-6 text-blue-400" />,
      title: "Beautiful Themes",
      description:
        "Choose from a variety of gradients or upload your own background image.",
    },
    {
      icon: <Globe className="h-6 w-6 text-green-400" />,
      title: "Social Media Integration",
      description: "Connect your social media profiles with just a username.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-400" />,
      title: "Glassmorphism UI",
      description:
        "Modern glass-like interface with blur effects and transparency.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black z-0 animate-gradient-slow"></div>

        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="container mx-auto z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Create Your Perfect Link Hub
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                A beautiful, minimalist link-sharing platform to showcase all
                your important links in one place with stunning visuals.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0"
              >
                <Input
                  type="text"
                  placeholder="Choose your username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white focus:ring-white/25 focus:border-white/40 h-12 text-lg"
                  required
                />
                <GlassButton
                  type="submit"
                  className="h-12 px-6 rounded-full"
                  intensity="high"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </GlassButton>
              </form>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative mx-auto max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-50 transform -rotate-3"></div>
                <GlassCard className="relative p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      LH
                    </div>
                    <h3 className="text-xl font-bold text-white">John Doe</h3>
                    <p className="text-sm text-gray-300">
                      Designer & Developer
                    </p>
                    <div className="flex gap-3 my-2">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                      >
                        <Instagram className="h-4 w-4" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                      >
                        <Twitter className="h-4 w-4" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                      >
                        <Github className="h-4 w-4" />
                      </motion.a>
                    </div>
                    <div className="w-full space-y-3">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-md text-center"
                        >
                          Link {i}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),rgba(0,0,0,0))]"></div>
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              LinkHub provides all the tools you need to create a stunning
              link-sharing page that represents your personal brand.
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
              >
                <GlassCard className="h-full p-6">
                  <div className="mb-4 p-3 rounded-full bg-white/5 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950/30">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create your LinkHub in three simple steps and share it with the
              world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description:
                  "Choose a username and complete your profile with bio and social media handles.",
              },
              {
                step: "02",
                title: "Add Your Links",
                description:
                  "Add up to 10 custom links and personalize them with different styles and animations.",
              },
              {
                step: "03",
                title: "Share Your LinkHub",
                description:
                  "Get a custom URL to share on your social media profiles, email signature, or business card.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <GlassCard className="h-full p-6 pt-12">
                  <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(120,50,255,0.15),rgba(0,0,0,0))]"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                LinkHub
              </h2>
              <p className="text-gray-400 mt-2">
                A minimalist link-sharing platform
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} LinkHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
