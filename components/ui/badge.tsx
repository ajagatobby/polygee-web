"use client";

import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "info" | "live";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-tertiary text-text-secondary",
  success: "bg-brand-green-light text-brand-green-dark",
  danger: "bg-brand-red-light text-brand-red",
  warning: "bg-brand-amber-light text-brand-amber",
  info: "bg-brand-blue-light text-brand-blue",
  live: "bg-brand-red text-white",
};

const sizeStyles = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
};

export function Badge({
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold uppercase tracking-wide
        rounded-[var(--radius-full)]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full
            ${variant === "live" ? "bg-white animate-pulse-soft" : "bg-current"}
          `}
        />
      )}
      {children}
    </span>
  );
}
