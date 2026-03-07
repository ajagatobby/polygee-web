import type { Variants, Transition } from "motion/react";

// ─── Easing curves (from animations.dev course) ──────────────────────────
export const easing = {
  // For entering/exiting elements (dropdowns, modals, tooltips)
  easeOut: [0.23, 1, 0.32, 1] as const, // quint
  easeOutCubic: [0.215, 0.61, 0.355, 1] as const,
  // For on-screen movement/morphing
  easeInOut: [0.645, 0.045, 0.355, 1] as const, // cubic
  // For hover/color transitions
  ease: [0.25, 0.1, 0.25, 1] as const,
};

// ─── Duration constants (ms → seconds) ───────────────────────────────────
export const duration = {
  micro: 0.1, // 100ms — micro-interactions
  fast: 0.15, // 150ms — hover, active states
  normal: 0.2, // 200ms — standard UI transitions
  medium: 0.25, // 250ms — dropdowns, tooltips
  slow: 0.3, // 300ms — max for UI animations
};

// ─── Shared transition presets ───────────────────────────────────────────
export const transition = {
  enter: {
    duration: duration.normal,
    ease: easing.easeOut,
  } satisfies Transition,
  exit: {
    duration: duration.fast,
    ease: easing.easeOut,
  } satisfies Transition,
  hover: {
    duration: duration.fast,
    ease: easing.ease,
  } satisfies Transition,
  move: {
    duration: duration.normal,
    ease: easing.easeInOut,
  } satisfies Transition,
};

// ─── Fade + slide up (general-purpose enter) ─────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// ─── Fade in (no translate) ──────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// ─── Stagger container ──────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// ─── Stagger child (used inside staggerContainer) ────────────────────────
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

// ─── Sidebar expand/collapse ─────────────────────────────────────────────
export const sidebarExpand: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      height: { duration: duration.normal, ease: easing.easeOut },
      opacity: { duration: duration.fast, ease: easing.easeOut },
      filter: { duration: duration.fast, ease: easing.easeOut },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      height: { duration: duration.medium, ease: easing.easeOut },
      opacity: { duration: duration.normal, ease: easing.easeOut, delay: 0.05 },
      filter: { duration: duration.normal, ease: easing.easeOut, delay: 0.05 },
    },
  },
};

// ─── Card hover lift ─────────────────────────────────────────────────────
export const cardHover = {
  rest: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: transition.hover,
  },
};

// ─── Page-level fade-in ──────────────────────────────────────────────────
export const pageTransition: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

// ─── Dropdown (fade + slide from top) ────────────────────────────────────
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -4,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: "blur(4px)",
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

// ─── Section fade in for detail pages ────────────────────────────────────
export const sectionFadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: duration.medium,
      ease: easing.easeOut,
    },
  }),
};
