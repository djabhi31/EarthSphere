'use client';

import { useState } from 'react';
import { useTLESearch } from '@/hooks/useNasaApi';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Satellite, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { TLESatellite } from '@/lib/types/nasa';

const QUICK_SEARCHES = ['ISS', 'Hubble', 'NOAA', 'GPS', 'Starlink'];

function parseTLE(line2: string) {
  try {
    if (!line2 || line2.length < 63) return null;

    const incStr = line2.substring(8, 16).trim();
    const eccStr = line2.substring(26, 33).trim();
    const mmStr = line2.substring(52, 63).trim();

    const inclination = parseFloat(incStr);
    const eccentricity = parseFloat('0.' + eccStr);
    const meanMotion = parseFloat(mmStr);

    const period = meanMotion > 0 ? (1440 / meanMotion) : 0;

    return {
      inclination: isNaN(inclination) ? 'N/A' : `${inclination.toFixed(2)}°`,
      eccentricity: isNaN(eccentricity) ? 'N/A' : eccentricity.toFixed(6),
      period: isNaN(period) ? 'N/A' : `${period.toFixed(2)} min`,
      meanMotion: isNaN(meanMotion) ? 'N/A' : `${meanMotion.toFixed(2)} revs/day`
    };
  } catch {
    return null;
  }
}

function SatelliteCard({ satellite }: { satellite: TLESatellite }) {
  const [expanded, setExpanded] = useState(false);

  const stats = parseTLE(satellite.line2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="es-orbit-card glass rounded-2xl p-5 border border-[var(--border-default)] overflow-hidden transition-colors hover:border-[var(--ice-blue)]"
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} aria-expanded={expanded} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setExpanded(value => !value); } }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--ice-blue)]/10 flex items-center justify-center text-[var(--ice-blue)]">
            <Satellite size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{satellite.name}</h3>
            <div className="text-sm text-[var(--text-secondary)] flex gap-3">
              <span>NORAD: {satellite.satelliteId}</span>
              <span>•</span>
              <span>Updated: {new Date(satellite.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="text-[var(--text-tertiary)] hover:text-[var(--ice-blue)] transition-colors">
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-4 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-subtle p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Inclination</div>
                  <div className="font-mono font-medium text-[var(--ice-blue)]">{stats?.inclination || 'N/A'}</div>
                </div>
                <div className="glass-subtle p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Eccentricity</div>
                  <div className="font-mono font-medium text-[var(--ice-blue)]">{stats?.eccentricity || 'N/A'}</div>
                </div>
                <div className="glass-subtle p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Orbital Period</div>
                  <div className="font-mono font-medium text-[var(--ice-blue)]">{stats?.period || 'N/A'}</div>
                </div>
                <div className="glass-subtle p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Mean Motion</div>
                  <div className="font-mono font-medium text-[var(--ice-blue)]">{stats?.meanMotion || 'N/A'}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Raw TLE Data</div>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-sm overflow-x-auto whitespace-pre text-white/80">
                  {satellite.line1}
                  {'\n'}
                  {satellite.line2}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SatellitesPageClient() {
  const [searchInput, setSearchInput] = useState('ISS');
  const [query, setQuery] = useState('ISS');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useTLESearch(query, page);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim().length >= 2) {
      setPage(1);
      setQuery(searchInput.trim());
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchInput(term);
    setPage(1);
    setQuery(term);
  };

  return (
    <div className="es-satellite-catalog ep-container pb-20">
      <div className="es-orbit-search ep-section pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-[var(--text-tertiary)]" size={24} />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search satellite catalog" placeholder="Search satellites (e.g. ISS, Hubble, NOAA...)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--ice-blue)]/50 focus:border-transparent transition-all placeholder:text-[var(--text-tertiary)]"
            />
            <button
              type="submit"
              disabled={searchInput.length < 2 || isLoading}
              className="absolute inset-y-2 right-2 px-6 bg-[var(--ice-blue)] text-black font-semibold rounded-xl hover:bg-[var(--ice-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            <span className="text-sm text-[var(--text-secondary)]">Quick targets:</span>
            {QUICK_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="px-4 py-1.5 rounded-full text-sm font-medium glass-subtle border border-white/10 hover:border-[var(--ice-blue)]/50 hover:bg-white/10 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 h-24 animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 shrink-0"></div>
                <div className="space-y-2 w-full">
                  <div className="h-5 bg-white/10 rounded w-1/4"></div>
                  <div className="h-4 bg-white/5 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Search Failed</h3>
            <p className="text-[var(--text-secondary)]">Unable to fetch satellite data. Please try a different search term.</p>
            <button className="es-button es-button-secondary mt-4" onClick={() => { void refetch(); }}>Try again</button>
          </div>
        )}

        {!isLoading && !isError && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] border-b border-white/10 pb-4 mb-4">
              <span>Found {data.totalItems} result{data.totalItems !== 1 ? 's' : ''} for “{query}”</span>
              <span className="text-xs">Page {page} · {data.member.length} shown</span>
            </div>

            {data.member.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl border border-white/5">
                <Satellite size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--text-secondary)]">No satellites found</h3>
              </div>
            ) : (
              <div className="space-y-4">

                {data.member.map((satellite) => (
                  <SatelliteCard key={satellite.satelliteId} satellite={satellite} />
                ))}
              </div>
            )}
            {data.totalItems > 20 && <nav className="es-pagination" aria-label="Satellite search pages"><button className="es-button es-button-secondary" disabled={page === 1 || isFetching} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {Math.ceil(data.totalItems / 20)}</span><button className="es-button es-button-secondary" disabled={page * 20 >= data.totalItems || isFetching} onClick={() => setPage(value => value + 1)}>Next</button></nav>}
          </motion.div>
        )}

        {!isLoading && !isError && !data && !query && (
          <div className="text-center py-20 opacity-50">
             <Satellite size={64} className="mx-auto mb-6 text-[var(--text-tertiary)]" strokeWidth={1} />
             <p className="text-lg">Enter a satellite name to begin tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
