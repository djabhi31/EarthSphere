"use client";

import { useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, MotionConfig, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Crosshair, Flame, Globe2, Layers3, Orbit, Pause, Play, Radio, Satellite, ScanLine, Sparkles, Wind, X } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { formatCoordinates, getCategoryColor } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
import { CHAPTERS, eventCoordinates } from "./flight";
import styles from "./journey.module.css";

const JourneyCanvas = dynamic(() => import("./JourneyCanvas"), { ssr: false, loading: () => <div className={styles.earthPoster} /> });
const FILTERS = { status: "open" as const, limit: 80 };
const EMPTY_EVENTS: readonly EONETEvent[] = [];
const CATEGORIES = [
  { id: "all", name: "All events", icon: Globe2 },
  { id: "wildfires", name: "Wildfires", icon: Flame },
  { id: "severeStorms", name: "Storms", icon: Wind },
  { id: "volcanoes", name: "Volcanoes", icon: Layers3 },
];

function Launch({ href = "/explore", children = "Launch explorer", secondary = false }: { href?: string; children?: ReactNode; secondary?: boolean }) {
  return <Link href={href} className={secondary ? styles.secondaryButton : styles.primaryButton}>{children}<ArrowUpRight size={17} /></Link>;
}

function SceneCopy({ index, active, progress, reduced, children, className = "" }: {
  index: number; active: number; progress: MotionValue<number>; reduced: boolean; children: ReactNode; className?: string;
}) {
  const center = index / 5;
  const opacity = useTransform(progress, [center - .10, center - .065, center + .065, center + .10], [0, 1, 1, 0]);
  const y = useTransform(progress, [center - .10, center, center + .10], [105, 0, -105]);
  const rotateX = useTransform(progress, [center - .10, center, center + .10], [12, 0, -12]);
  const scale = useTransform(progress, [center - .10, center, center + .10], [.94, 1, 1.04]);
  return <motion.section id={CHAPTERS[index].id} data-chapter-index={index} aria-labelledby={`chapter-title-${index}`} aria-hidden={!reduced && active !== index} inert={!reduced && active !== index}
    className={`${styles.scene} ${className}`} style={reduced ? undefined : { opacity, y, rotateX, scale }}>
    {children}
  </motion.section>;
}

function EventPanel({ events, pending, error, category, setCategory, selected, setSelected, retry }: {
  events: readonly EONETEvent[]; pending: boolean; error: boolean; category: string; setCategory: (value: string) => void;
  selected: EONETEvent | null; setSelected: (value: EONETEvent | null) => void; retry: () => void;
}) {
  const filtered = events.filter(event => eventCoordinates(event) && (category === "all" || event.categories.some(cat => cat.id === category)));
  const visible = filtered.slice(0, 3);
  return <div className={styles.eventPanel}>
    <div className={styles.filters} aria-label="Filter globe observations">
      {CATEGORIES.map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setSelected(null); }}><item.icon size={13} />{item.name}</button>)}
    </div>
    <div className={styles.eventRows}>
      {pending && <p className={styles.dataState} role="status">Connecting to NASA EONET…</p>}
      {error && <div className={styles.dataState} role="status">NASA’s feed is temporarily unavailable.<button onClick={retry}>Reconnect <ArrowRight size={14} /></button></div>}
      {!pending && !error && !visible.length && <p className={styles.dataState}>No matching events in this observation sample. <Link href="/events">Browse the full feed <ArrowUpRight size={13} /></Link></p>}
      {visible.map(event => <button key={event.id} className={`${styles.eventRow} ${selected?.id === event.id ? styles.eventSelected : ""}`} onClick={() => setSelected(selected?.id === event.id ? null : event)} aria-pressed={selected?.id === event.id}>
        <span className={styles.eventDot} style={{ background: getCategoryColor(event.categories[0]?.id ?? "") }} />
        <span><small>{event.categories[0]?.title}</small><strong>{event.title}</strong></span><Crosshair size={15} />
      </button>)}
    </div>
    {selected ? <div className={styles.selectedEvent}>
      <span><Check size={12} /> FOCUSED · {formatCoordinates(eventCoordinates(selected))}</span>
      <Link href={`/events/${encodeURIComponent(selected.id)}`}>Event details <ArrowUpRight size={13} /></Link>
      <button onClick={() => setSelected(null)} aria-label="Clear event focus"><X size={13} /></button>
    </div> : <p className={styles.panelHint}><Crosshair size={11} /> SELECT AN OBSERVATION TO FLY TO ITS LOCATION</p>}
  </div>;
}

const DESTINATIONS = [
  { number: "01", icon: Globe2, name: "EarthSphere", subtitle: "YOUR PLANET. IN PERSPECTIVE.", description: "Earth events, orbital paths, and the entire NASA universe of data.", href: "/explore", action: "Explore the planet", external: false, className: "earthCard" },
  { number: "02", icon: ScanLine, name: "God’s Eye View", subtitle: "GET ABOVE IT ALL.", description: "Photorealistic cities, aircraft, and maritime tracking in a 3D world.", href: "https://godseyeview.earthsphere.in", action: "Enter the 3D experience", external: true, className: "tacticalCard" },
  { number: "03", icon: Radio, name: "World Monitor", subtitle: "UNDERSTAND THE CONNECTIONS.", description: "Global news, geopolitical context, and intelligence from across the world.", href: "https://worldmonitor.earthsphere.in", action: "Open World Monitor", external: true, className: "networkCard" },
];

function DestinationCard({ destination, index, progress, reduced }: { destination: typeof DESTINATIONS[number]; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const pointerX = useSpring(0, { stiffness: 170, damping: 22 });
  const pointerY = useSpring(0, { stiffness: 170, damping: 22 });
  const entry = useTransform(progress, [.05 + index * .07, .5 + index * .05], [32 - index * 30, 0]);
  const y = useTransform(progress, [.05, .55], [100 + index * 55, 0]);
  const rotateY = useTransform(() => entry.get() + pointerX.get());
  return <motion.div className={styles.destinationWrap} style={reduced ? undefined : { y, rotateY, rotateX: pointerY }}
    onPointerMove={event => {
      if (reduced || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left - rect.width / 2) / rect.width * 13);
      pointerY.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 10);
    }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
    <a href={destination.href} target={destination.external ? "_blank" : undefined} rel={destination.external ? "noopener noreferrer" : undefined} className={`${styles.destination} ${styles[destination.className]}`}>
      <div className={styles.cardArt} aria-hidden="true"><div className={styles.cardOrbit} /><destination.icon size={68} strokeWidth={.65} /></div>
      <div className={styles.cardTop}><span>{destination.number} / EXPLORE</span><ArrowUpRight size={21} /></div>
      <div className={styles.cardCopy}><span>{destination.subtitle}</span><h3>{destination.name}</h3><p>{destination.description}</p><div>{destination.action}<ArrowRight size={17} /></div>{destination.external && <span className={styles.srOnly}>Opens in a new tab</span>}</div>
    </a>
  </motion.div>;
}

function MissionDirectory({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  return <section ref={ref} id="missions" className={styles.missions}>
    <div className={styles.directoryHeading}><p className={styles.eyebrow}>THE JOURNEY IS JUST THE BEGINNING</p><h2>Where will your<br /><em>curiosity take you?</em></h2><p>One connected suite. Three extraordinary points of view.</p></div>
    <div className={styles.destinations}>{DESTINATIONS.map((destination, index) => <DestinationCard key={destination.name} destination={destination} index={index} progress={scrollYProgress} reduced={reduced} />)}</div>
  </section>;
}

export default function JourneyLanding() {
  const story = useRef<HTMLDivElement>(null);
  const reducedPreference = useReducedMotion();
  const reduced = !!reducedPreference;
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState("all");
  const [focusedEvent, setFocusedEvent] = useState<EONETEvent | null>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 30, restDelta: .0001 });
  const visible = useInView(story, { margin: "100px" });
  const { data, isPending, isError, refetch } = useEvents(FILTERS);
  const events = useMemo(() => data?.events.filter(event => eventCoordinates(event)) ?? EMPTY_EVENTS, [data]);
  const represented = useMemo(() => new Set(events.flatMap(event => event.categories.map(c => c.id))).size, [events]);
  useMotionValueEvent(progress, "change", value => setActive(Math.min(5, Math.max(0, Math.round(value * 5)))));
  const goTo = useCallback((index: number) => {
    if (!story.current) return;
    if (reduced) document.getElementById(CHAPTERS[index].id)?.scrollIntoView({ behavior: "instant", block: "start" });
    else {
      const start = story.current.getBoundingClientRect().top + window.scrollY;
      const travel = story.current.offsetHeight - window.innerHeight;
      window.scrollTo({ top: start + travel * index / 5, behavior: paused ? "instant" : "smooth" });
    }
  }, [paused, reduced]);
  const selectEvent = useCallback((event: EONETEvent) => setFocusedEvent(event), []);
  const tint = active === 3 ? "#efad87" : active === 1 && category !== "all" ? getCategoryColor(category) : "#b1cefa";

  return <MotionConfig reducedMotion={reduced ? "always" : "user"}>
    <div className={styles.page} data-reduced={reduced} data-paused={paused} style={{ "--accent": tint } as CSSProperties}>
      <a className={styles.skipLink} href="#missions">Skip the 3D journey and browse all tools</a>
      <button className={styles.motionControl} onClick={() => setPaused(p => !p)} aria-pressed={paused || reduced} aria-label={reduced ? "Reduced motion enabled" : paused ? "Resume ambient motion" : "Pause ambient motion"} disabled={reduced}>{paused || reduced ? <Play size={13} /> : <Pause size={13} />}</button>

      <main>
        <div ref={story} className={styles.story}>
          <div className={styles.stage}>
            <JourneyCanvas progress={progress} events={events} category={active === 1 ? category : "all"} focusedEvent={focusedEvent} onSelect={selectEvent} animated={!paused && !reduced} visible={visible} reduced={reduced} />
            <div className={`${styles.sceneShade} ${active === 1 ? styles.shadeRight : active === 5 ? styles.shadeCenter : ""}`} aria-hidden="true" />
            <div className={styles.vignette} aria-hidden="true" />
            <div className={styles.sceneLayers}>
              <SceneCopy index={0} active={active} progress={progress} reduced={reduced} className={styles.arrival}>
                <div className={styles.heroContent}><p className={styles.eyebrow}><span /> AN OPEN INVITATION TO EXPLORE</p><h1 id="chapter-title-0">Your world.<br /><em>A new dimension.</em></h1><p className={styles.intro}>A living planet. A universe of possibilities.<br />Scroll into an extraordinary point of view.</p><div className={styles.actions}><Launch>Explore Earth</Launch><a href="#living-earth" onClick={e => { e.preventDefault(); goTo(1); }} className={styles.journeyLink}><span><ArrowDown size={16} /></span> Begin the journey</a></div></div>
                <div className={styles.heroFoot}><div><span>01—06</span><p>A SCROLL-DRIVEN EXPEDITION</p></div><p>EARTH · SOL III<br /><span>4.54 BILLION YEARS IN THE MAKING</span></p></div>
                <div className={styles.orbitalLabel} aria-hidden="true"><span /><small>OUR ONLY HOME</small><strong>12,742 <span>KM</span></strong><small>MEAN PLANETARY DIAMETER</small></div>
              </SceneCopy>

              <SceneCopy index={1} active={active} progress={progress} reduced={reduced} className={styles.living}>
                <div className={styles.rightContent}><p className={styles.eyebrow}><span /> THE PLANET DOESN’T PAUSE</p><h2 id="chapter-title-1">Alive.<br /><em>In every sense.</em></h2><p className={styles.intro}>Wildfires, shifting ice, gathering storms.<br />See Earth’s stories unfold through NASA’s eyes.</p><EventPanel events={events} pending={isPending} error={isError} category={category} setCategory={setCategory} selected={focusedEvent} setSelected={setFocusedEvent} retry={() => { void refetch(); }} /><Link href="/events" className={styles.inlineLink}>All Earth observations <ArrowUpRight size={16} /></Link></div>
                <div className={styles.sceneCoordinate}><Radio size={14} /><span>NASA EONET / OPEN OBSERVATIONS</span></div>
              </SceneCopy>

              <SceneCopy index={2} active={active} progress={progress} reduced={reduced} className={styles.orbitScene}>
                <div className={styles.leftContent}><p className={styles.eyebrow}><span /> A LITTLE HIGHER. A LOT FURTHER.</p><h2 id="chapter-title-2">A front-row seat<br /><em>to the world.</em></h2><p className={styles.intro}>Follow the paths above our planet.<br />Discover the satellites that help us understand home.</p><div className={styles.orbitFeatures}><span><Satellite size={18} /> Satellite tracking</span><span><Orbit size={18} /> Orbital trajectories</span><span><Globe2 size={18} /> Earth observation</span></div><Launch href="/satellites">Explore satellite orbits</Launch></div>
                <div className={styles.satelliteLabel}><div><span className={styles.labelLine} /><Satellite size={17} /></div><p>THE VIEW FROM ORBIT<span>SPACECRAFT & PATHS VISUALIZED IN 3D</span></p></div>
              </SceneCopy>

              <SceneCopy index={3} active={active} progress={progress} reduced={reduced} className={styles.marsScene}>
                <div className={styles.leftContent}><p className={styles.eyebrow}><span /> CURIOSITY DOESN’T STOP AT EARTH</p><h2 id="chapter-title-3">New worlds.<br /><em>Same wonder.</em></h2><p className={styles.intro}>Step onto Mars through a rover’s lens.<br />Meet distant worlds. Follow the light of another star.</p><div className={styles.actions}><Launch href="/mars">Discover Mars</Launch><Launch href="/exoplanets" secondary>Worlds beyond</Launch></div><div className={styles.marsFacts}><div><strong>687</strong><span>EARTH DAYS IN A MARTIAN YEAR</span></div><div><strong>4th</strong><span>PLANET FROM THE SUN</span></div></div></div>
                <div className={styles.planetName} aria-hidden="true"><span>SOL IV</span><strong>MARS</strong><span>3D SURFACE STUDY</span></div>
              </SceneCopy>

              <SceneCopy index={4} active={active} progress={progress} reduced={reduced} className={styles.networkScene}>
                <div className={styles.leftContent}><p className={styles.eyebrow}><span /> EVERY SIGNAL TELLS A STORY</p><h2 id="chapter-title-4">See the signals.<br /><em>Connect the world.</em></h2><p className={styles.intro}>Turn a world of observations into understanding.<br />Explore patterns, context, and a bigger picture.</p><div className={styles.signalStats}><div><strong>{isPending || isError ? "—" : events.length}</strong><span>OBSERVATIONS IN THIS VIEW</span></div><div><strong>{isPending || isError ? "—" : represented}</strong><span>EVENT CATEGORIES</span></div></div><div className={styles.actions}><Launch href="/analytics">Explore the patterns</Launch><Launch href="/intel" secondary>Global intelligence</Launch></div></div>
                <div className={styles.networkNote}><span /><span>REAL EONET LOCATIONS<br /><small>Connections illustrate the observation network</small></span></div>
              </SceneCopy>

              <SceneCopy index={5} active={active} progress={progress} reduced={reduced} className={styles.finalScene}>
                <div className={styles.finalContent}><p className={styles.eyebrow}><Sparkles size={14} /> YOU’VE ONLY JUST BEGUN</p><h2 id="chapter-title-5">A little perspective.<br /><em>Endless possibility.</em></h2><p>Your next discovery is already out there.</p><div className={styles.actions}><Launch>Make the world yours</Launch><a href="#missions" className={styles.journeyLink}><span><ArrowDown size={16} /></span> Choose your mission</a></div><div className={styles.providers}><a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA <span>OPEN DATA</span></a><span>EONET</span><span>JPL</span><small>INDEPENDENT PLATFORM · OPEN SCIENCE</small></div></div>
              </SceneCopy>
            </div>

            <nav className={styles.chapterRail} aria-label="Journey chapters">{CHAPTERS.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={e => { e.preventDefault(); goTo(index); }} aria-label={`Chapter ${index + 1}: ${chapter.label}`} aria-current={active === index ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{chapter.label}</strong></a>)}</nav>
            <div className={styles.journeyHud}><div><span className={styles.hudCross}>+</span><span>{CHAPTERS[active].tag}</span></div><span className={styles.scrollPrompt}>{active === 5 ? "SCROLL TO EXPLORE THE PLATFORM" : "SCROLL TO TRAVEL"}<ArrowDown size={12} /></span><div className={styles.hudProgress}><motion.span style={{ scaleX: progress }} /></div></div>
          </div>
        </div>
        <MissionDirectory reduced={reduced || paused} />
      </main>
    </div>
  </MotionConfig>;
}
