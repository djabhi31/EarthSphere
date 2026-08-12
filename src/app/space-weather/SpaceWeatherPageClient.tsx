'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, subDays } from 'date-fns';
import { Zap, Sun, Activity, Shield, Thermometer, Calendar, Clock, Compass, ActivityIcon } from 'lucide-react';

import { useDONKISolarFlares, useDONKICME, useDONKIGST } from '@/hooks/useNasaApi';
import { DONKISolarFlare, DONKICME, DONKIGeomagneticStorm } from '@/lib/types/nasa';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Enums
// ============================================================================

type TabType = 'flares' | 'cmes' | 'storms';

// ============================================================================
// Helper Components
// ============================================================================

function StatCard({ title, value, icon: Icon, colorClass, subtitle }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-[var(--border-default)] flex items-start gap-4"
    >
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------------
// Flare Components
// ----------------------------------------------------------------------------

function getFlareColor(classType: string) {
  if (classType.startsWith('X')) return 'text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
  if (classType.startsWith('M')) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  if (classType.startsWith('C')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
}

function FlareCard({ flare }: { flare: DONKISolarFlare }) {
  const colorClass = getFlareColor(flare.classType);
  const dateStr = flare.beginTime ? format(new Date(flare.beginTime), 'MMM d, yyyy HH:mm') : 'Unknown Date';

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock className="w-4 h-4" />
          <span>{dateStr}</span>
        </div>
        <div className={cn("px-2.5 py-1 rounded-md border text-xs font-bold", colorClass)}>
          Class {flare.classType}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Source Location</p>
          <p className="font-mono text-sm text-white group-hover:text-[var(--electric-cyan)] transition-colors">
            {flare.sourceLocation || 'Unknown'}
          </p>
        </div>
        {flare.activeRegionNum && (
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Active Region</p>
            <p className="font-mono text-sm text-white">AR {flare.activeRegionNum}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// CME Components
// ----------------------------------------------------------------------------

function CMECard({ cme }: { cme: DONKICME }) {
  const analysis = cme.cmeAnalyses?.[0]; // Get primary analysis
  const dateStr = cme.startTime ? format(new Date(cme.startTime), 'MMM d, yyyy HH:mm') : 'Unknown Date';
  
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4" />
          <span>{dateStr}</span>
        </div>
        {analysis?.type && (
          <div className="px-2.5 py-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold">
            {analysis.type}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1 mb-1">
            <ActivityIcon className="w-3 h-3" /> Speed
          </p>
          <p className="text-lg font-semibold text-white">
            {analysis?.speed ? `${Math.round(analysis.speed)} km/s` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1 mb-1">
            <Compass className="w-3 h-3" /> Direction (Lat/Lon)
          </p>
          <p className="font-mono text-sm text-white mt-1">
            {analysis ? `${analysis.latitude}° / ${analysis.longitude}°` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Storm Components
// ----------------------------------------------------------------------------

function getKpColor(kp: number) {
  if (kp >= 8) return 'bg-red-500 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  if (kp >= 6) return 'bg-orange-500 text-orange-100';
  if (kp >= 4) return 'bg-yellow-500 text-yellow-900';
  return 'bg-emerald-500 text-emerald-100';
}

function StormCard({ storm }: { storm: DONKIGeomagneticStorm }) {
  const maxKpObj = storm.allKpIndex?.reduce((prev, current) => (prev.kpIndex > current.kpIndex) ? prev : current, { kpIndex: 0 } as any);
  const maxKp = maxKpObj?.kpIndex || 0;
  
  const dateStr = storm.startTime ? format(new Date(storm.startTime), 'MMM d, yyyy') : 'Unknown Date';
  const colorClass = getKpColor(maxKp);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Shield className="w-4 h-4" />
          <span>{dateStr}</span>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          ID: {storm.gstID.split('-')[0]}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Max Kp Index</p>
          <span className="font-bold text-white">{maxKp.toFixed(1)}</span>
        </div>
        
        {/* Kp Bar Visualization */}
        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden flex relative">
          {/* Markers */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div key={i} className="flex-1 border-r border-white/10 last:border-0 h-full relative" />
          ))}
          {/* Active Bar */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(maxKp / 9) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn("absolute top-0 left-0 h-full rounded-full", colorClass)}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--text-muted)] px-1">
          <span>0 (Calm)</span>
          <span>5 (Minor)</span>
          <span>9 (Extreme)</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function SpaceWeatherPageClient() {
  const [activeTab, setActiveTab] = useState<TabType>('flares');
  
  // Date states
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  
  const [startDateStr, setStartDateStr] = useState(format(thirtyDaysAgo, 'yyyy-MM-dd'));
  const [endDateStr, setEndDateStr] = useState(format(today, 'yyyy-MM-dd'));

  // Fetch Data
  const { data: flares, isLoading: isLoadingFlares } = useDONKISolarFlares(startDateStr, endDateStr);
  const { data: cmes, isLoading: isLoadingCMEs } = useDONKICME(startDateStr, endDateStr);
  const { data: storms, isLoading: isLoadingStorms } = useDONKIGST(startDateStr, endDateStr);

  const isLoading = isLoadingFlares || isLoadingCMEs || isLoadingStorms;

  // Derived Stats
  const stats = useMemo(() => {
    let strongestFlare = 'None';
    
    if (flares && flares.length > 0) {
      // Very rough sorting for class type (X > M > C > B > A)
      const sortedFlares = [...flares].sort((a, b) => {
        const valA = (a.classType[0].charCodeAt(0) * -100) + parseFloat(a.classType.substring(1) || '0');
        const valB = (b.classType[0].charCodeAt(0) * -100) + parseFloat(b.classType.substring(1) || '0');
        return valB - valA;
      });
      strongestFlare = sortedFlares[0].classType;
    }

    return {
      flareCount: flares?.length || 0,
      cmeCount: cmes?.length || 0,
      stormCount: storms?.length || 0,
      strongestFlare
    };
  }, [flares, cmes, storms]);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent -z-10" />
        
        <div className="ep-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="ep-eyebrow mb-4">DONKI Dashboard</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Space <span className="text-gradient">Weather</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-8">
              Monitor solar activity, coronal mass ejections, and geomagnetic storms 
              affecting Earth's space environment. Data from NASA's Space Weather Database Of Notifications, Knowledge, Information (DONKI).
            </p>
            
            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white/5 p-2 pl-4 rounded-full border border-white/10 w-fit backdrop-blur-md">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Date Range:</span>
              <input 
                type="date" 
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--electric-cyan)]"
              />
              <span className="text-[var(--text-muted)]">to</span>
              <input 
                type="date" 
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--electric-cyan)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="ep-container space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Solar Flares" 
            value={isLoading ? '-' : stats.flareCount} 
            icon={Zap} 
            colorClass="bg-yellow-500/20 text-yellow-400" 
            subtitle="Recent eruptions"
          />
          <StatCard 
            title="Strongest Flare" 
            value={isLoading ? '-' : stats.strongestFlare} 
            icon={Thermometer} 
            colorClass="bg-red-500/20 text-red-400"
            subtitle="Peak magnitude"
          />
          <StatCard 
            title="CMEs" 
            value={isLoading ? '-' : stats.cmeCount} 
            icon={Sun} 
            colorClass="bg-orange-500/20 text-orange-400" 
            subtitle="Mass ejections"
          />
          <StatCard 
            title="Geomagnetic Storms" 
            value={isLoading ? '-' : stats.stormCount} 
            icon={Activity} 
            colorClass="bg-blue-500/20 text-blue-400" 
            subtitle="Earth impacts"
          />
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex bg-[var(--surface-elevated)] p-1 rounded-xl border border-[var(--border-default)]">
          <button 
            onClick={() => setActiveTab('flares')}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors", activeTab === 'flares' ? 'bg-[var(--surface-active)] text-white' : 'text-[var(--text-secondary)]')}
          >
            Flares
          </button>
          <button 
            onClick={() => setActiveTab('cmes')}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors", activeTab === 'cmes' ? 'bg-[var(--surface-active)] text-white' : 'text-[var(--text-secondary)]')}
          >
            CMEs
          </button>
          <button 
            onClick={() => setActiveTab('storms')}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors", activeTab === 'storms' ? 'bg-[var(--surface-active)] text-white' : 'text-[var(--text-secondary)]')}
          >
            Storms
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Flares Panel */}
          <div className={cn("glass-strong rounded-3xl border border-[var(--border-default)] p-6 flex flex-col h-[600px]", activeTab !== 'flares' && "hidden lg:flex")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Solar Flares</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {isLoadingFlares ? (
                [1,2,3,4].map(i => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)
              ) : flares && flares.length > 0 ? (
                flares.map(flare => <FlareCard key={flare.flrID} flare={flare} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-center pb-12">
                  <Zap className="w-12 h-12 mb-3 opacity-20" />
                  <p>No solar flares recorded<br/>in this time period.</p>
                </div>
              )}
            </div>
          </div>

          {/* CMEs Panel */}
          <div className={cn("glass-strong rounded-3xl border border-[var(--border-default)] p-6 flex flex-col h-[600px]", activeTab !== 'cmes' && "hidden lg:flex")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Sun className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Coronal Mass Ejections</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {isLoadingCMEs ? (
                [1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />)
              ) : cmes && cmes.length > 0 ? (
                cmes.map(cme => <CMECard key={cme.activityID} cme={cme} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-center pb-12">
                  <Sun className="w-12 h-12 mb-3 opacity-20" />
                  <p>No CMEs recorded<br/>in this time period.</p>
                </div>
              )}
            </div>
          </div>

          {/* Storms Panel */}
          <div className={cn("glass-strong rounded-3xl border border-[var(--border-default)] p-6 flex flex-col h-[600px]", activeTab !== 'storms' && "hidden lg:flex")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Geomagnetic Storms</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {isLoadingStorms ? (
                [1,2,3].map(i => <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />)
              ) : storms && storms.length > 0 ? (
                storms.map(storm => <StormCard key={storm.gstID} storm={storm} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-center pb-12">
                  <Shield className="w-12 h-12 mb-3 opacity-20" />
                  <p>No geomagnetic storms recorded<br/>in this time period.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
