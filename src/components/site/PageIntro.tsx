"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { DESTINATIONS, type Destination } from "./catalog";
import { contentArt } from "./content-art";
import { NasaImage } from "./NasaImage";
import styles from "./content-intro.module.css";

export function PageIntro({ page }: { page: Destination }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1.13]);
  const art = contentArt(page.href);
  const number = String(DESTINATIONS.findIndex(item => item.href === page.href) + 1).padStart(2, "0");
  return <><section className={styles.intro} ref={ref} data-art={art.kind} aria-labelledby="content-page-title">
    <motion.div className={styles.visual} style={reduced ? undefined : { y, scale }}><NasaImage src={art.src} alt={art.alt} eager /></motion.div>
    <div className={styles.shade} />
    <div className={styles.topline}><nav aria-label="Breadcrumb"><Link href="/">EarthSphere</Link><ChevronRight size={11} /><Link href="/dashboard">{page.group}</Link><ChevronRight size={11} /><span>{page.label}</span></nav><span className={styles.edition}>FIELD NOTES <i /> {number}</span></div>
    <div className={styles.copy}><p className={styles.kicker}><page.icon size={14} strokeWidth={1.4} />{page.label}</p><h1 id="content-page-title">{page.title}<br /><em>{page.emphasis}</em></h1><p className={styles.description}>{page.description}</p></div>
    <div className={styles.bottomline}><a href="#page-tools" className={styles.down}><span><ArrowDown size={17} /></span>Explore this page</a><a className={styles.credit} href={art.credit} target="_blank" rel="noopener noreferrer">{art.caption}<ArrowUpRight size={11} /><span className="sr-only">Image credit, opens in a new tab</span></a></div>
    <motion.div className={styles.progress} style={{ scaleX: reduced ? 1 : scrollYProgress }} />
  </section><div className={styles.sourcebar}><span>THE SOURCE BEHIND THE VIEW</span><a href={page.sourceUrl} target="_blank" rel="noopener noreferrer">{page.source}<ArrowUpRight size={12} /><span className="sr-only">Opens in a new tab</span></a></div></>;
}
