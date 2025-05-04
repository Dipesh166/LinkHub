"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import SocialIcon from "./social-icon";
import LinkButton from "./link-button";
import { gradients } from "@/lib/features/themeSlice";
import type { UserData } from "@/lib/services/firebase-service";

interface DashboardCardProps {
  profile: UserData;
  onClick?: () => void;
}

export default function DashboardCard({ profile, onClick }: DashboardCardProps) {
  const getBackgroundStyle = () => {
    if (profile.theme.background === "image" && profile.theme.backgroundImage) {
      return {
        backgroundImage: `url(${profile.theme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }

    if (profile.theme.background === "gradient") {
      if (profile.theme.useCustomGradient && profile.theme.customGradient) {
        const { color1, color2, angle } = profile.theme.customGradient
        return { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }
      }
      return { background: gradients[profile.theme.gradientStyle] || gradients.midnight }
    }

    return { background: "#000000" }
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

  return (
    <motion.div
      className="w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative" style={getBackgroundStyle()}>
        {profile.theme.background === "image" && profile.theme.backgroundImage && (
          <>
            <div
              className="absolute inset-0"
              style={{
                zIndex: 0,
                backgroundImage: `url(${profile.theme.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: `blur(${profile.theme.blurAmount}px)`,
              }}
            ></div>
            <div
              className="absolute inset-0 bg-black"
              style={{ zIndex: 1, opacity: profile.theme.opacity }}
            ></div>
          </>
        )}

        <motion.div
          className="relative z-10 p-6 flex flex-col items-center gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {profile.profileImage && (
            <motion.div
              className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30"
              variants={item}
            >
              <Image
                src={profile.profileImage}
                alt={profile.username}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized={profile.profileImage.startsWith('data:')}
              />
            </motion.div>
          )}

          <motion.div className="text-center" variants={item}>
            <h2 className="text-xl font-bold text-white">{profile.username}</h2>
            {profile.profession && (
              <p className="text-sm text-gray-300">{profile.profession}</p>
            )}
          </motion.div>

          {profile.bio && (
            <motion.p 
              className="text-center text-sm text-gray-200 line-clamp-2"
              variants={item}
            >
              {profile.bio}
            </motion.p>
          )}

          {profile.socialHandles && profile.socialHandles.length > 0 && (
            <motion.div className="flex gap-3" variants={item}>
              {profile.socialHandles.slice(0, 3).map((handle, index) => (
                <SocialIcon
                  key={index}
                  platform={handle.platform}
                  url={handle.url}
                  displayStyle="icon"
                />
              ))}
              {profile.socialHandles.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">
                  +{profile.socialHandles.length - 3}
                </div>
              )}
            </motion.div>
          )}

          <motion.div className="w-full space-y-2" variants={container}>
            {profile.links.slice(0, 2).map((link, index) => (
              <motion.div key={link.id} variants={item}>
                <LinkButton
                  title={link.title}
                  url={link.url}
                  buttonStyle={profile.theme.buttonStyle}
                  animation={profile.theme.animation}
                />
              </motion.div>
            ))}
            {profile.links.length > 2 && (
              <motion.p className="text-center text-sm text-gray-400">
                +{profile.links.length - 2} more links
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}