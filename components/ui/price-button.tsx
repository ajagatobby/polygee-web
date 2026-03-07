"use client";

import { useState } from "react";

type PriceButtonSize = "sm" | "md" | "lg";
type PriceButtonColor = "custom" | "gray";

interface PriceButtonProps {
  label: string;
  price: number;
  color?: PriceButtonColor;
  customColor?: string;
  size?: PriceButtonSize;
  dimmed?: boolean;
  onClick?: () => void;
  className?: string;
}

// Polymarket exact size configs
const sizeConfig: Record<PriceButtonSize, { height: number; shadowHeight: number; hoverOffset: number }> = {
  sm: { height: 33, shadowHeight: 3, hoverOffset: 2 },
  md: { height: 39, shadowHeight: 5, hoverOffset: 2 },
  lg: { height: 53, shadowHeight: 5, hoverOffset: 2 },
};

export function PriceButton({
  label,
  price,
  color = "custom",
  customColor = "#1552f0",
  size = "sm",
  dimmed = false,
  onClick,
  className = "",
}: PriceButtonProps) {
  const [tapState, setTapState] = useState<"rest" | "pressed">("rest");

  const { height, shadowHeight, hoverOffset } = sizeConfig[size];
  const isGray = color === "gray";

  // Polymarket gray button vars
  const grayBg = "var(--color-bg-tertiary, #eef1f5)";
  const grayText = "var(--color-text-primary, #0d1117)";

  const bg = isGray ? grayBg : customColor;
  const textColor = isGray ? grayText : "#fff";
  const shadowOpacity = isGray ? 0.08 : 0.2;

  const currentShadowHeight = tapState === "pressed" ? Math.max(shadowHeight - 2, 1) : shadowHeight;
  const translateY = tapState === "pressed" ? hoverOffset : 0;

  const handlePointerDown = () => setTapState("pressed");
  const handlePointerUp = () => setTapState("rest");

  // For lg (spread/total) buttons, use left-aligned layout
  const isWide = size === "lg";

  return (
    <span
      className={`${dimmed ? "opacity-60" : "opacity-100"} transition-opacity duration-100 ${className}`}
      style={{ display: "flex", height: `${height + (shadowHeight - currentShadowHeight)}px`, flex: "1 1 0%", width: "100%", maxWidth: "100%" }}
    >
      <button
        type="button"
        onClick={onClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full max-w-full select-none cursor-pointer rounded-[8px] transition-all duration-100 ease-out"
        style={{
          height: `${height}px`,
          background: bg,
          color: textColor,
          boxShadow: `0px -${currentShadowHeight}px 0px 0px rgba(0, 0, 0, ${shadowOpacity}) inset`,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <span className="flex w-full h-full items-center">
          <span
            className={`
              flex w-full items-center h-full
              ${isWide ? "justify-between px-1" : "justify-between px-4 max-lg:px-1"}
            `}
          >
            {isWide ? (
              /* Spread/Total: left-aligned label+value, price right */
              <p
                className="uppercase leading-[21px] tracking-[0.15px] flex-1 h-full text-left flex items-center px-2 whitespace-nowrap min-w-0 overflow-hidden text-xs font-semibold"
                style={{ color: "inherit", lineHeight: "21px", margin: 0 }}
              >
                <span className="opacity-70 flex-1 whitespace-nowrap min-w-0 flex items-center gap-1">
                  {label}
                </span>
                <span className="ml-1 text-sm" style={{ opacity: 1 }}>
                  {price}%
                </span>
              </p>
            ) : (
              /* Moneyline: centered label + price */
              <span className="uppercase leading-[21px] tracking-[0.15px] flex-1 h-full text-xs font-semibold text-center flex items-center justify-center">
                <span className="opacity-70">{label}</span>
                <span className="ml-1 text-sm" style={{ opacity: 1 }}>
                  {price}%
                </span>
              </span>
            )}
          </span>
        </span>
      </button>
    </span>
  );
}
