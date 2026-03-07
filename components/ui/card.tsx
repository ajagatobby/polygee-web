"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hoverable = false,
      padding = "md",
      border = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          bg-bg-card rounded-[var(--radius-lg)]
          ${border ? "border border-border-secondary" : ""}
          ${paddingStyles[padding]}
          ${
            hoverable
              ? "transition-all duration-200 ease-out hover:shadow-[var(--shadow-md)] hover:border-border-primary hover:-translate-y-[1px] cursor-pointer"
              : ""
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
