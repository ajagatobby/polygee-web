"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "green" | "red" | "blue" | "amber";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const colorStyles = {
  green: "bg-brand-green",
  red: "bg-brand-red",
  blue: "bg-brand-blue",
  amber: "bg-brand-amber",
};

const trackColorStyles = {
  green: "bg-brand-green/10",
  red: "bg-brand-red/10",
  blue: "bg-brand-blue/10",
  amber: "bg-brand-amber/10",
};

const sizeStyles = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

export function ProgressBar({
  value,
  max = 100,
  color = "blue",
  size = "md",
  showLabel = false,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-text-secondary">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-text-primary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full rounded-[var(--radius-full)] overflow-hidden
          ${trackColorStyles[color]}
          ${sizeStyles[size]}
        `}
      >
        <div
          className={`
            h-full rounded-[var(--radius-full)]
            transition-all duration-500 ease-out
            ${colorStyles[color]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
