import type { Metadata } from "next";
import CinematicLanding from "@/components/landing/cinematic/CinematicLanding";

export const metadata: Metadata = {
  title: "Cinematic landing — first edition",
  robots: { index: false, follow: false },
};

export default function FirstCinematicLanding() {
  return <CinematicLanding />;
}
