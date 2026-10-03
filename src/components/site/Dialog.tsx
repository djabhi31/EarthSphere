"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/** Native dialogs provide modal focus containment, Escape, and focus restoration. */
export function Dialog({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const prior = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = prior; };
  }, [open]);
  return <dialog ref={ref} className={`es-dialog ${wide ? "es-dialog-wide" : ""}`} aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="es-dialog-inner"><button className="es-dialog-close" aria-label={`Close ${title}`} onClick={onClose}><X size={20} /></button>{open && children}</div>
  </dialog>;
}
