"use client";

import React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";
import { Magnetic } from "@/components/ui/Magnetic";
import { hover } from "@/lib/motion-presets";
import { cssVars } from "@/lib/design-tokens";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[var(--electric-cyan)] text-[var(--space-black)] font-semibold hover:bg-[var(--electric-cyan)]/90 shadow-md shadow-[var(--electric-cyan)]/15 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/25",
        outline:
          "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white backdrop-blur-md",
        secondary:
          "bg-white/10 text-white hover:bg-white/15 border border-white/5",
        ghost:
          "hover:bg-white/5 hover:text-white/90 text-white/50",
        destructive:
          "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 focus-visible:ring-red-500/30",
        link: "text-[var(--electric-cyan)] underline-offset-4 hover:underline",
        shimmer: "relative overflow-hidden bg-white/5 text-white before:absolute before:inset-0 before:-translate-x-[150%] before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:bg-white/10 hover:before:animate-[shimmer_1.5s_infinite]",
        glow: "bg-transparent text-[var(--electric-cyan)] border border-[var(--electric-cyan)]/50 hover:bg-[var(--electric-cyan)]/10 hover:shadow-[0_0_30px_rgba(0,212,170,0.4)]",
      },
      size: {
        default:
          "h-10 gap-2 px-5 rounded-xl",
        xs: "h-7 gap-1 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 gap-1.5 rounded-lg px-4 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 rounded-xl text-base",
        icon: "size-10 rounded-xl",
        "icon-xs":
          "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8.5 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface CustomButtonProps {
  magnetic?: boolean;
}

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & CustomButtonProps;

function Button({
  className,
  variant = "default",
  size = "default",
  magnetic = true,
  onMouseEnter,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const prefersReduced = useReducedMotion();

  const handleMouseEnter: ButtonProps["onMouseEnter"] = (e) => {
    audioSynth.playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleOnClick: ButtonProps["onClick"] = (e) => {
    audioSynth.playClick();
    if (onClick) onClick(e);
  };

  // Base button primitive with sound hooks and motion
  const buttonEl = (
    <motion.div
      whileHover={prefersReduced ? undefined : variant === "default" || variant === "glow" ? hover.glow : hover.lift}
      whileTap={prefersReduced ? undefined : hover.press}
      className="inline-flex"
    >
      <ButtonPrimitive
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        onMouseEnter={handleMouseEnter}
        onClick={handleOnClick}
        {...props}
      >
      {/* Visual glow ring effect on hover for primary/default buttons */}
      {variant === "default" && !prefersReduced && (
        <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--ice-blue)] opacity-0 blur-md transition-opacity duration-300 group-hover/button:opacity-50" />
      )}
      {children}
      </ButtonPrimitive>
    </motion.div>
  );

  // Wrap button in magnetic wrapper if requested
  if (magnetic && !prefersReduced && variant !== "link") {
    return (
      <Magnetic range={30} strength={0.3}>
        {buttonEl}
      </Magnetic>
    );
  }

  return buttonEl;
}

export { Button, buttonVariants };
