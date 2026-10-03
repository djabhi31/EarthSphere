"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  motion, MotionConfig, useInView, useMotionValueEvent,
  useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from "motion/react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, AudioLines, ChevronRight, Crosshair,
  Globe2, Menu, Orbit, Pause, Play, Radio, Satellite, ScanLine, Sparkles,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import styles from "./cinematic.module.css";

const OrbitalEarth = dynamic(() => import("./OrbitalEarth"), {
  ssr: false,
  loading: () => <div className={styles.planetFallback} />,
});
const FEED_FILTERS = { status: "open" as const, limit: 4 };
const CHAPTERS = [
  { title: "A planet in motion.", label: "Observe Earth", icon: Globe2, description: "Follow wildfires, watch storms develop, and connect the dots with NASA’s Earth Observatory data.", href: "/map", action: "Open the event map", meta: "01 / EARTH OBSERVATION" },
  { title: "Find your place in orbit.", label: "Follow the orbit", icon: Satellite, description: "Look up. Track satellites above our planet and explore the orbital paths that connect us to space.", href: "/satellites", action: "Explore satellite orbits", meta: "02 / ORBITAL PERSPECTIVE" },
  { title: "Curiosity has no limit.", label: "Look beyond", icon: Sparkles, description: "From the surface of Mars to worlds around distant stars. Discover the universe through NASA’s lens.", href: "/apod", action: "Discover the cosmos", meta: "03 / DEEP SPACE" },
];
const subscribeWide = (callback: () => void) => {
  const query = window.matchMedia("(min-width: 900px) and (min-height: 700px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getWide = () => window.matchMedia("(min-width: 900px) and (min-height: 700px)").matches;
const getServerWide = () => false;

function Brand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={styles.brand} aria-label="EarthSphere home">
    <span className={styles.brandMark}><Orbit size={footer ? 32 : 27} strokeWidth={1.25} /></span>
    <span>earthsphere<span className={styles.brandPeriod}>.</span></span>
  </Link>;
}

function Reveal({ children, className, animated, delay = 0 }: {
  children: ReactNode; className?: string; animated: boolean; delay?: number;
}) {
  return <motion.div className={className} initial={animated ? { opacity: 0, y: 28 } : false}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}

function Navigation({ animated, paused, onToggle }: { animated: boolean; paused: boolean; onToggle: () => void }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", value => setScrolled(value > 40));
  return <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
    <div className={styles.navInner}>
      <Brand />
      <nav className={styles.desktopNav} aria-label="Main navigation">
        <a href="#perspectives">Discover <span>03</span></a>
        <a href="#observations">Live observations</a>
        <a href="#mission">Our mission</a>
      </nav>
      <div className={styles.navActions}>
        <button className={styles.motionToggle} onClick={onToggle} aria-label={paused ? "Resume animations" : "Pause animations"} aria-pressed={paused} title={paused ? "Resume animations" : "Pause animations"}>
          {animated ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <Link href="/explore" className={styles.navLaunch}>Enter EarthSphere <ArrowUpRight size={15} /></Link>
        <details className={styles.mobileMenu} ref={menu} onKeyDown={event => {
          if (event.key === "Escape" && menu.current) {
            menu.current.open = false;
            menu.current.querySelector("summary")?.focus();
          }
        }}>
          <summary aria-label="Toggle navigation"><Menu size={22} /></summary>
          <nav aria-label="Mobile navigation" onClick={event => {
            if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
          }}>
            <a href="#perspectives">Discover <ArrowDown size={16} /></a>
            <a href="#observations">Live observations <Radio size={16} /></a>
            <a href="#mission">Our mission <ArrowDown size={16} /></a>
            <Link href="/explore">Enter EarthSphere <ArrowUpRight size={16} /></Link>
          </nav>
        </details>
      </div>
    </div>
  </header>;
}

function Hero({ animated }: { animated: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 28 });
  const earthY = useTransform(smooth, [0, 1], [0, 190]);
  const earthScale = useTransform(smooth, [0, 1], [1, 1.16]);
  const copyY = useTransform(smooth, [0, 1], [0, -75]);
  const copyOpacity = useTransform(smooth, [0, 0.7], [1, 0.05]);
  return <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.stars} aria-hidden="true" />
    <div className={styles.heroAmbient} aria-hidden="true" />
    <motion.div className={styles.planetStage} style={animated ? { y: earthY, scale: earthScale } : undefined} aria-hidden="true">
      <div className={styles.planetHalo} />
      <div className={styles.orbitLine} />
      <OrbitalEarth progress={smooth} animated={animated} />
      <span className={styles.planetCoordinate}><span />23.4° AXIAL TILT</span>
      <span className={styles.planetCaption}>SOL III <span>•</span> OUR ONLY HOME</span>
    </motion.div>
    <div className={styles.heroShade} aria-hidden="true" />
    <motion.div className={styles.heroContent} style={animated ? { y: copyY, opacity: copyOpacity } : undefined}>
      <Reveal animated={animated}>
        <p className={styles.eyebrow}><span className={styles.statusDot} /> A LITTLE CLOSER TO EVERYTHING</p>
      </Reveal>
      <h1 id="hero-title" className={styles.heroTitle}>
        {['One planet.', 'Infinite', 'perspective.'].map((line, index) => <span className={styles.titleLine} key={line}>
          <motion.span initial={animated ? { y: "110%", rotate: 3 } : false} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1.15, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}>{line}</motion.span>
        </span>)}
      </h1>
      <Reveal animated={animated} delay={0.45}>
        <p className={styles.heroDescription}>A living planet. An ever-expanding universe.<br />See it all come together through the power of NASA data.</p>
        <div className={styles.heroButtons}>
          <Link href="/explore" className={styles.primaryButton}>Explore the planet <ArrowUpRight size={18} /></Link>
          <a href="#perspectives" className={styles.textButton}><span className={styles.playIcon}><ArrowDown size={15} /></span> Take a closer look</a>
        </div>
      </Reveal>
    </motion.div>
    <div className={styles.heroBottom}>
      <a className={styles.scrollCue} href="#mission"><span className={styles.scrollTrack}><span /></span> SCROLL TO CHANGE YOUR PERSPECTIVE</a>
      <span className={styles.heroNote}><Crosshair size={13} /> EARTH OBSERVATION, OPEN TO EVERYONE</span>
    </div>
  </section>;
}

function Word({ children, progress, index, count, animated }: {
  children: string; progress: MotionValue<number>; index: number; count: number; animated: boolean;
}) {
  const opacity = useTransform(progress, [index / count, (index + 1) / count], [0.2, 1]);
  return <motion.span style={animated ? { opacity } : undefined} aria-hidden="true">{children} </motion.span>;
}

function Mission({ animated }: { animated: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.45"] });
  const words = "The more we see, the more we understand. And there’s a whole world worth understanding.".split(" ");
  return <>
    <div className={styles.sourceStrip}>
      <span className={styles.sourceIntro}>CURIOSITY, POWERED BY OPEN SCIENCE</span>
      <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className={styles.nasaWord}>NASA<span>OPEN DATA</span></a>
      <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">EONET <span>EARTH OBSERVATORY</span></a>
      <a href="https://www.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer">JPL <span>JET PROPULSION LABORATORY</span></a>
      <span className={styles.sourceCount}>13+ <span>NASA DATA SOURCES</span></span>
    </div>
    <section id="mission" ref={ref} className={styles.mission} aria-labelledby="mission-title">
      <p className={styles.eyebrow}><span className={styles.tinyCross}>+</span> THE BIGGER PICTURE</p>
      <h2 id="mission-title" aria-label={words.join(" ")} className={styles.missionStatement}>
        {words.map((word, index) => <Word key={`${word}-${index}`} progress={scrollYProgress} index={index} count={words.length} animated={animated}>{word}</Word>)}
      </h2>
      <Reveal animated={animated} className={styles.missionFoot}>
        <span className={styles.missionLine} />
        <p>EarthSphere brings Earth observation, orbital tracking, and deep-space discovery into one extraordinary point of view. Yours.</p>
      </Reveal>
    </section>
  </>;
}

function ChapterVisual({ active }: { active: number }) {
  return <div className={`${styles.chapterVisual} ${styles[`visual${active}`]}`}>
    {active === 0 && <>
      <div className={styles.mapTexture} />
      <div className={styles.mapGrid} />
      <div className={styles.mapCrosshair}><ScanLine size={26} strokeWidth={1} /></div>
      {[{ x: 23, y: 39 }, { x: 47, y: 34 }, { x: 73, y: 60 }, { x: 82, y: 41 }, { x: 35, y: 66 }].map((point, i) => <span key={i} className={styles.mapPoint} style={{ left: `${point.x}%`, top: `${point.y}%`, animationDelay: `${i * 0.6}s` }} />)}
      <span className={styles.visualMicro}>A CONNECTED VIEW OF OUR PLANET</span>
      <span className={styles.mapLegend}><span /> ILLUSTRATIVE OBSERVATION LAYER</span>
    </>}
    {active === 1 && <div className={styles.orbitalDiagram}>
      <div className={styles.diagramOrbit}><Satellite size={22} /></div>
      <div className={styles.diagramOrbitTwo} />
      <div className={styles.diagramOrbitThree} />
      <div className={styles.diagramPlanet} />
      <span className={styles.visualMicro}>A DIFFERENT KIND OF WORLD VIEW</span>
      <span className={styles.mapLegend}>ILLUSTRATIVE ORBITAL PATH</span>
    </div>}
    {active === 2 && <>
      <Image src="/images/landing/nebula.webp" alt="Hubble’s view of the Ant Nebula: glowing orange lobes of gas expanding from a dying star" fill sizes="(max-width: 899px) 100vw, 60vw" className={styles.nebulaImage} />
      <div className={styles.nebulaShade} />
      <span className={styles.visualMicro}>THE UNIVERSE IS CALLING</span>
      <span className={styles.mapLegend}>ANT NEBULA · NASA / STScI</span>
    </>}
    <div className={styles.visualCornerTop} /><div className={styles.visualCornerBottom} />
  </div>;
}

function Perspectives({ animated }: { animated: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const wide = useSyncExternalStore(subscribeWide, getWide, getServerWide);
  const reducedMotion = useReducedMotion();
  // Pausing decorative animation must not collapse the page beneath the reader.
  const sticky = wide && !reducedMotion;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (sticky) setActive(Math.min(2, Math.floor(value * 3)));
  });
  const selectChapter = (index: number) => {
    setActive(index);
    if (sticky && ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      const distance = ref.current.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + distance * ((index + 0.18) / 3), behavior: animated ? "smooth" : "instant" });
    }
  };
  return <section id="perspectives" ref={ref} className={`${styles.perspectives} ${sticky ? styles.perspectivesSticky : ""}`} aria-labelledby="perspectives-title">
    <div className={styles.perspectivesInner}>
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}><span className={styles.tinyCross}>+</span> FOLLOW YOUR CURIOSITY</p><h2 id="perspectives-title">A little closer.<br /><span>A lot more extraordinary.</span></h2></div>
        <p>From the world beneath your feet<br />to everything beyond it.</p>
      </div>
      <div className={styles.chapterLayout}>
        <div className={styles.chapterControls}>
          <div className={styles.chapterTabs} role="tablist" aria-label="Choose a perspective" aria-orientation="vertical">
            {CHAPTERS.map((chapter, index) => <button key={chapter.label} role="tab" id={`perspective-tab-${index}`} aria-controls="perspective-panel" aria-selected={index === active} tabIndex={index === active ? 0 : -1} className={`${styles.chapterTab} ${index === active ? styles.activeTab : ""}`}
              onClick={() => selectChapter(index)} onKeyDown={event => {
                let next: number | undefined;
                if (event.key === "ArrowDown") next = (index + 1) % 3;
                if (event.key === "ArrowUp") next = (index + 2) % 3;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = 2;
                if (next !== undefined) {
                  event.preventDefault();
                  selectChapter(next);
                  document.getElementById(`perspective-tab-${next}`)?.focus({ preventScroll: true });
                }
              }}><span className={styles.chapterNumber}>0{index + 1}</span><chapter.icon size={19} strokeWidth={1.5} /><span>{chapter.label}</span><ChevronRight size={17} /></button>)}
          </div>
          <div className={styles.chapterDescription}>
            <p>{CHAPTERS[active].description}</p>
            <Link href={CHAPTERS[active].href} className={styles.inlineLink}>{CHAPTERS[active].action} <ArrowUpRight size={17} /></Link>
          </div>
          <div className={styles.chapterProgress} aria-hidden="true">{CHAPTERS.map((chapter, i) => <span key={chapter.label} className={i === active ? styles.progressActive : ""} />)}<span className={styles.chapterProgressLabel}>0{active + 1} / 03</span></div>
        </div>
        <div id="perspective-panel" role="tabpanel" aria-labelledby={`perspective-tab-${active}`} tabIndex={0} className={styles.chapterPanel}>
          <motion.div key={active} className={styles.visualTransition} initial={animated ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.65 }}>
            <ChapterVisual active={active} />
            <div className={styles.visualText}><span>{CHAPTERS[active].meta}</span><h3>{CHAPTERS[active].title}</h3></div>
          </motion.div>
        </div>
      </div>
      <span className={styles.chapterScrollNote}>{sticky ? "KEEP SCROLLING TO EXPLORE" : "CHOOSE YOUR PERSPECTIVE"} <ArrowDown size={12} /></span>
    </div>
  </section>;
}

function LiveFeed() {
  const { data, isPending, isError, refetch, isFetching } = useEvents(FEED_FILTERS);
  if (isPending) return <div className={styles.feedMessage} role="status"><Radio size={20} /> Connecting to NASA’s Earth Observatory…</div>;
  if (isError) return <div className={styles.feedMessage} role="status"><Radio size={20} /><p>The observations feed is temporarily unavailable.</p><button onClick={() => refetch()} disabled={isFetching}>{isFetching ? "Reconnecting…" : "Reconnect to NASA"} <ArrowRight size={15} /></button></div>;
  if (!data?.events.length) return <div className={styles.feedMessage}>No open events in the latest feed. <Link href="/events">Explore the event archive <ArrowUpRight size={15} /></Link></div>;
  return <div className={styles.feedList}>
    {data.events.map(event => <Link key={event.id} href={`/events/${encodeURIComponent(event.id)}`} className={styles.feedRow}>
      <span className={styles.feedEventIcon}><Radio size={18} strokeWidth={1.4} /></span>
      <span className={styles.feedEventName}><span>{event.categories[0]?.title ?? "Natural event"}</span><strong>{event.title}</strong></span>
      <span className={styles.feedEventSource}>NASA EONET <span>OPEN EVENT</span></span>
      <ArrowUpRight size={18} />
    </Link>)}
  </div>;
}

function Observations({ animated }: { animated: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "250px" });
  return <section id="observations" ref={ref} className={styles.observations} aria-labelledby="observations-title">
    <Reveal animated={animated} className={styles.sectionHeading}>
      <div><p className={styles.eyebrow}><span className={styles.statusDot} /> THE PLANET DOESN’T PAUSE</p><h2 id="observations-title">Happening on Earth.</h2></div>
      <Link href="/events" className={styles.inlineLink}>All observations <ArrowUpRight size={17} /></Link>
    </Reveal>
    <div className={styles.feed}>{inView ? <LiveFeed /> : <div className={styles.feedMessage}>Latest observations from NASA EONET</div>}</div>
    <p className={styles.feedFootnote}>Sourced from NASA EONET. Observations update as new data becomes available.</p>
  </section>;
}

function Universe({ animated }: { animated: boolean }) {
  return <section className={styles.universe} aria-labelledby="universe-title">
    <Reveal animated={animated} className={styles.sectionHeading}>
      <div><p className={styles.eyebrow}><span className={styles.tinyCross}>+</span> THERE’S MORE OUT THERE</p><h2 id="universe-title">One world. More ways in.</h2></div>
      <p>Three perspectives.<br />An entire world of possibilities.</p>
    </Reveal>
    <div className={styles.destinationGrid}>
      <Reveal animated={animated} className={styles.destinationWrap}>
        <Link href="/explore" className={`${styles.destination} ${styles.destinationEarth}`}>
          <div className={styles.destinationArt} aria-hidden="true"><div className={styles.miniEarth} /></div>
          <span className={styles.destinationTop}>01 / EXPLORE <ArrowUpRight size={21} /></span>
          <div className={styles.destinationCopy}><span>GET A LITTLE CLOSER</span><h3>EarthSphere</h3><p>Your window into our living planet<br />and the universe around it.</p><span className={styles.destinationAction}>Explore EarthSphere <ArrowRight size={16} /></span></div>
        </Link>
      </Reveal>
      <Reveal animated={animated} delay={0.1} className={styles.destinationWrap}>
        <a href="https://godseyeview.earthsphere.in" target="_blank" rel="noopener noreferrer" className={`${styles.destination} ${styles.destinationGodsEye}`}>
          <div className={styles.destinationArt} aria-hidden="true"><div className={styles.terrainGrid} /><Crosshair className={styles.terrainCrosshair} size={58} strokeWidth={0.7} /><span className={styles.terrainCoordinate}>40° 42′ 51″ N &nbsp; 74° 00′ 21″ W</span></div>
          <span className={styles.destinationTop}>02 / IMMERSE <ArrowUpRight size={21} /></span>
          <div className={styles.destinationCopy}><span>A VIEW FROM ABOVE</span><h3>God’s Eye View</h3><p>Photorealistic 3D cities.<br />A new altitude for your curiosity.</p><span className={styles.destinationAction}>Launch the 3D experience <ArrowRight size={16} /><span className={styles.srOnly}> (opens in a new tab)</span></span></div>
        </a>
      </Reveal>
      <Reveal animated={animated} delay={0.2} className={styles.destinationWrap}>
        <a href="https://worldmonitor.earthsphere.in" target="_blank" rel="noopener noreferrer" className={`${styles.destination} ${styles.destinationMonitor}`}>
          <div className={styles.destinationArt} aria-hidden="true"><div className={styles.radarRings} /><div className={styles.radarSweep} /><span className={styles.radarPoint} /><span className={styles.radarPointTwo} /></div>
          <span className={styles.destinationTop}>03 / UNDERSTAND <ArrowUpRight size={21} /></span>
          <div className={styles.destinationCopy}><span>CONNECT THE DOTS</span><h3>World Monitor</h3><p>Global news and intelligence.<br />The context behind a changing world.</p><span className={styles.destinationAction}>Open World Monitor <ArrowRight size={16} /><span className={styles.srOnly}> (opens in a new tab)</span></span></div>
        </a>
      </Reveal>
    </div>
  </section>;
}

function FinalCall({ animated }: { animated: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  return <section ref={ref} className={styles.finalCall} aria-labelledby="final-title">
    <motion.div className={styles.horizon} style={animated ? { y } : undefined} aria-hidden="true" />
    <div className={styles.stars} aria-hidden="true" />
    <Reveal animated={animated} className={styles.finalContent}>
      <p className={styles.eyebrow}><AudioLines size={16} /> STAY CURIOUS. LOOK CLOSER.</p>
      <h2 id="final-title">A change in perspective<br />changes <em>everything.</em></h2>
      <p>Your next discovery is already out there.</p>
      <Link href="/explore" className={styles.primaryButton}>Find your perspective <ArrowUpRight size={18} /></Link>
    </Reveal>
  </section>;
}

function Footer() {
  return <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div><Brand footer /><p>For the endlessly curious.<br />Made on Earth, for Earth.</p></div>
      <div className={styles.footerLinks}><span>OUR PLANET</span><Link href="/map">Event map</Link><Link href="/events">Natural events</Link><Link href="/epic">Earth imagery</Link><Link href="/analytics">Analytics</Link></div>
      <div className={styles.footerLinks}><span>BEYOND EARTH</span><Link href="/apod">Astronomy</Link><Link href="/mars">Mars rovers</Link><Link href="/satellites">Satellites</Link><Link href="/space-weather">Space weather</Link></div>
      <div className={styles.footerLinks}><span>EARTHSPHERE</span><Link href="/about">Our story</Link><Link href="/dashboard">Dashboard</Link><Link href="/media">NASA media library</Link><a href="https://github.com/djabhi31/EarthSphere" target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={12} /></a></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} EarthSphere</span><span>Independent platform. Imagery and open data courtesy of NASA.</span><Link href="/landing-classic">Classic experience <ArrowUpRight size={12} /></Link><a href="#top" aria-label="Back to top"><ArrowRight size={16} className={styles.backTop} /></a></div>
  </footer>;
}

export default function CinematicLanding() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const animated = !reducedMotion && !paused;
  const { scrollYProgress } = useScroll();
  return <MotionConfig reducedMotion={paused ? "always" : "user"}>
    <div id="top" className={styles.page} data-motion={animated ? "on" : "off"}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <motion.div className={styles.readingProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <Navigation animated={animated} paused={paused} onToggle={() => setPaused(value => !value)} />
      <main id="main-content">
        <Hero animated={animated} />
        <Mission animated={animated} />
        <Perspectives animated={animated} />
        <Observations animated={animated} />
        <Universe animated={animated} />
        <FinalCall animated={animated} />
      </main>
      <Footer />
    </div>
  </MotionConfig>;
}
