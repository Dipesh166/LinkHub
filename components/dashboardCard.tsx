"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from 'next/navigation';  // Fix: Import useRouter from next/navigation
import { GlassCard } from "@/components/ui/glass-card";
import SocialIcon from "@/components/social-icon";
import LinkButton from "@/components/link-button";
import { gradients } from "@/lib/features/themeSlice";
import { Share2 } from 'lucide-react';
import Spinner from "@/components/ui/spinner";

interface UserData {
  id: string;
  username: string;
  bio: string;
  profession: string;
  profileImage: string | null;
  socialHandles: Array<{
    platform: string;
    url: string;
  }>;
  links: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  theme: {
    background: string;
    backgroundImage: string | null;
    gradientStyle: string;
    buttonStyle: string;
    opacity: number;
    blurAmount: number;
    useCustomGradient: boolean;
    customGradient?: {
      color1: string;
      color2: string;
      angle: number;
    };
  };
}

function DashboardCard() {
  const [userDataList, setUserDataList] = useState<UserData[]>([]);
  const { user, loading } = useAuth();  // Add loading state
  const router = useRouter();  // Add router for navigation

  useEffect(() => {
    const fetchCollectionData = async () => {
      if (loading) {
        return; // Wait for auth to initialize
      }

      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      try {
        const userCollectionRef = collection(db, 'users', user.uid, 'profiles');
        const querySnapshot = await getDocs(userCollectionRef);
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data() as UserData,
          id: doc.id
        }));
        setUserDataList(dataList);
      } catch (error) {
        console.error('Error fetching collection data:', error);
      }
    };

    fetchCollectionData();
  }, [user, loading, router]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={48} className="" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // Return null as we're redirecting
  }

  const getBackgroundStyle = (theme: UserData['theme']) => {
    if (theme.background === "image" && theme.backgroundImage) {
      return {
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }

    if (theme.background === "gradient") {
      if (theme.useCustomGradient && theme.customGradient) {
        const { color1, color2, angle } = theme.customGradient;
        return { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` };
      } else {
        return { background: gradients[theme.gradientStyle as keyof typeof gradients] || gradients.midnight };
      }
    }

    return { background: "#000000" };
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (userDataList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={48} className="" />
      </div>
    );
  }

  const handleShare = async (e: React.MouseEvent, userId: string, profileId: string, username: string, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const protocol = window.location.protocol;
    const hostname = window.location.host;
    const url = slug 
      ? `${protocol}//${hostname}/${slug}`
      : `${protocol}//${hostname}/${userId}_${profileId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${username}'s LinkHub Profile`,
          text: `Check out ${username}'s LinkHub profile!`,
          url: url
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(url);
        alert(`Link copied to clipboard: ${url}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share operation
        return;
      }
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDataList.map((userData, index) => {
            const profileId = userData.id;
            const handleCardClick = () => {
              const protocol = window.location.protocol;
              const hostname = window.location.host;
              const url = userData.slug 
                ? `${protocol}//${hostname}/${userData.slug}`
                : `${protocol}//${hostname}/${user.uid}_${profileId}`;
              window.location.href = url;
            };

            return (
              <div
                key={userData.id || index}
                className="w-full cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <GlassCard className="overflow-hidden relative h-[500px]">
                  {/* Share Button - Moved outside of clickable area */}
                  <div className="absolute top-4 right-4 z-30">
                    <motion.button
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShare(e, user.uid, profileId, userData.username, userData.slug);
                      }}
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>

                  <motion.div
                    className="relative w-full h-full flex flex-col items-center justify-center"
                    onClick={handleCardClick}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={getBackgroundStyle(userData.theme)}
                  >
                    {/* Background layers */}
                    {userData.theme.background === "image" && userData.theme.backgroundImage && (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{
                            zIndex: 0,
                            backgroundImage: `url(${userData.theme.backgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: `blur(${userData.theme.blurAmount}px)`,
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-black"
                          style={{ zIndex: 1, opacity: userData.theme.opacity }}
                        />
                      </>
                    )}

                    <motion.div
                      className="flex flex-col items-center gap-4 p-6 relative z-20 w-full max-w-xs mx-auto"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {userData.profileImage && (
                        <motion.div
                          className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl relative"
                          variants={item}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none"></div>
                          <Image
                            src={userData.profileImage}
                            alt={userData.username}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )}

                      <motion.div className="text-center space-y-2" variants={item}>
                        <h2 className="text-2xl font-bold text-white drop-shadow-md">{userData.username}</h2>
                        {userData.profession && (
                          <p className="text-base text-gray-300 font-medium tracking-wide">
                            {userData.profession}
                          </p>
                        )}
                      </motion.div>

                      {userData.bio && (
                        <motion.p
                          className="text-center text-base text-gray-200 font-light leading-relaxed"
                          variants={item}
                        >
                          {userData.bio}
                        </motion.p>
                      )}

                      {userData.socialHandles && userData.socialHandles.length > 0 && (
                        <motion.div className="flex gap-5 my-4" variants={item}>
                          {userData.socialHandles.map((handle, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <SocialIcon
                                platform={handle.platform}
                                url={handle.url}
                                displayStyle="icon"
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {userData.links && userData.links.length > 0 && (
                        <motion.div className="w-full space-y-4" variants={container}>
                          {userData.links.map((link) => (
                            <motion.div
                              key={link.id}
                              variants={item}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <LinkButton
                                title={link.title}
                                url={link.url}
                                buttonStyle={userData.theme.buttonStyle}
                                animation={userData.theme.animation}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
