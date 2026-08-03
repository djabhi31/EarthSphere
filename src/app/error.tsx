"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ui/ParticleField";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, springs, hover } from "@/lib/motion-presets";
import { colors, gradients } from "@/lib/design-tokens";

/**
 * Global error boundary component with premium space-themed aesthetics.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-canvas">
      <ParticleField className="fixed inset-0 z-0 pointer-events-none" />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative z-10 glass rounded-3xl p-8 md:p-12 max-w-lg w-full text-center border border-destructive/20 shadow-2xl shadow-destructive/10"
      >
        <motion.div 
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-8 relative"
        >
          <AlertTriangle className="w-10 h-10 text-destructive" />
          <div className="absolute inset-0 rounded-full border border-destructive/30 animate-ping opacity-50" style={{ animationDuration: '3s' }} />
        </motion.div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 font-display tracking-tight">
          System Interruption
        </h1>
        
        <p className="text-text-secondary mb-8 leading-relaxed tracking-tight">
          We encountered an unexpected error while fetching data from Earth&apos;s orbital network. 
          {error.message && (
            <span className="block mt-4 font-mono text-xs text-destructive/80 p-3 bg-destructive/5 rounded-md border border-destructive/10 text-left overflow-x-auto">
              {error.message}
            </span>
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={hover.lift} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => reset()}
              className="rounded-full bg-text-primary text-canvas hover:bg-text-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all w-full sm:w-auto h-10"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </motion.div>
          <motion.div whileHover={hover.lift} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/"
              className="inline-flex items-center justify-center h-10 px-4 py-2 border border-border text-sm font-medium rounded-full bg-surface/50 hover:bg-surface transition-colors w-full sm:w-auto text-text-primary"
            >
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
