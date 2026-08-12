"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Flame, Zap, MapPin, Gauge, Timer, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { useFireballs } from '@/hooks/useNasaApi';
import { format, subYears } from 'date-fns';
import { cn } from '@/lib/utils';

export default function FireballsPageClient() {
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  
  // Default to last 2 years
  const endDate = new Date();
  const startDate = subYears(endDate, 2);
  
  const { data, isLoading, error } = useFireballs({
    'date-min': format(startDate, 'yyyy-MM-dd')
  });

  const parsedData = useMemo(() => {
    if (!data?.fields || !data?.data) return [];
    
    return data.data.map((row: any[]) => {
      const obj: any = {};
      data.fields.forEach((field: string, index: number) => {
        obj[field] = row[index];
      });
      return obj;
    });
  }, [data]);

  const sortedData = useMemo(() => {
    const sortableItems = [...parsedData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle numeric parsing
        if (sortConfig.key !== 'date') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [parsedData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getEnergyColor = (energyStr: string) => {
    const energy = parseFloat(energyStr);
    if (!energy) return "bg-gray-500/20 text-gray-400";
    if (energy < 1) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (energy < 10) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (energy < 100) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const stats = useMemo(() => {
    if (!parsedData.length) return null;
    
    let maxEnergy = 0;
    let totalVelocity = 0;
    let velocityCount = 0;
    let maxAltitude = 0;

    parsedData.forEach(item => {
      const energy = parseFloat(item.energy) || 0;
      const velocity = parseFloat(item.vel) || 0;
      const altitude = parseFloat(item.alt) || 0;

      if (energy > maxEnergy) maxEnergy = energy;
      if (velocity > 0) {
        totalVelocity += velocity;
        velocityCount++;
      }
      if (altitude > maxAltitude) maxAltitude = altitude;
    });

    return {
      total: parsedData.length,
      maxEnergy: maxEnergy.toFixed(1),
      avgVelocity: velocityCount > 0 ? (totalVelocity / velocityCount).toFixed(1) : 'N/A',
      maxAltitude: maxAltitude.toFixed(1)
    };
  }, [parsedData]);

  return (
    <div className="ep-container py-12 min-h-screen relative overflow-hidden">
      {/* Meteor animation styles - scoped to this component visually */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes meteor {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-1000px); opacity: 0; }
        }
        .meteor-shower {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }
        .meteor {
          position: absolute;
          top: -100px;
          left: 50%;
          width: 300px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,100,50,0), rgba(255,100,50,1));
          animation: meteor 5s linear infinite;
          opacity: 0;
        }
        .meteor::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ffaa55;
          box-shadow: 0 0 10px 2px #ff5500;
          right: 0;
          top: -1.5px;
        }
        .meteor:nth-child(1) { top: -50px; left: 80%; animation-delay: 0s; animation-duration: 4s; }
        .meteor:nth-child(2) { top: 100px; left: 100%; animation-delay: 1.2s; animation-duration: 5s; }
        .meteor:nth-child(3) { top: 300px; left: 120%; animation-delay: 2.5s; animation-duration: 3s; }
      `}} />
      
      <div className="meteor-shower">
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 glass rounded-full mb-4 border-[var(--border-default)] shadow-[0_0_30px_rgba(255,100,50,0.2)]">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">Fireball & Bolide Tracker</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Track atmospheric entry of exceptionally bright meteors. Data covers events over the last 2 years based on US Government sensors.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="glass h-32 rounded-2xl animate-pulse"></div>)}
          </div>
          <div className="glass h-[500px] rounded-3xl animate-pulse mt-8"></div>
        </div>
      ) : error ? (
        <div className="glass-strong p-8 rounded-2xl text-center text-red-400 border-red-500/30 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
          <p>Failed to load fireball data. Please try again later.</p>
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="glass p-6 rounded-2xl border-orange-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-[var(--text-muted)] text-sm font-medium mb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Total Events</div>
                  <div className="text-3xl font-bold text-white mt-auto">{stats.total}</div>
                </div>
              </motion.div>
              
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="glass p-6 rounded-2xl border-red-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-[var(--text-muted)] text-sm font-medium mb-2 flex items-center gap-2"><Zap className="w-4 h-4"/> Max Energy (kt)</div>
                  <div className="text-3xl font-bold text-red-400 mt-auto">{stats.maxEnergy}</div>
                </div>
              </motion.div>
              
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="glass p-6 rounded-2xl border-blue-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-[var(--text-muted)] text-sm font-medium mb-2 flex items-center gap-2"><Gauge className="w-4 h-4"/> Avg Velocity (km/s)</div>
                  <div className="text-3xl font-bold text-blue-400 mt-auto">{stats.avgVelocity}</div>
                </div>
              </motion.div>
              
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="glass p-6 rounded-2xl border-purple-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-[var(--text-muted)] text-sm font-medium mb-2 flex items-center gap-2"><Timer className="w-4 h-4"/> Max Altitude (km)</div>
                  <div className="text-3xl font-bold text-purple-400 mt-auto">{stats.maxAltitude}</div>
                </div>
              </motion.div>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-3xl overflow-hidden border border-[var(--border-default)]"
          >
            <div className="p-6 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--surface-primary)]">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /> Recorded Events</h2>
              <span className="text-sm text-[var(--text-muted)]">Sort by clicking headers</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface-primary)]/50 text-[var(--text-muted)] uppercase text-xs">
                  <tr>
                    {[
                      { key: 'date', label: 'Date/Time' },
                      { key: 'lat', label: 'Latitude' },
                      { key: 'lon', label: 'Longitude' },
                      { key: 'alt', label: 'Altitude (km)' },
                      { key: 'vel', label: 'Velocity (km/s)' },
                      { key: 'energy', label: 'Impact Energy (kt)' },
                    ].map((col) => (
                      <th 
                        key={col.key}
                        onClick={() => requestSort(col.key)}
                        className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <ArrowUpDown className={cn(
                            "w-3 h-3 transition-opacity", 
                            sortConfig?.key === col.key ? "opacity-100 text-orange-400" : "opacity-0 group-hover:opacity-50"
                          )} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {sortedData.map((item, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * Math.min(i, 10) }}
                      key={item.date} 
                      className="hover:bg-[var(--surface-primary)] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4">{item.lat ? `${item.lat} ${item.latDir}` : '-'}</td>
                      <td className="px-6 py-4">{item.lon ? `${item.lon} ${item.lonDir}` : '-'}</td>
                      <td className="px-6 py-4">{item.alt || '-'}</td>
                      <td className="px-6 py-4">{item.vel || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-md border text-xs font-semibold", getEnergyColor(item.energy))}>
                          {item.energy || '-'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {sortedData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)]">
                        No fireballs recorded in this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
