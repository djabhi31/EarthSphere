'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'motion/react';
import { glass, cssVars, radii, spacing, colors } from '@/lib/design-tokens';
import { springs } from '@/lib/motion-presets';

/**
 * Interface for a Toast notification.
 */
export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(2, 9) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/**
 * Hook to trigger toast notifications.
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast('Action successful', { type: 'success' });
 * ```
 */
export function useToast() {
  const { addToast, removeToast } = useToastStore();
  return {
    toast: (message: string, options?: Omit<ToastItem, 'id' | 'message'>) =>
      addToast({ message, ...options }),
    dismiss: removeToast,
  };
}

/**
 * Toast notification container. Mount this at the root layout.
 */
export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  
  return (
    <div
      className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-6 pointer-events-none"
      style={{ gap: spacing[2] }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const iconMap = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '!',
};

const colorMap = {
  success: colors.electricCyan,
  error: colors.warningRed,
  info: colors.electricBlue,
  warning: colors.solarOrange,
};

/**
 * Premium toast notification component.
 *
 * @example
 * ```tsx
 * <Toast toast={{ id: '1', message: 'Hello', type: 'info' }} />
 * ```
 */
export function Toast({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={springs.bouncy}
      className="pointer-events-auto flex items-center gap-3 p-4 min-w-[300px] shadow-lg"
      style={{
        ...glass.default,
        borderRadius: radii.md,
      }}
    >
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm"
        style={{
          background: colorMap[toast.type || 'info'],
          color: colors.spaceBlack,
        }}
      >
        {iconMap[toast.type || 'info']}
      </div>
      <p className="flex-1 text-sm font-medium" style={{ color: cssVars.text }}>
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="opacity-50 hover:opacity-100 transition-opacity"
        style={{ color: cssVars.textMuted }}
        aria-label="Close"
      >
        ✕
      </button>
    </motion.div>
  );
}
