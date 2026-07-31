'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { glass, radii, spacing, cssVars } from '@/lib/design-tokens';
import { scaleIn, springs } from '@/lib/motion-presets';

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
}

export interface ContextMenuProps {
  children: React.ReactNode;
  items: ContextMenuItem[];
}

/**
 * Premium right-click context menu.
 *
 * @example
 * ```tsx
 * <ContextMenu items={[{ label: 'Copy', onClick: () => {} }]}>
 *   <div className="w-full h-32 bg-gray-900">Right click me</div>
 * </ContextMenu>
 * ```
 */
export function ContextMenu({ children, items }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed z-50 min-w-[200px] flex flex-col py-2"
          style={{
            ...glass.strong,
            borderRadius: radii.md,
            left: position.x,
            top: position.y,
          }}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <button
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
                style={{ color: cssVars.text }}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon && (
                  <span style={{ color: cssVars.textMuted }}>{item.icon}</span>
                )}
                {item.label}
              </button>
              {item.divider && (
                <div
                  className="w-full h-px my-1"
                  style={{ background: cssVars.borderSubtle }}
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div onContextMenu={handleContextMenu} className="w-full h-full">
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(menu, document.body)}
    </>
  );
}
