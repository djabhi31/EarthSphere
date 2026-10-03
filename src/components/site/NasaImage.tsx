"use client";
/* eslint-disable @next/next/no-img-element -- NASA supplies arbitrary image sizes and hosts. */
import { useState } from "react";
import { ImageOff } from "lucide-react";

export function NasaImage({ src, alt, className, eager = false }: { src?: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className={`es-image-unavailable ${className || ""}`}><ImageOff size={28} strokeWidth={1} /><span>Image preview unavailable</span></div>;
  return <img src={src.replace(/^http:/, "https:")} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} />;
}
