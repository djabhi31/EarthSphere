'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExoplanets } from '@/hooks/useNasaApi';
import type { Exoplanet } from '@/lib/types/nasa';
import { cn } from '@/lib/utils';
import { Search, Orbit, Star, Telescope, Globe2, ChevronDown, ChevronUp, Database, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type SortField = 'pl_name' | 'hostname' | 'discoverymethod' | 'disc_year' | 'pl_rade' | 'pl_bmasse' | 'sy_dist';
type SortOrder = 'asc' | 'desc';

export default function ExoplanetsPageClient() {
  const { data: exoplanets = [], isLoading } = useExoplanets();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('disc_year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 25;

  const discoveryMethods = useMemo(() => {
    if (!exoplanets.length) return [];
    const methods = new Set<string>();
    exoplanets.forEach(p => p.discoverymethod && methods.add(p.discoverymethod));
    return Array.from(methods).sort();
  }, [exoplanets]);

  const stats = useMemo(() => {
    if (!exoplanets.length) return null;
    const years = exoplanets.map(p => p.disc_year).filter(y => y);
    const maxYear = years.length ? Math.max(...years) : 0;
    
    const methodsCount = exoplanets.reduce((acc, p) => {
      acc[p.discoverymethod] = (acc[p.discoverymethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: exoplanets.length,
      methodsCount,
      maxYear
    };
  }, [exoplanets]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...exoplanets];

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.pl_name.toLowerCase().includes(lowerQ) || 
        p.hostname.toLowerCase().includes(lowerQ)
      );
    }

    if (methodFilter !== 'All') {
      result = result.filter(p => p.discoverymethod === methodFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === null && bVal !== null) return 1;
      if (bVal === null && aVal !== null) return -1;
      if (aVal === null && bVal === null) return 0;
      
      if (aVal! < bVal!) return sortOrder === 'asc' ? -1 : 1;
      if (aVal! > bVal!) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [exoplanets, searchQuery, methodFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const currentData = filteredAndSortedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    return <ArrowUpDown className={cn("inline-block w-3 h-3 ml-1", sortField === field ? "text-[var(--cosmic-purple)]" : "text-gray-500 opacity-0 group-hover:opacity-100")} />;
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Animated Star Field Hero Background */}
      <div className="absolute top-0 left-0 right-0 h-[600px] -z-10 bg-gradient-to-b from-black via-black/90 to-[var(--surface-primary)] overflow-hidden">
        {/* Simple CSS-based stars generation */}
        {Array.from({ length: 150 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 4 + 2}s infinite alternate`
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(112,0,255,0.15),transparent_50%)]" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}} />

      <div className="pt-32 px-6 ep-container">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ep-eyebrow justify-center text-[var(--cosmic-purple)]"
          >
            <Orbit className="w-4 h-4 mr-2" />
            Exoplanet Archive
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--cosmic-purple)] to-fuchsia-400"
          >
            Worlds Beyond
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            Explore confirmed exoplanets discovered by Kepler, TESS, and other observatories across the galaxy.
          </motion.p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl w-full glass" />)}
          </div>
        ) : stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass rounded-2xl p-6 border border-[var(--border-default)] hover:border-[var(--cosmic-purple)]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--cosmic-purple)]/20 rounded-xl">
                  <Globe2 className="w-6 h-6 text-[var(--cosmic-purple)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Confirmed Planets</p>
                  <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-6 border border-[var(--border-default)] hover:border-[var(--cosmic-purple)]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-fuchsia-500/20 rounded-xl">
                  <Telescope className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Discovery Methods</p>
                  <p className="text-3xl font-bold">{Object.keys(stats.methodsCount).length}</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-[var(--border-default)] hover:border-[var(--cosmic-purple)]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Most Recent Discovery</p>
                  <p className="text-3xl font-bold">{stats.maxYear}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="glass rounded-t-2xl p-4 md:p-6 border border-[var(--border-default)] border-b-0 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search planet or host star..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full bg-black/40 border border-[var(--border-default)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--cosmic-purple)] transition-colors"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
              className="bg-black/40 border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--cosmic-purple)] shrink-0"
            >
              <option value="All">All Discovery Methods</option>
              {discoveryMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass rounded-b-2xl border border-[var(--border-default)] overflow-hidden relative">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1,2,3,4,5,6,7].map(i => <Skeleton key={i} className="h-12 w-full opacity-20" />)}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 text-[var(--text-secondary)] border-b border-[var(--border-default)] uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('pl_name')}>
                        Planet Name {renderSortIcon('pl_name')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('hostname')}>
                        Host Star {renderSortIcon('hostname')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('discoverymethod')}>
                        Method {renderSortIcon('discoverymethod')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('disc_year')}>
                        Year {renderSortIcon('disc_year')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors text-right" onClick={() => toggleSort('pl_rade')}>
                        Radius (R⊕) {renderSortIcon('pl_rade')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors text-right" onClick={() => toggleSort('pl_bmasse')}>
                        Mass (M⊕) {renderSortIcon('pl_bmasse')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors text-right" onClick={() => toggleSort('sy_dist')}>
                        Distance (pc) {renderSortIcon('sy_dist')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                          <Database className="w-8 h-8 mx-auto mb-3 opacity-50" />
                          No exoplanets found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      currentData.map((planet, idx) => (
                        <React.Fragment key={`${planet.pl_name}-${idx}`}>
                          <tr 
                            onClick={() => setExpandedRow(expandedRow === planet.pl_name ? null : planet.pl_name)}
                            className="hover:bg-white/5 cursor-pointer transition-colors group"
                          >
                            <td className="px-6 py-4 font-semibold text-[var(--cosmic-purple)] group-hover:text-fuchsia-300 transition-colors">
                              {planet.pl_name}
                            </td>
                            <td className="px-6 py-4 text-gray-300">{planet.hostname}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                                {planet.discoverymethod}
                              </span>
                            </td>
                            <td className="px-6 py-4">{planet.disc_year || '-'}</td>
                            <td className="px-6 py-4 text-right">{planet.pl_rade?.toFixed(2) || '-'}</td>
                            <td className="px-6 py-4 text-right">{planet.pl_bmasse?.toFixed(2) || '-'}</td>
                            <td className="px-6 py-4 text-right">{planet.sy_dist?.toFixed(2) || '-'}</td>
                          </tr>
                          {/* Expanded Details Row */}
                          <AnimatePresence>
                            {expandedRow === planet.pl_name && (
                              <tr>
                                <td colSpan={7} className="p-0 border-b-0">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-black/40 border-y border-[var(--cosmic-purple)]/30"
                                  >
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-white border-b border-white/10 pb-2">Planetary Orbit</h4>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Orbital Period:</span> {planet.pl_orbper ? `${planet.pl_orbper.toFixed(2)} days` : 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Semi-Major Axis:</span> {planet.pl_orbsmax ? `${planet.pl_orbsmax.toFixed(3)} AU` : 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Equilibrium Temp:</span> {planet.pl_eqt ? `${planet.pl_eqt} K` : 'Unknown'}</div>
                                      </div>
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-white border-b border-white/10 pb-2">Stellar System</h4>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Number of Stars:</span> {planet.sy_snum || 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Number of Planets:</span> {planet.sy_pnum || 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Discovery Facility:</span> <span className="truncate max-w-[150px]" title={planet.disc_facility || ''}>{planet.disc_facility || 'Unknown'}</span></div>
                                      </div>
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-white border-b border-white/10 pb-2">Host Star Specs</h4>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Spectral Type:</span> {planet.st_spectype || 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Effective Temp:</span> {planet.st_teff ? `${planet.st_teff} K` : 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Stellar Mass:</span> {planet.st_mass ? `${planet.st_mass} M☉` : 'Unknown'}</div>
                                        <div className="flex justify-between text-gray-400"><span className="text-[var(--text-secondary)]">Stellar Radius:</span> {planet.st_rad ? `${planet.st_rad} R☉` : 'Unknown'}</div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[var(--border-default)] flex items-center justify-between bg-black/20">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
