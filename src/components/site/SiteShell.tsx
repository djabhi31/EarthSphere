"use client";
import { type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { destinationFor } from "./catalog";
import { PageIntro } from "./PageIntro";
import { ContentCompanions } from "./ContentCompanions";
import { SiteFooter } from "./SiteFooter";
import "./content-pages.css";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const preserved = pathname.startsWith("/landing-");
  const immersive = ["/", "/map", "/explore"].includes(pathname);
  const detail = pathname.startsWith("/events/");
  const story = pathname === "/about";
  const page = destinationFor(pathname);
  const Content = pathname === "/" || pathname === "/explore" ? "div" : "main";
  if (preserved) return <><SiteChrome />{children}</>;
  return <MotionConfig reducedMotion="user"><div className={`es-site ${immersive ? "es-immersive" : "es-content-site"}`} data-page={pathname.split("/")[1] || "home"} style={{ "--es-accent": page?.color || "#aac6f2" } as CSSProperties}>
    <a href="#page-content" className="es-skip">Skip to content</a>
    <SiteChrome />
    <Content id="page-content" className={immersive ? "es-immersive-content" : story ? "es-story-page" : "es-page es-content-page"} tabIndex={-1}>
      {!immersive && !detail && !story && page && <PageIntro page={page} />}
      <div id={immersive || story ? undefined : "page-tools"} className={immersive || story ? undefined : "es-page-content es-content-body"}>{children}</div>
      {!immersive && !story && page && <ContentCompanions page={page} />}
    </Content>
    {!["/map", "/explore"].includes(pathname) && <SiteFooter />}
  </div></MotionConfig>;
}
