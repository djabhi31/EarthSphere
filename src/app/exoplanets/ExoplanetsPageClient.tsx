'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExoplanets } from '@/hooks/useNasaApi';
import { cn } from '@/lib/utils';
import { Search, Star, Telescope, Globe2, Database, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { DataState } from "@/components/site/DataState";
import { Skeleton } from '@/components/ui/skeleton';

type SortField = 'pl_name' | 'hostname' | 'discoverymethod' | 'disc_year' | 'pl_rade' | 'pl_bmasse' | 'sy_dist';
type SortOrder = 'asc' | 'desc';

export default function ExoplanetsPageClient() {
  const { data: exoplanets = [], isLoading, error, refetch } = useExoplanets();

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

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE));
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

  if (error) return <DataState error={error} retry={() => { void refetch(); }} />;

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      <div className="ep-container">

        {/* Hero Section */}


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
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('pl_name')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('pl_name'); } }} aria-sort={sortField === 'pl_name' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
                        Planet Name {renderSortIcon('pl_name')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('hostname')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('hostname'); } }} aria-sort={sortField === 'hostname' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
                        Host Star {renderSortIcon('hostname')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('discoverymethod')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('discoverymethod'); } }} aria-sort={sortField === 'discoverymethod' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
                        Method {renderSortIcon('discoverymethod')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors" onClick={() => toggleSort('disc_year')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('disc_year'); } }} aria-sort={sortField === 'disc_year' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
                        Year {renderSortIcon('disc_year')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors text-right" onClick={() => toggleSort('pl_rade')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('pl_rade'); } }} aria-sort={sortField === 'pl_rade' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
                        Radius (R⊕) {renderSortIcon('pl_rade')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors text-right" onClick={() => toggleSort('pl_bmasse')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('pl_bmasse'); } }} aria-sort={sortField === 'pl_bmasse' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
                        Mass (M⊕) {renderSortIcon('pl_bmasse')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer group hover:text-white transition-colors text-right" onClick={() => toggleSort('sy_dist')} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSort('sy_dist'); } }} aria-sort={sortField === 'sy_dist' ? sortOrder === 'asc' ? 'ascending' : 'descending' : 'none'}>
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
                              <button aria-expanded={expandedRow === planet.pl_name} onClick={event => { event.stopPropagation(); setExpandedRow(expandedRow === planet.pl_name ? null : planet.pl_name); }}>{planet.pl_name}</button>
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
