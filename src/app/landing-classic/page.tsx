import type { Metadata } from "next";
import LegacyHomePageClient from "./LegacyHomePageClient";

export const metadata: Metadata = {
  title: "Classic landing page",
  description: "The original EarthSphere landing page, preserved before the October 2026 redesign.",
  robots: { index: false, follow: false },
};

export default function ClassicLandingPage() {
  return <LegacyHomePageClient />;
}
