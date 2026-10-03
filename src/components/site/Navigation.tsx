"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Bookmark, ChevronDown, Globe2, Grid2X2, Search, Settings2 } from "lucide-react";
import { WatchlistPanel } from "@/components/features/WatchlistPanel";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { DESTINATIONS } from "./catalog";
import { Preferences } from "./Preferences";
import { NavigationDialog } from "./NavigationDialog";
import styles from "./navigation.module.css";

const PRIMARY = [
  { href: "/dashboard", label: "Overview" },
  { href: "/events", label: "Earth events" },
  { href: "/explore", label: "Explore 3D" },
];
const GROUPS = [
  { name: "Earth", description: "Our planet, from every perspective." },
  { name: "Space", description: "A universe of things to discover." },
  { name: "Discover", description: "Images, ideas, and a bigger picture." },
] as const;
type Panel = "tools" | "search" | "settings" | null;

export function Navigation({ explorerControls, explorerActions }: { explorerControls?: ReactNode; explorerActions?: ReactNode } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const results = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [watchlist, setWatchlist] = useState(false);
  const [query, setQuery] = useState("");
  const closePanel = useCallback(() => setPanel(null), []);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const matches = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return DESTINATIONS.filter(item => {
      const text = `${item.label} ${item.description} ${item.source} ${item.group}`.toLowerCase();
      return terms.every(term => text.includes(term));
    });
  }, [query]);

  useEffect(() => {
    const shortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setWatchlist(false);
        setPanel(current => current === "search" ? null : "search");
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  function openPanel(next: Exclude<Panel, null>) {
    setWatchlist(false);
    setPanel(current => current === next ? null : next);
  }

  function browseResults(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(results.current?.querySelectorAll<HTMLAnchorElement>("a") || []);
    if (!links.length) return;
    event.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown" ? current + 1 : current - 1;
    if (next < 0) searchInput.current?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  }

  return (
    <>
      <header className={styles.header} data-explorer={explorerControls ? true : undefined}>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} aria-label="EarthSphere home">
            <span className={styles.brandIcon}><Globe2 size={25} strokeWidth={1.4} /></span>
            <span>Earth<span className={styles.brandWeight}>Sphere</span></span>
          </Link>

          {explorerControls || <nav className={styles.primary} aria-label="Main navigation">
            {PRIMARY.map(item => (
              <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>}

          <button
            type="button"
            className={styles.toolsButton}
            aria-expanded={panel === "tools"}
            aria-controls="navigation-tools"
            aria-haspopup="dialog"
            onClick={() => openPanel("tools")}
          >
            <Grid2X2 size={16} /><span>All tools</span><ChevronDown size={12} />
          </button>

          <div className={styles.actions}>
            {explorerActions || <>
            <button type="button" className={styles.searchButton} onClick={() => openPanel("search")} aria-label="Search pages (Control or Command K)" aria-haspopup="dialog">
              <Search size={17} /><span>Search</span><kbd>Ctrl K</kbd>
            </button>
            <span className={styles.divider} aria-hidden="true" />
            <button type="button" className={`${styles.iconButton} ${styles.savedButton}`} aria-label="Saved events" title="Saved events" onClick={() => { closePanel(); setWatchlist(true); }}>
              <Bookmark size={17} />
            </button>
            <button type="button" className={styles.iconButton} aria-label="Appearance and sound" title="Appearance and sound" aria-haspopup="dialog" onClick={() => openPanel("settings")}>
              <Settings2 size={17} />
            </button>
            </>}
          </div>
        </div>
      </header>

      <NavigationDialog open={panel === "tools"} onClose={closePanel} title="Explore EarthSphere">
        <div className={styles.toolGrid}>
          {GROUPS.map(group => (
            <section key={group.name} className={styles.toolGroup}>
              <h2>{group.name}<span>{DESTINATIONS.filter(item => item.group === group.name).length}</span></h2>
              <p>{group.description}</p>
              <nav aria-label={`${group.name} tools`}>
                {DESTINATIONS.filter(item => item.group === group.name).map(item => (
                  <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined} onClick={closePanel}>
                    <item.icon size={17} strokeWidth={1.5} /><span>{item.label}</span><ArrowUpRight size={13} />
                  </Link>
                ))}
              </nav>
            </section>
          ))}
        </div>
        <div className={styles.toolsFooter}>
          <Link href="/" onClick={closePanel}>Take the EarthSphere journey<ArrowRight size={14} /></Link>
          {explorerControls && <button type="button" onClick={() => setPanel("search")}><Search size={14} />Find a page</button>}
          {explorerControls && <button type="button" onClick={() => setPanel("settings")}><Settings2 size={14} />Appearance & sound</button>}
          <button type="button" onClick={() => { closePanel(); setWatchlist(true); }}><Bookmark size={14} />Saved events</button>
        </div>
      </NavigationDialog>

      <NavigationDialog open={panel === "search"} onClose={closePanel} title="Find a destination" variant="search">
        <div onKeyDown={browseResults}>
          <form className={styles.searchField} onSubmit={event => {
            event.preventDefault();
            if (matches[0]) { closePanel(); router.push(matches[0].href); }
          }}>
            <Search size={21} />
            <input ref={searchInput} autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Earth, Mars, images, satellites…" aria-label="Search all EarthSphere pages" aria-controls="navigation-results" autoComplete="off" />
          </form>
          <p className={styles.resultCount} role="status">{query ? `${matches.length} destinations found` : "Where would you like to go?"}</p>
          <div ref={results} id="navigation-results" className={styles.results}>
            {matches.map(item => (
              <Link key={item.href} href={item.href} onClick={closePanel}>
                <span className={styles.resultIcon}><item.icon size={19} strokeWidth={1.4} /></span>
                <span><strong>{item.label}</strong><small>{item.group} · {item.source}</small></span>
                <ArrowRight size={15} />
              </Link>
            ))}
            {!matches.length && <div className={styles.noResults}><Search size={27} /><strong>No matching destinations</strong><p>Try a planet, a topic, or a tool name.</p></div>}
          </div>
        </div>
        <div className={styles.searchHint}><span>↑ ↓ Browse</span><span>Enter Open</span><span>Esc Close</span></div>
      </NavigationDialog>

      <NavigationDialog open={panel === "settings"} onClose={closePanel} title="Make yourself at home" variant="settings">
        <div className={styles.settingsBody}>
          <div><h2>Appearance</h2><p>Choose your color and light preference.</p><Preferences /></div>
          <div><h2>Interface sounds</h2><p>A little feedback, when you want it.</p><SoundToggle /></div>
          <p className={styles.settingsNote}>NASA Eyes has its own display and playback controls.</p>
        </div>
      </NavigationDialog>

      <WatchlistPanel isOpen={watchlist} onClose={() => setWatchlist(false)} />
    </>
  );
}
