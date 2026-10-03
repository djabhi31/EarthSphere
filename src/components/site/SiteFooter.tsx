"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUp, ArrowUpRight, Globe2, Orbit } from "lucide-react";
import { DESTINATIONS, type Destination } from "./catalog";
import styles from "./site-footer.module.css";

const GROUPS: { group: Destination["group"]; title: string; number: string }[] = [
  { group: "Earth", title: "Our planet", number: "01" },
  { group: "Space", title: "Beyond Earth", number: "02" },
  { group: "Discover", title: "Discover more", number: "03" },
];
const SOCIALS = [
  { label: "Abhilash on GitHub", href: "https://github.com/djabhi31", icon: "github" },
  { label: "Abhilash on LinkedIn", href: "https://linkedin.com/in/abhilash-ghosh-8b5a711b1/", icon: "linkedin" },
  { label: "DJ ABHI on Instagram", href: "https://www.instagram.com/djabhi.31", icon: "instagram" },
  { label: "DJ ABHI on YouTube", href: "https://www.youtube.com/@djabhimaheshtala", icon: "youtube" },
] as const;
const SOURCES = [
  { label: "NASA Open APIs", href: "https://api.nasa.gov/" },
  { label: "NASA EONET", href: "https://eonet.gsfc.nasa.gov/" },
  { label: "NASA / JPL", href: "https://www.jpl.nasa.gov/" },
];

// Brand marks are local: the installed Lucide version provides general-purpose icons only.
function SocialIcon({ name }: { name: typeof SOCIALS[number]["icon"] }) {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "github" && <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.4a5.8 5.8 0 0 0-1.6-4 5.4 5.4 0 0 0-.1-4s-1.3-.4-4.2 1.6a14.4 14.4 0 0 0-7.6 0C4.3-.4 3 0 3 0a5.4 5.4 0 0 0-.1 4 5.8 5.8 0 0 0-1.6 4c0 5.8 3.4 7 6.7 7.4a3.4 3.4 0 0 0-1 2.7V22" transform="translate(2 2) scale(.87)" /></>}
    {name === "linkedin" && <><rect x="3" y="9" width="4" height="12" /><circle cx="5" cy="4" r="2" /><path d="M11 21V9h4v2a4 4 0 0 1 7 3v7h-4v-7a1.5 1.5 0 0 0-3 0v7z" /></>}
    {name === "instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></>}
    {name === "youtube" && <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 6 3-6 3z" /></>}
  </svg>;
}

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end end"] });
  const earthY = useTransform(scrollYProgress, [0, 1], [35, -30]);
  const earthRotate = useTransform(scrollYProgress, [0, 1], [-14, 0]);
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [28, 0]);

  function backToTop() {
    document.getElementById("page-content")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  }

  return <footer ref={root} id="site-footer" className={styles.footer} aria-labelledby="footer-title">
    <div className={styles.topLine} aria-hidden="true"><motion.i style={reduced ? undefined : { scaleX: scrollYProgress }} /></div>
    <div className={styles.inner}>
      <div className={styles.invitation}>
        <div className={styles.invitationCopy}>
          <p className={styles.eyebrow}><span /> FOR THE ENDLESSLY CURIOUS</p>
          <h2 id="footer-title">A whole world.<br /><em>Still to discover.</em></h2>
          <Link href="/explore" prefetch={false} className={styles.launch}>Take another look<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className={styles.planetScene} aria-hidden="true">
          <div className={styles.planetOrbit} />
          <motion.div className={styles.planet} style={reduced ? undefined : { y: earthY, rotate: earthRotate }}>
            <Image src="/images/landing/earth-portrait.webp" width={520} height={520} alt="" unoptimized />
          </motion.div>
          <div className={styles.planetShade} />
          <span className={styles.planetLabel}><i />EARTH / OUR SHARED HOME</span>
          <span className={styles.planetCross}>+</span>
        </div>
      </div>

      <div className={styles.directory}>
        <div className={styles.identity}>
          <Link href="/" className={styles.brand} aria-label="EarthSphere home"><Orbit size={27} strokeWidth={1.2} aria-hidden="true" /><span>EarthSphere<span>.</span></span></Link>
          <p>One planet. Countless perspectives.<br />An open invitation to understand<br className={styles.desktopBreak} /> the world and the worlds beyond.</p>
          <Link href="/about#creator" prefetch={false} className={styles.creator}>
            <Image src="/images/creator/abhilash-ghosh.webp" width={42} height={42} alt="" unoptimized />
            <span><small>MADE WITH CURIOSITY BY</small><strong>Abhilash Ghosh</strong></span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <nav className={styles.socials} aria-label="Creator social profiles">{SOCIALS.map(social => <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} (opens in a new tab)`} title={social.label}><SocialIcon name={social.icon} /></a>)}</nav>
        </div>
        <nav className={styles.navigation} aria-label="Explore EarthSphere">{GROUPS.map(({ group, title, number }) => <div className={styles.linkGroup} key={group}>
          <h3><span>{number}</span>{title}</h3>
          <ul>{DESTINATIONS.filter(item => item.group === group).map(item => <li key={item.href}><Link href={item.href} prefetch={false} aria-current={pathname === item.href ? "page" : undefined}><span>{item.label}</span><ArrowUpRight size={12} aria-hidden="true" /></Link></li>)}</ul>
        </div>)}</nav>
      </div>

      <div className={styles.foundation}>
        <p><Globe2 size={15} strokeWidth={1.3} aria-hidden="true" />Built on open science.<span>Made for everyone.</span></p>
        <nav aria-label="Footer scientific sources">{SOURCES.map(source => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={11} aria-hidden="true" /><span className={styles.srOnly}> (opens in a new tab)</span></a>)}</nav>
      </div>

      <div className={styles.wordmarkFrame} aria-hidden="true"><motion.div className={styles.wordmark} style={reduced ? undefined : { y: wordmarkY }}>earthsphere<span>.</span></motion.div></div>

      <div className={styles.bottom}>
        <div className={styles.legal}><span>© {new Date().getUTCFullYear()} EarthSphere</span><p>An independent project, inspired by NASA. Not affiliated with or endorsed by NASA.</p></div>
        {pathname === "/" && <nav className={styles.editions} aria-label="Previous landing designs"><Link href="/landing-v1" prefetch={false}>Previous design</Link><Link href="/landing-classic" prefetch={false}>Original design</Link></nav>}
        <button type="button" className={styles.backToTop} onClick={backToTop}>Back to top<span><ArrowUp size={16} aria-hidden="true" /></span></button>
      </div>
    </div>
  </footer>;
}
