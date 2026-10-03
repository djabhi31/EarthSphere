"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Navbar as ClassicNavbar } from "./ClassicNavbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

/** Preserved landing editions keep their original navigation. */
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname === "/landing-v1" || pathname === "/explore") return null;
  if (pathname === "/landing-classic") return <><ScrollProgress /><ClassicNavbar /><CustomCursor /></>;
  return <Navbar key={pathname} />;
}
