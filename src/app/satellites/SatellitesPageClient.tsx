'use client';

import { useState } from 'react';
import { useTLESearch } from '@/hooks/useNasaApi';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Satellite, Activity, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  } catch (e) {
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
      className="glass rounded-2xl p-5 border border-[var(--border-default)] overflow-hidden transition-colors hover:border-[var(--ice-blue)]"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
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
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  const { data, isLoading, isError } = useTLESearch(query);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim().length >= 2) {
      setQuery(searchInput.trim());
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchInput(term);
    setQuery(term);
  };

  return (
    <div className="ep-container pb-20">
      <div className="ep-section pt-24 md:pt-32 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-[var(--ice-blue)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--ice-blue)]/20 shadow-[0_0_30px_rgba(var(--ice-blue-rgb),0.2)]">
            <Activity className="text-[var(--ice-blue)]" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Satellite <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ice-blue)] to-[var(--electric-cyan)]">Tracker</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Track Earth-orbiting satellites in real-time. Search by name to retrieve the latest Two-Line Element (TLE) data and orbital parameters.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-[var(--text-tertiary)]" size={24} />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search satellites (e.g. ISS, Hubble, NOAA...)"
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
          </div>
        )}

        {!isLoading && !isError && data && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] border-b border-white/10 pb-4 mb-4">
              <span>Found {data.totalItems} result{data.totalItems !== 1 ? 's' : ''} for "{query}"</span>
              {data.totalItems > 50 && (
                <span className="text-yellow-400/80">Showing first 50 items</span>
              )}
            </div>

            {data.member.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl border border-white/5">
                <Satellite size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--text-secondary)]">No satellites found</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {/* API can return many results, limit to 50 for performance */}
                {data.member.slice(0, 50).map((satellite) => (
                  <SatelliteCard key={satellite.satelliteId} satellite={satellite} />
                ))}
              </div>
            )}
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
