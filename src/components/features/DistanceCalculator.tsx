'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';
import { cn, getLatestGeometry } from '@/lib/utils';
import { calculateDistance } from '@/lib/severity';
import type { EONETEvent } from '@/lib/types';
import { audioSynth } from '@/lib/audio';

interface DistanceCalculatorProps {
  event: EONETEvent;
  className?: string;
}

const CITY_PRESETS: { name: string; lat: number; lon: number }[] = [
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
];

export function DistanceCalculator({ event, className }: DistanceCalculatorProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const geo = getLatestGeometry(event);
  const coords = geo?.coordinates as number[] | undefined;

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);
    audioSynth.playClick();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: 'Your Location',
        });
        setIsLocating(false);
      },
      (err) => {
        setErrorMsg('Unable to retrieve location. Please choose a preset city.');
        setIsLocating(false);
      }
    );
  };

  const distance = coords && coords.length >= 2 && userLocation
    ? calculateDistance(userLocation.lat, userLocation.lon, coords[1], coords[0])
    : null;

  let threatLevel = 'Far Distance';
  let threatColor = 'text-white/60';
  if (distance) {
    if (distance.km < 500) {
      threatLevel = 'Nearby Regional Proximity (<500 km)';
      threatColor = 'text-red-400';
    } else if (distance.km < 2000) {
      threatLevel = 'Moderate Continental Range (<2000 km)';
      threatColor = 'text-amber-400';
    } else {
      threatLevel = 'Safe Intercontinental Distance';
      threatColor = 'text-electric-cyan';
    }
  }

  return (
    <div className={cn('glass rounded-2xl border border-white/10 p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-electric-cyan" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Geospatial Proximity Tool
          </span>
        </div>
      </div>

      <p className="text-xs text-white/50">
        Calculate distance from your current location or major landmarks to this event.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleUseGeolocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-electric-cyan/20 border border-electric-cyan/40 text-electric-cyan text-xs font-semibold hover:bg-electric-cyan/30 transition-colors"
        >
          <Compass className={cn('w-3.5 h-3.5', isLocating && 'animate-spin')} />
          <span>{isLocating ? 'Locating...' : 'Use My Geolocation'}</span>
        </button>

        {CITY_PRESETS.map((city) => (
          <button
            key={city.name}
            onClick={() => {
              setUserLocation({ lat: city.lat, lon: city.lon, name: city.name });
              audioSynth.playClick();
            }}
            className={cn(
              'px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all',
              userLocation?.name === city.name
                ? 'bg-white/20 border-white/40 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            )}
          >
            {city.name}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {distance && userLocation && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Distance from <strong className="text-white">{userLocation.name}</strong>:</span>
            <span className="font-mono font-bold text-electric-cyan text-sm">
              {distance.km.toLocaleString()} km ({distance.miles.toLocaleString()} mi)
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
            <span className="text-white/40">Proximity Assessment:</span>
            <span className={cn('font-semibold', threatColor)}>{threatLevel}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
