"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useScroll, useVelocity, useSpring, useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------ */
/*  Types for 4K Space Background                                     */
/* ------------------------------------------------------------------ */
interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  isGiant: boolean;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string; // "r, g, b"
  opacity: number;
  vx: number;
  vy: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number; // decays from 1 to 0
  decay: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
}

export function ParticleField({
  className,
  particleCount = 260, // High density for 4K space feel
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>(0);

  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollSmooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const scrollVelocity = useVelocity(scrollSmooth);

  // ── Create Nebulae Gas Clouds ─────────────────────────────────────────────
  const createNebulae = useCallback((width: number, height: number): Nebula[] => {
    return [
      {
        x: width * 0.2,
        y: height * 0.3,
        radius: Math.min(width, height) * 0.45,
        color: "124, 58, 237", // cosmic purple
        opacity: 0.12,
        vx: 0.08,
        vy: 0.05
      },
      {
        x: width * 0.7,
        y: height * 0.2,
        radius: Math.min(width, height) * 0.5,
        color: "26, 39, 68", // deep indigo blue
        opacity: 0.15,
        vx: -0.06,
        vy: 0.08
      },
      {
        x: width * 0.45,
        y: height * 0.75,
        radius: Math.min(width, height) * 0.4,
        color: "0, 212, 170", // electric cyan
        opacity: 0.07,
        vx: 0.05,
        vy: -0.05
      },
      {
        x: width * 0.8,
        y: height * 0.8,
        radius: Math.min(width, height) * 0.35,
        color: "255, 107, 53", // solar orange / dust
        opacity: 0.06,
        vx: -0.04,
        vy: -0.04
      }
    ];
  }, []);

  // ── Create Multi-layered Stars ───────────────────────────────────────────
  const createParticles = useCallback((width: number, height: number): Particle[] => {
    const particles: Particle[] = [];
    const starColors = [
      "255, 255, 255", // Pure white
      "248, 250, 252", // slate white
      "224, 242, 254", // sky blue star
      "254, 243, 199", // warm yellow star
      "254, 226, 226"  // soft red dwarf
    ];

    const count = prefersReduced ? Math.floor(particleCount / 3) : particleCount;

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let radius = 0.5;
      let baseOpacity = 0.2;
      let speed = 0.02;
      let isGiant = false;
      const starColor = starColors[Math.floor(Math.random() * starColors.length)];

      if (rand < 0.7) {
        // Distant stars - background layer
        radius = Math.random() * 0.45 + 0.15;
        baseOpacity = Math.random() * 0.22 + 0.05;
        speed = Math.random() * 0.01 + 0.005;
      } else if (rand < 0.95) {
        // Mid-ground stars
        radius = Math.random() * 0.7 + 0.45;
        baseOpacity = Math.random() * 0.35 + 0.25;
        speed = Math.random() * 0.03 + 0.01;
      } else {
        // Foreground giant / sparkling stars
        radius = Math.random() * 1.1 + 0.9;
        baseOpacity = Math.random() * 0.35 + 0.55;
        speed = Math.random() * 0.08 + 0.03;
        isGiant = true;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        opacity: baseOpacity,
        baseOpacity,
        speed,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColor,
        isGiant
      });
    }
    return particles;
  }, [particleCount, prefersReduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ── Size ──────────────────────────────────────────────────────────
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    setSize();
    const initWidth = canvas.getBoundingClientRect().width;
    const initHeight = canvas.getBoundingClientRect().height;
    
    particlesRef.current = createParticles(initWidth, initHeight);
    nebulaeRef.current = createNebulae(initWidth, initHeight);
    meteorsRef.current = [];

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      setSize();
      const rect = canvas.getBoundingClientRect();
      particlesRef.current = createParticles(rect.width, rect.height);
      nebulaeRef.current = createNebulae(rect.width, rect.height);
      meteorsRef.current = [];
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Mouse tracking ────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // ── Static render (reduced motion fallback) ───────────────────────
    if (prefersReduced) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Draw static nebulae
      nebulaeRef.current.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, `rgba(${n.color}, ${n.opacity * 0.7})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Draw static stars
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.baseOpacity})`;
        ctx.fill();
      });

      return () => {
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    // ── Animation loop ────────────────────────────────────────────────
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      // Clear canvas with deep space transparency
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Nebula Clouds
      nebulaeRef.current.forEach((n) => {
        // Slow nebula drift
        n.x += n.vx;
        n.y += n.vy;

        // Bounce boundaries
        if (n.x < -n.radius || n.x > w + n.radius) n.vx *= -1;
        if (n.y < -n.radius || n.y > h + n.radius) n.vy *= -1;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, `rgba(${n.color}, ${n.opacity})`);
        grad.addColorStop(0.5, `rgba(${n.color}, ${n.opacity * 0.4})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // 2. Spawn and Draw Meteors / Shooting Stars
      if (Math.random() < 0.0025 && meteorsRef.current.length < 3) {
        meteorsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.4,
          length: Math.random() * 90 + 40,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 6 + Math.random() * (Math.PI / 12), // downwards diagonal
          opacity: Math.random() * 0.8 + 0.2,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015
        });
      }

      meteorsRef.current = meteorsRef.current.filter((m) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.life -= m.decay;

        if (m.life > 0) {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            m.x, m.y, 
            m.x - Math.cos(m.angle) * m.length, 
            m.y - Math.sin(m.angle) * m.length
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity * m.life})`);
          grad.addColorStop(0.4, `rgba(56, 189, 248, ${m.opacity * m.life * 0.5})`); // Ice blue tail flare
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.lineCap = "round";
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(
            m.x - Math.cos(m.angle) * m.length, 
            m.y - Math.sin(m.angle) * m.length
          );
          ctx.stroke();
          return true;
        }
        return false;
      });

      // 3. Draw Stars
      const velocityVal = scrollVelocity.get();
      const stretchFactor = velocityVal * 150; // Star streaking multiplier

      particlesRef.current.forEach((p) => {
        // Drift upward
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        // Twinkle opacity oscillation
        p.twinklePhase += p.twinkleSpeed;
        p.opacity = p.baseOpacity + Math.sin(p.twinklePhase) * p.baseOpacity * 0.3;

        // Parallax mouse interaction
        let drawX = p.x;
        let drawY = p.y;
        if (mouseRef.current.active) {
          const dx = (mouseRef.current.x - w / 2) / w;
          const dy = (mouseRef.current.y - h / 2) / h;
          const parallaxFactor = p.radius * 9;
          drawX += dx * parallaxFactor;
          drawY += dy * parallaxFactor;
        }

        const opacityClamped = Math.max(0.02, Math.min(1.0, p.opacity));

        ctx.beginPath();
        if (Math.abs(stretchFactor) > 0.5) {
          // Scrolling: Stretch stars into hyperspace streaks
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX, drawY - stretchFactor * p.radius * 2);
          ctx.strokeStyle = `rgba(${p.color}, ${opacityClamped})`;
          ctx.lineWidth = p.radius * 2;
          ctx.lineCap = "round";
          ctx.stroke();
        } else {
          // Static: Draw circular stars
          ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${opacityClamped})`;
          ctx.fill();

          // Giant foreground stars: Draw 4-point cross lens flare
          if (p.isGiant && p.opacity > p.baseOpacity) {
            const flareSize = p.radius * 3.5 * p.opacity;
            ctx.strokeStyle = `rgba(${p.color}, ${opacityClamped * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(drawX - flareSize, drawY);
            ctx.lineTo(drawX + flareSize, drawY);
            ctx.moveTo(drawX, drawY - flareSize);
            ctx.lineTo(drawX, drawY + flareSize);
            ctx.stroke();
          }
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [createParticles, createNebulae, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 h-full w-full", className)}
    />
  );
}
