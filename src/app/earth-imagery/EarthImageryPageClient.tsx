'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Calendar, Search, Loader2, ExternalLink,
  Mountain, Building2, TreePine, Waves, Landmark,
  Globe, Camera, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEarthAssets } from '@/hooks/useNasaApi';
import { fetchEarthImagery } from '@/lib/nasa-api';

// ---------------------------------------------------------------------------
// Preset Locations
// ---------------------------------------------------------------------------

interface PresetLocation {
  name: string;
  lat: number;
  lon: number;
  icon: React.ReactNode;
  description: string;
}

const PRESETS: PresetLocation[] = [
  { name: 'Grand Canyon', lat: 36.1069, lon: -112.1129, icon: <Mountain size={16} />, description: 'Arizona, USA' },
  { name: 'New York City', lat: 40.7128, lon: -74.006, icon: <Building2 size={16} />, description: 'New York, USA' },
  { name: 'Amazon Rainforest', lat: -3.4653, lon: -62.2159, icon: <TreePine size={16} />, description: 'Brazil' },
  { name: 'Great Barrier Reef', lat: -18.2871, lon: 147.6992, icon: <Waves size={16} />, description: 'Australia' },
  { name: 'Sahara Desert', lat: 23.4162, lon: 25.6628, icon: <Globe size={16} />, description: 'North Africa' },
  { name: 'Mount Everest', lat: 27.9881, lon: 86.925, icon: <Mountain size={16} />, description: 'Nepal/Tibet' },
  { name: 'Taj Mahal', lat: 27.1751, lon: 78.0421, icon: <Landmark size={16} />, description: 'Agra, India' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, icon: <Building2 size={16} />, description: 'Japan' },
];

// ---------------------------------------------------------------------------
// Main Page Client
// ---------------------------------------------------------------------------

export default function EarthImageryPageClient() {
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [searchLat, setSearchLat] = useState<number | null>(null);
  const [searchLon, setSearchLon] = useState<number | null>(null);
  const [searchDate, setSearchDate] = useState<string | undefined>(undefined);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Query for asset metadata
  const { data: assets, isLoading, isError, error } = useEarthAssets(
    searchLat ?? 0,
    searchLon ?? 0,
    searchDate,
  );

  const hasSearched = searchLat !== null && searchLon !== null;

  // Construct imagery URL
  const imageryUrl = useMemo(() => {
    if (!searchLat || !searchLon) return null;
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
    const dateParam = searchDate ? `&date=${searchDate}` : '';
    return `https://api.nasa.gov/planetary/earth/imagery?lat=${searchLat}&lon=${searchLon}&dim=0.1${dateParam}&api_key=${apiKey}`;
  }, [searchLat, searchLon, searchDate]);

  const handleSearch = () => {
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      setSearchLat(parsedLat);
      setSearchLon(parsedLon);
      setSearchDate(date || undefined);
    }
  };

  const handlePresetClick = (preset: PresetLocation) => {
    setLat(String(preset.lat));
    setLon(String(preset.lon));
    setSearchLat(preset.lat);
    setSearchLon(preset.lon);
    setSearchDate(date || undefined);
    setSelectedPreset(preset.name);
  };

  return (
    <main className="min-h-screen bg-canvas pt-20">
      {/* Hero Section */}
      <section className="ep-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--electric-blue)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="ep-container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="ep-eyebrow flex items-center justify-center gap-2 mb-4">
              <Camera size={14} />
              Landsat Satellite Imagery
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-display)' }}>
              <span className="text-gradient">Earth Imagery</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Explore satellite photographs of any location on Earth captured by NASA&apos;s Landsat 8 satellite through Google Earth Engine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Controls */}
      <section className="ep-container -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-strong rounded-2xl p-6 border border-[var(--border-default)]"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search size={18} className="text-[var(--electric-cyan)]" />
            Search Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g. 36.1069"
                className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-cyan)] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Longitude</label>
              <input
                type="number"
                step="any"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="e.g. -112.1129"
                className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-cyan)] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Date (optional)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-cyan)] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!lat || !lon}
                className="w-full rounded-lg bg-[var(--electric-cyan)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Globe size={16} />
                View Imagery
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Preset Locations */}
      <section className="ep-container mt-8">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <MapPin size={14} className="text-[var(--electric-cyan)]" />
          Popular Locations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESETS.map((preset) => (
            <motion.button
              key={preset.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "glass rounded-xl px-3 py-3 text-left transition-all hover:border-[var(--electric-cyan)]/40",
                selectedPreset === preset.name && "border-[var(--electric-cyan)] bg-[var(--electric-cyan)]/10"
              )}
            >
              <div className={cn(
                "mb-1",
                selectedPreset === preset.name ? "text-[var(--electric-cyan)]" : "text-[var(--text-muted)]"
              )}>
                {preset.icon}
              </div>
              <div className="text-xs font-medium text-[var(--text-primary)] truncate">{preset.name}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">{preset.description}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="ep-container mt-8 pb-20">
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Globe size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="text-lg font-medium text-[var(--text-secondary)]">
              Enter coordinates or select a preset to view satellite imagery
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Powered by NASA Landsat 8 via Google Earth Engine
            </p>
          </motion.div>
        )}

        {hasSearched && isLoading && (
          <div className="glass rounded-2xl p-12 text-center">
            <Loader2 size={32} className="mx-auto mb-4 text-[var(--electric-cyan)] animate-spin" />
            <p className="text-[var(--text-secondary)]">Fetching satellite imagery...</p>
          </div>
        )}

        {hasSearched && isError && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-[var(--warning-red)] font-medium">Unable to load imagery for this location</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">{(error as Error)?.message || 'No imagery available for the specified coordinates/date.'}</p>
          </div>
        )}

        {hasSearched && !isLoading && !isError && imageryUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Image Display */}
            <div className="glass-strong rounded-2xl overflow-hidden border border-[var(--border-default)]">
              <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {selectedPreset || `${searchLat?.toFixed(4)}°, ${searchLon?.toFixed(4)}°`}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {assets?.date ? `Captured: ${new Date(assets.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : 'Latest available'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFullscreen(true)}
                    className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
                  >
                    Fullscreen
                  </button>
                  <a
                    href={imageryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
                  >
                    Download <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <div className="relative aspect-square max-h-[600px] bg-[var(--surface-secondary)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageryUrl}
                  alt={`Satellite imagery of ${selectedPreset || 'selected location'}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    (e.target as HTMLImageElement).alt = 'No imagery available';
                  }}
                />
              </div>
            </div>

            {/* Metadata */}
            {assets && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-[var(--text-muted)] mb-1">Coordinates</div>
                  <div className="text-sm font-mono font-medium text-[var(--text-primary)]">
                    {searchLat?.toFixed(4)}°N, {searchLon?.toFixed(4)}°E
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-[var(--text-muted)] mb-1">Capture Date</div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {assets.date ? new Date(assets.date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-[var(--text-muted)] mb-1">Dataset</div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {assets.resource?.dataset || 'Landsat 8'}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {fullscreen && imageryUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X size={24} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageryUrl}
              alt="Fullscreen satellite imagery"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
