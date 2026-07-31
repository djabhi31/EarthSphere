'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cssVars, spacing, radii, glass } from '@/lib/design-tokens';
import { springs } from '@/lib/motion-presets';

interface AccordionItemType {
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemType[];
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Smooth expanding accordion component.
 *
 * @example
 * ```tsx
 * <Accordion items={[{ title: 'Item 1', content: 'Content 1' }]} />
 * ```
 */
export function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`flex flex-col ${className}`} style={{ gap: spacing[2] }}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={index}
            className="overflow-hidden"
            style={{
              ...glass.subtle,
              borderRadius: radii.md,
            }}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
              style={{ color: cssVars.text }}
            >
              <span className="font-medium text-sm">{item.title}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={springs.snappy}
                className="text-xs"
                style={{ color: cssVars.textMuted }}
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={springs.gentle}
                >
                  <div
                    className="p-4 pt-0 text-sm"
                    style={{
                      color: cssVars.textSecondary,
                      borderTop: `1px solid ${cssVars.borderSubtle}`,
                    }}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
