import { motion } from "framer-motion";

export default function Spinner({ size = 32, color = "#fff", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{ width: size, height: size }}
    >
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="5"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
          opacity="0.2"
        />
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="5"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 31.4 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
}
