'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { staggerContainerTight, staggerItem } from '@/lib/motion-presets';
import { cssVars, spacing, typography } from '@/lib/design-tokens';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Animated breadcrumb navigation component.
 *
 * @example
 * ```tsx
 * <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
 * ```
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <motion.nav
      variants={staggerContainerTight}
      initial="hidden"
      animate="visible"
      className={`flex items-center ${className}`}
      style={{ gap: spacing[2] }}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <motion.div
            key={item.label}
            variants={staggerItem}
            className="flex items-center"
            style={{ gap: spacing[2] }}
          >
            {isLast ? (
              <span
                className="font-medium text-sm transition-colors"
                style={{
                  color: cssVars.accent,
                  letterSpacing: typography.tracking.heading,
                }}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  href={item.href || '#'}
                  className="font-medium text-sm transition-colors hover:opacity-80"
                  style={{
                    color: cssVars.textMuted,
                    letterSpacing: typography.tracking.heading,
                  }}
                >
                  {item.label}
                </Link>
                <span
                  className="text-xs opacity-50"
                  style={{ color: cssVars.textMuted }}
                >
                  ›
                </span>
              </>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
