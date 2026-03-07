"use client";

import { motion } from "motion/react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const sizes = {
  sm: 16,
  md: 24,
  lg: 36,
};

export function Spinner({ size = "md", color = "#1552f0", className }: SpinnerProps) {
  const s = sizes[size];
  const strokeWidth = size === "sm" ? 2.5 : size === "md" ? 2.5 : 3;
  const radius = (s - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={className}
      style={{ width: s, height: s }}
      role="status"
      aria-label="Loading"
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        {/* Track */}
        <circle
          cx={s / 2}
          cy={s / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.15}
        />
        {/* Spinning arc */}
        <motion.circle
          cx={s / 2}
          cy={s / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference * 0.75, rotate: 0 }}
          animate={{
            strokeDashoffset: [
              circumference * 0.75,
              circumference * 0.25,
              circumference * 0.75,
            ],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
}
