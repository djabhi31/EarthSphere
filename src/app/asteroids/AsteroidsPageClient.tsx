'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { format, addDays } from 'date-fns';
import { Shield, ShieldAlert, Ruler, Gauge, Calendar, Navigation, Asterisk, AlertTriangle, ArrowDown } from 'lucide-react';

import { useNeoFeed } from '@/hooks/useNasaApi';
import { NearEarthObject } from '@/lib/types/nasa';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Enums
// ============================================================================

type SortOption = 'closest' | 'size' | 'speed';

// ============================================================================
// Helper Functions
// ============================================================================

function getAsteroidComparison(diameterMeters: number) {
  if (diameterMeters < 8) return { label: 'Car', value: 4, icon: '🚗' };
  if (diameterMeters < 20) return { label: 'Bus', value: 12, icon: '🚌' };
  if (diameterMeters < 60) return { label: 'House', value: 20, icon: '🏠' };
  if (diameterMeters < 100) return { label: 'Statue of Liberty', value: 93, icon: '🗽' };
  if (diameterMeters < 200) return { label: 'Football Field', value: 109, icon: '🏟️' };
  if (diameterMeters < 400) return { label: 'Eiffel Tower', value: 330, icon: '🗼' };
  if (diameterMeters < 1000) return { label: 'Burj Khalifa', value: 828, icon: '🏙️' };
  return { label: 'Small Mountain', value: 2000, icon: '⛰️' };
}

// ============================================================================
// Components
// ============================================================================

function StatCard({ title, value, icon: Icon, colorClass, highlight = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass rounded-2xl p-6 border flex items-start gap-4",
        highlight ? "border-red-500/50 bg-red-950/20" : "border-[var(--border-default)]"
      )}
    >
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      </div>
    </motion.div>
  );
}

function AsteroidCard({ asteroid }: { asteroid: NearEarthObject }) {
  const isHazardous = asteroid.is_potentially_hazardous_asteroid;
  
  // Extract values
  const diameterMin = asteroid.estimated_diameter.meters.estimated_diameter_min;
  const diameterMax = asteroid.estimated_diameter.meters.estimated_diameter_max;
  const avgDiameter = (diameterMin + diameterMax) / 2;
  
  const approachData = asteroid.close_approach_data[0];
  const speedKph = parseFloat(approachData?.relative_velocity.kilometers_per_hour || '0');
  const speedKms = parseFloat(approachData?.relative_velocity.kilometers_per_second || '0');
  const missLunar = parseFloat(approachData?.miss_distance.lunar || '0');
  const missKm = parseFloat(approachData?.miss_distance.kilometers || '0');
  
  const dateStr = approachData?.close_approach_date || '';
  
  const comparison = getAsteroidComparison(avgDiameter);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "glass rounded-2xl p-6 border flex flex-col gap-5 relative overflow-hidden transition-all hover:border-[var(--electric-cyan)] group",
        isHazardous ? "border-red-500/30" : "border-[var(--border-default)]"
      )}
    >
      {/* Background glow if hazardous */}
      {isHazardous && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10 group-hover:bg-red-500/20 transition-all"></div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Asterisk className="w-4 h-4 text-[var(--electric-cyan)]" />
            <span className="text-xs font-mono text-[var(--text-secondary)]">{asteroid.id}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{asteroid.name.replace(/[()]/g, '')}</h3>
        </div>
        
        {isHazardous ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Hazardous</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Safe</span>
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Ruler className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Est. Diameter</span>
          </div>
          <p className="text-lg font-semibold text-white">
            {avgDiameter.toFixed(1)} <span className="text-sm text-[var(--text-secondary)] font-normal">m</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            ≈ {comparison.icon} {comparison.label}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Gauge className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Velocity</span>
          </div>
          <p className="text-lg font-semibold text-white">
            {speedKms.toFixed(1)} <span className="text-sm text-[var(--text-secondary)] font-normal">km/s</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {Math.round(speedKph).toLocaleString()} km/h
          </p>
        </div>

        <div className="space-y-1 col-span-2 mt-2 pt-4 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Navigation className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Miss Distance ({dateStr})</span>
          </div>
          <div className="flex items-end gap-3 mt-1">
            <p className="text-2xl font-bold text-white">
              {missLunar.toFixed(1)} <span className="text-sm text-[var(--text-secondary)] font-normal">LD</span>
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-1">
              ({(missKm / 1000000).toFixed(2)}M km)
            </p>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function AsteroidsPageClient() {
  // Date calculation for the 7-day period
  const today = new Date();
  const startDateStr = format(today, 'yyyy-MM-dd');
  const endDateStr = format(addDays(today, 7), 'yyyy-MM-dd');

  // Fetch Data
  const { data, isLoading, isError } = useNeoFeed(startDateStr, endDateStr);

  // State
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('closest');

  // Process data
  const allAsteroids = useMemo(() => {
    if (!data?.near_earth_objects) return [];
    
    // Flatten the dictionary of arrays into a single array
    const flattened = Object.values(data.near_earth_objects).flat();
    
    // Filter and Sort
    let processed = [...flattened];
    
    if (showHazardousOnly) {
      processed = processed.filter(a => a.is_potentially_hazardous_asteroid);
    }
    
    processed.sort((a, b) => {
      const approachA = a.close_approach_data[0];
      const approachB = b.close_approach_data[0];
      
      switch (sortBy) {
        case 'closest':
          const distA = parseFloat(approachA?.miss_distance.kilometers || 'Infinity');
          const distB = parseFloat(approachB?.miss_distance.kilometers || 'Infinity');
          return distA - distB;
        case 'size':
          const sizeA = a.estimated_diameter.meters.estimated_diameter_max;
          const sizeB = b.estimated_diameter.meters.estimated_diameter_max;
          return sizeB - sizeA; // Descending (largest first)
        case 'speed':
          const speedA = parseFloat(approachA?.relative_velocity.kilometers_per_hour || '0');
          const speedB = parseFloat(approachB?.relative_velocity.kilometers_per_hour || '0');
          return speedB - speedA; // Descending (fastest first)
        default:
          return 0;
      }
    });
    
    return processed;
  }, [data, showHazardousOnly, sortBy]);

  // Derived Stats
  const stats = useMemo(() => {
    if (!data?.near_earth_objects) return null;
    const flat = Object.values(data.near_earth_objects).flat();
    
    const hazardous = flat.filter(a => a.is_potentially_hazardous_asteroid).length;
    
    let closestDist = Infinity;
    let closestName = '-';
    let fastestSpeed = 0;
    let fastestName = '-';
    let largestSize = 0;
    let largestName = '-';
    
    flat.forEach(a => {
      const app = a.close_approach_data[0];
      if (!app) return;
      
      const dist = parseFloat(app.miss_distance.lunar);
      if (dist < closestDist) {
        closestDist = dist;
        closestName = a.name;
      }
      
      const speed = parseFloat(app.relative_velocity.kilometers_per_second);
      if (speed > fastestSpeed) {
        fastestSpeed = speed;
        fastestName = a.name;
      }
      
      const size = a.estimated_diameter.meters.estimated_diameter_max;
      if (size > largestSize) {
        largestSize = size;
        largestName = a.name;
      }
    });

    return {
      total: data.element_count,
      hazardous,
      closest: { dist: closestDist, name: closestName },
      fastest: { speed: fastestSpeed, name: fastestName },
      largest: { size: largestSize, name: largestName }
    };
  }, [data]);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--cosmic-purple)]/20 to-transparent -z-10" />
        
        <div className="ep-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="ep-eyebrow mb-4">Near-Earth Object Tracker</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Watching the <span className="text-gradient">Skies</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
              Monitoring asteroids and comets passing close to Earth over the next 7 days. 
              Data powered by NASA's NeoWs API.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="ep-container space-y-12">
        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass rounded-2xl p-6 h-32 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="glass-strong p-8 rounded-2xl text-center border-red-500/30">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
            <p className="text-[var(--text-secondary)]">Could not fetch asteroid data from NASA.</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Approaching" 
              value={stats.total} 
              icon={Asterisk} 
              colorClass="bg-blue-500/20 text-blue-400" 
            />
            <StatCard 
              title="Potentially Hazardous" 
              value={stats.hazardous} 
              icon={ShieldAlert} 
              colorClass="bg-red-500/20 text-red-400" 
              highlight={stats.hazardous > 0}
            />
            <StatCard 
              title="Closest Approach" 
              value={`${stats.closest.dist.toFixed(1)} LD`} 
              icon={Navigation} 
              colorClass="bg-emerald-500/20 text-emerald-400" 
            />
            <StatCard 
              title="Largest Object" 
              value={`${Math.round(stats.largest.size)}m`} 
              icon={Ruler} 
              colorClass="bg-purple-500/20 text-purple-400" 
            />
          </div>
        ) : null}

        {/* Controls & List */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 glass rounded-2xl border border-[var(--border-default)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHazardousOnly(false)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  !showHazardousOnly ? "bg-[var(--surface-active)] text-white" : "text-[var(--text-secondary)] hover:text-white"
                )}
              >
                All Objects
              </button>
              <button
                onClick={() => setShowHazardousOnly(true)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2",
                  showHazardousOnly ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-[var(--text-secondary)] hover:text-red-400"
                )}
              >
                Hazardous Only
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-[var(--text-secondary)]">Sort by:</span>
              <div className="flex bg-[var(--surface-elevated)] rounded-xl p-1 border border-[var(--border-default)] w-full sm:w-auto">
                {(['closest', 'size', 'speed'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={cn(
                      "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors",
                      sortBy === option ? "bg-[var(--electric-cyan)] text-black" : "text-[var(--text-secondary)] hover:text-white"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass rounded-2xl h-64 animate-pulse bg-white/5" />
              ))
            ) : allAsteroids.length > 0 ? (
              allAsteroids.map((asteroid) => (
                <AsteroidCard key={asteroid.id} asteroid={asteroid} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <Shield className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No asteroids found</h3>
                <p className="text-[var(--text-secondary)]">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
