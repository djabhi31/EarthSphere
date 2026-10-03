"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Compass, Globe2, Heart, Orbit, Plus, Telescope } from "lucide-react";
import { NasaImage } from "../NasaImage";
import styles from "./about-story.module.css";

const CHAPTERS = [{ id: "perspective", label: "Our perspective" }, { id: "principles", label: "What matters" }, { id: "creator", label: "The creator" }, { id: "sources", label: "Open discovery" }];
const PRINCIPLES = [
  { icon: Globe2, title: "Open by nature.", text: "Discovery belongs to everyone. Public scientific data is the foundation of EarthSphere, with links that lead back to the people and missions behind it." },
  { icon: Telescope, title: "Curiosity comes first.", text: "An image can start a question. A map can reveal a connection. We make room for both the wonder of a first look and the detail of a closer one." },
  { icon: Heart, title: "A human perspective.", text: "Behind every observation is a world we share. The aim is to make the science more approachable, and our place in the picture a little clearer." },
];
const SOURCES = [
  { name: "NASA EONET", type: "A LIVING PLANET", description: "Natural events, their locations, and their observation histories.", href: "https://eonet.gsfc.nasa.gov/" },
  { name: "NASA Open APIs", type: "A UNIVERSE OF DATA", description: "Astronomy imagery, near-Earth objects, space weather, and more.", href: "https://api.nasa.gov/" },
  { name: "NASA Eyes on Earth", type: "A DIFFERENT PERSPECTIVE", description: "NASA’s immersive view of Earth science and the missions observing it.", href: "https://eyes.nasa.gov/apps/earth/#/" },
  { name: "The EarthSphere project", type: "LOOK UNDER THE SURFACE", description: "Explore the code and ideas behind this independent project.", href: "https://github.com/djabhi31/EarthSphere" },
];

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null), hero = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState("perspective");
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const { scrollYProgress: pageProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const y = useTransform(progress, [0, 1], [0, 130]);
  const scale = useTransform(progress, [0, 1], [1, 1.13]);
  const rotate = useTransform(progress, [0, 1], [-10, 5]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: "-20% 0px -65% 0px" });
    root.current?.querySelectorAll("[data-story-chapter]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  function goTo(id: string) {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    target?.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
  }
  return <div className={styles.page} ref={root}>
    <section ref={hero} className={styles.hero}>
      <div className={styles.stars} aria-hidden="true" />
      <motion.div className={styles.heroEarth} style={reduced ? undefined : { y, scale, rotate }} aria-hidden="true"><NasaImage src="/images/landing/earth-portrait.webp" alt="" eager /></motion.div>
      <div className={styles.heroShade} />
      <div className={styles.heroTop}><span><i /> OUR STORY</span><span>EARTHSPHERE / A SHARED CURIOSITY</span></div>
      <div className={styles.heroCopy}><p className={styles.eyebrow}>A SMALL PLANET. A BIG REASON TO EXPLORE.</p><h1>One planet.<br /><em>Infinite curiosity.</em></h1><p>For the moments that make you look up.<br />And the questions that bring you closer.</p><Link href="/explore" className={styles.heroLink}>See the world differently<span><ArrowUpRight size={23} strokeWidth={1.4} /></span></Link></div>
      <div className={styles.heroBottom}><a href="#perspective" onClick={event => { event.preventDefault(); goTo("perspective"); }}><span><ArrowDown size={17} /></span>THE STORY BEHIND THE VIEW</a><div><span>OUR ONLY HOME</span><strong>Earth, from a new perspective.</strong></div></div>
    </section>
    <nav className={styles.chapters} aria-label="About page chapters"><div><Link href="/about" className={styles.chapterBrand}><Orbit size={17} />The EarthSphere story</Link><div>{CHAPTERS.map((chapter, i) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined} onClick={event => { event.preventDefault(); goTo(chapter.id); }}><span>0{i + 1}</span>{chapter.label}</a>)}</div></div><motion.i style={{ scaleX: pageProgress }} /></nav>

    <section id="perspective" data-story-chapter tabIndex={-1} className={`${styles.section} ${styles.perspective}`}>
      <div className={styles.sectionLabel}><span>01 / OUR PERSPECTIVE</span><Plus size={15} /></div>
      <div className={styles.statement}><h2>Understanding starts<br /><em>with looking closer.</em></h2><div><p>We live on an extraordinary planet. Most of its stories unfold just beyond our everyday view.</p><p>NASA’s observations bring those stories into focus. EarthSphere gives them a place to be explored — from the path of a storm to the light of a distant world.</p><p>This is an independent project built on a simple belief: scientific discovery should feel open, inviting, and within reach.</p><Link href="/dashboard">Find your own starting point<ArrowRight size={16} /></Link></div></div>
      <figure className={styles.horizon}><NasaImage src="/images/editorial/earth-horizon.webp" alt="A sunset over the Indian Ocean reveals the thin layers of Earth's atmosphere" /><div><span>A CHANGE IN PERSPECTIVE</span><p>One world.<br />Worth understanding.</p></div><figcaption><span>Earth’s atmosphere, from the International Space Station.</span><a href="https://images.nasa.gov/details/iss023e057948" target="_blank" rel="noopener noreferrer">NASA / EXPEDITION 23<ArrowUpRight size={11} /></a></figcaption></figure>
    </section>

    <section id="principles" data-story-chapter tabIndex={-1} className={`${styles.section} ${styles.principles}`}><div className={styles.sectionLabel}><span>02 / WHAT MATTERS</span><Plus size={15} /></div><div className={styles.sectionHeading}><h2>Built around<br /><em>a sense of wonder.</em></h2><p>The experience changes.<br />These principles stay at the center.</p></div><div className={styles.principleGrid}>{PRINCIPLES.map((item, i) => <article key={item.title}><div><item.icon size={26} strokeWidth={1.2} /><span>0{i + 1}</span></div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>

    <section className={`${styles.section} ${styles.discovery}`} aria-label="Ways to explore"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FOLLOW A QUESTION. FIND A WORLD.</p><h2>Choose your<br /><em>next perspective.</em></h2></div><p>No two journeys need to begin<br />in the same place.</p></div><div className={styles.discoveryGrid}><Link href="/map"><NasaImage src="/images/editorial/orbital-science.webp" alt="A satellite above the curved Earth" /><div><span><Globe2 size={15} />OUR CHANGING PLANET</span><h3>Closer to home.</h3><p>Follow the natural events shaping Earth.</p><b>Explore Earth<ArrowUpRight size={21} /></b></div></Link><Link href="/media"><NasaImage src="/images/editorial/cosmic-cliffs.webp" alt="Stars and clouds in Webb's image of the Carina Nebula" /><div><span><Telescope size={15} />BEYOND THE FAMILIAR</span><h3>Further into wonder.</h3><p>Discover the images and stories of space.</p><b>Explore the archive<ArrowUpRight size={21} /></b></div></Link></div></section>

    <section id="creator" data-story-chapter tabIndex={-1} className={styles.creator}><div className={styles.creatorInner}>
      <figure className={styles.creatorPortrait}>
        <div className={styles.creatorOrbit} aria-hidden="true" />
        <Image className={styles.creatorPhoto} src="/images/creator/abhilash-ghosh.webp" alt="Abhilash Ghosh, creator of EarthSphere" width={200} height={200} unoptimized />
        <figcaption>CURIOUS BY NATURE<br />CREATIVE BY INSTINCT</figcaption>
        <i aria-hidden="true" />
      </figure>
      <div className={styles.creatorCopy}><p className={styles.eyebrow}>03 / THE PERSON BEHIND THE PROJECT</p><h2>Hi, I’m<br /><em>Abhilash Ghosh.</em></h2><span className={styles.creatorRole}>Creator of EarthSphere</span><p>I’m a commerce student, working professional, music producer, and technology enthusiast. I enjoy bringing creativity and practicality together to build things people can use and explore.</p><p>EarthSphere began with a thought: NASA’s natural-event data deserves an experience that invites people to look closer. That same curiosity also drives my music as DJ ABHI-Maheshtala.</p><div className={styles.socials}>{[{ name: "GitHub", href: "https://github.com/djabhi31" }, { name: "LinkedIn", href: "https://linkedin.com/in/abhilash-ghosh-8b5a711b1/" }, { name: "Music", href: "https://www.youtube.com/@djabhimaheshtala" }, { name: "Instagram", href: "https://www.instagram.com/djabhi.31" }].map(link => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">{link.name}<ArrowUpRight size={13} /></a>)}</div></div></div></section>

    <section id="sources" data-story-chapter tabIndex={-1} className={`${styles.section} ${styles.sources}`}><div className={styles.sectionLabel}><span>04 / OPEN DISCOVERY</span><Plus size={15} /></div><div className={styles.sourcesGrid}><div><h2>A shared pursuit.<br /><em>An open foundation.</em></h2><p>Made possible by the scientists, missions, and open datasets that help us understand our world.</p><span><BookOpen size={16} />Independent project. Public scientific sources.</span></div><nav aria-label="Scientific sources and project code">{SOURCES.map(source => <a key={source.name} href={source.href} target="_blank" rel="noopener noreferrer"><div><small>{source.type}</small><h3>{source.name}</h3><p>{source.description}</p></div><ArrowUpRight size={21} strokeWidth={1.3} /></a>)}</nav></div><div className={styles.questions}><details><summary>Is EarthSphere an official NASA website?<Plus size={17} /></summary><p>EarthSphere is an independent project. It uses public NASA and partner data, and links to original sources. It is not an official NASA product or an endorsement by NASA.</p></details><details><summary>How current are the observations?<Plus size={17} /></summary><p>Each source publishes on its own schedule. The observation dates and available archive controls show what you are viewing. Satellite composites and event records are not continuous live camera feeds.</p></details><details><summary>Where should I begin?<Plus size={17} /></summary><p>Start with the <Link href="/map">Earth event map</Link> to explore our planet, the <Link href="/explore">3D Earth explorer</Link> for a view from orbit, or the <Link href="/apod">astronomy picture of the day</Link> for a moment of discovery.</p></details></div></section>
    <section className={styles.closing}><Compass size={31} strokeWidth={1} /><p className={styles.eyebrow}>THERE’S A WHOLE WORLD OUT THERE.</p><h2>Stay curious.<br /><em>Keep exploring.</em></h2><Link href="/dashboard">Your next discovery<ArrowUpRight size={19} /></Link></section>
  </div>;
}
