"use client";

import { useState } from "react";

interface PriceButtonProps {
  label: string;
  price: number;
  color?: string;
  variant?: "colored" | "outline";
  size?: "sm" | "md";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PriceButton({
  label,
  price,
  color = "#0066FF",
  variant = "colored",
  size = "md",
  selected = false,
  onClick,
  className = "",
}: PriceButtonProps) {
  const [tapState, setTapState] = useState<"rest" | "pressed">("rest");

  const shadowHeight = size === "sm" ? 4 : 5;
  const btnHeight = size === "sm" ? 34 : 39;
  const hoverOffset = 2;

  const handlePointerDown = () => setTapState("pressed");
  const handlePointerUp = () => setTapState("rest");

  if (variant === "outline") {
    // Outline variant for spread/total - light background with 3D effect
    return (
      <button
        onClick={onClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`
          relative select-none cursor-pointer
          rounded-[8px] transition-all duration-100 ease-out
          ${className}
        `}
        style={{
          height: `${btnHeight}px`,
          background: "#f0f0f0",
          boxShadow:
            tapState === "pressed"
              ? `0px -${shadowHeight - 2}px 0px 0px rgba(0, 0, 0, 0.08) inset`
              : `0px -${shadowHeight}px 0px 0px rgba(0, 0, 0, 0.08) inset`,
          transform:
            tapState === "pressed"
              ? `translateY(${hoverOffset}px)`
              : "translateY(0px)",
        }}
      >
        <span className="flex w-full justify-between px-3 items-center h-full">
          <span
            className={`
              uppercase tracking-[0.15px] flex-1 text-center
              ${size === "sm" ? "text-[11px]" : "text-xs"} font-semibold leading-[21px]
            `}
          >
            <span className="text-[#666] opacity-80">{label}</span>
            <span className="ml-1.5 text-[#1a1a2e] font-bold" style={{ fontSize: size === "sm" ? "12px" : "14px" }}>
              {price}&#162;
            </span>
          </span>
        </span>
      </button>
    );
  }

  // Colored variant - team color background with 3D inset shadow
  return (
    <button
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`
        relative select-none cursor-pointer
        rounded-[8px] text-white transition-all duration-100 ease-out
        ${className}
      `}
      style={{
        height: `${btnHeight}px`,
        background: color,
        boxShadow:
          tapState === "pressed"
            ? `0px -${shadowHeight - 2}px 0px 0px rgba(0, 0, 0, 0.2) inset`
            : `0px -${shadowHeight}px 0px 0px rgba(0, 0, 0, 0.2) inset`,
        transform:
          tapState === "pressed"
            ? `translateY(${hoverOffset}px)`
            : "translateY(0px)",
      }}
    >
      <span className="flex w-full justify-between px-4 items-center h-full relative">
        <span
          className={`
            uppercase tracking-[0.15px] flex-1 text-center
            ${size === "sm" ? "text-[11px]" : "text-xs"} font-semibold leading-[21px]
          `}
        >
          <span className="opacity-70">{label}</span>
          <span className="ml-1" style={{ opacity: 1, fontSize: size === "sm" ? "13px" : "14px" }}>
            {price}&#162;
          </span>
        </span>
      </span>
    </button>
  );
}
