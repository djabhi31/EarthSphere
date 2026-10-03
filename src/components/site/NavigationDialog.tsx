"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./navigation.module.css";

export function NavigationDialog({
  open,
  onClose,
  title,
  variant = "tools",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  variant?: "tools" | "search" | "settings";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const priorOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = priorOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={`navigation-${variant}`}
      className={`${styles.dialog} ${styles[variant] || ""}`}
      aria-label={title}
      onCancel={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.dialogSurface}>
        <div className={styles.dialogHeading}>
          <span>{title}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label={`Close ${title}`}>
            <X size={19} />
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
