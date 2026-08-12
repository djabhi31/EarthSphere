'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMarsLatestPhotos, useMarsPhotos, useRoverManifest } from '@/hooks/useNasaApi';
import type { MarsRoverName, MarsRoverCamera, MarsRoverPhoto } from '@/lib/types/nasa';
import { cn } from '@/lib/utils';
import { Calendar, Camera, Info, Rocket, Maximize2, X, ChevronLeft, ChevronRight, Activity, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ROVERS: { id: MarsRoverName; name: string }[] = [
  { id: 'perseverance', name: 'Perseverance' },
  { id: 'curiosity', name: 'Curiosity' },
  { id: 'opportunity', name: 'Opportunity' },
  { id: 'spirit', name: 'Spirit' },
];

const CAMERAS = [
  { id: 'all', name: 'All Cameras' },
  { id: 'FHAZ', name: 'Front Hazard Avoidance' },
  { id: 'RHAZ', name: 'Rear Hazard Avoidance' },
  { id: 'MAST', name: 'Mast Camera' },
  { id: 'CHEMCAM', name: 'Chemistry and Camera' },
  { id: 'MAHLI', name: 'Mars Hand Lens Imager' },
  { id: 'MARDI', name: 'Mars Descent Imager' },
  { id: 'NAVCAM', name: 'Navigation Camera' },
  { id: 'PANCAM', name: 'Panoramic Camera' },
  { id: 'MINITES', name: 'Miniature Thermal Emission' },
];

export default function MarsPageClient() {
  const [activeRover, setActiveRover] = useState<MarsRoverName>('perseverance');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');
  const [solNumber, setSolNumber] = useState<string>('');
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const { data: manifest, isLoading: isManifestLoading } = useRoverManifest(activeRover);
  
  // Decide whether to fetch latest or specific params
  const isLatest = selectedCamera === 'all' && solNumber === '';
  
  const { 
    data: latestData, 
    isLoading: isLatestLoading 
  } = useMarsLatestPhotos(activeRover);

  const params = {
    ...(solNumber ? { sol: parseInt(solNumber, 10) } : { sol: manifest?.photo_manifest.max_sol || 1000 }),
    ...(selectedCamera !== 'all' ? { camera: selectedCamera } : {}),
  };
  
  const { 
    data: specificData, 
    isLoading: isSpecificLoading 
  } = useMarsPhotos(activeRover, params);

  const isLoading = isLatest ? isLatestLoading : isSpecificLoading;
  
  // Choose which photos to display
  let photos = isLatest ? (latestData?.latest_photos || []) : (specificData?.photos || []);
  
  const openLightbox = (index: number) => setSelectedPhotoIndex(index);
  const closeLightbox = () => setSelectedPhotoIndex(null);
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 ep-container">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ep-eyebrow justify-center text-[var(--solar-orange)]"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Mars Exploration Program
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--solar-orange)] to-[var(--cosmic-purple)]"
        >
          Rover Photo Explorer
        </motion.h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-2xl p-6 border border-[var(--border-default)]">
            <h2 className="text-xl font-semibold mb-4">Select Rover</h2>
            <div className="flex flex-col space-y-2">
              {ROVERS.map((rover) => (
                <button
                  key={rover.id}
                  onClick={() => {
                    setActiveRover(rover.id);
                    setSolNumber('');
                  }}
                  className={cn(
                    "px-4 py-3 rounded-lg text-left transition-all duration-300 font-medium",
                    activeRover === rover.id 
                      ? "bg-[var(--solar-orange)]/20 text-[var(--solar-orange)] border border-[var(--solar-orange)]/50" 
                      : "hover:bg-white/5 border border-transparent text-[var(--text-secondary)]"
                  )}
                >
                  {rover.name}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-[var(--border-default)] space-y-5">
            <h2 className="text-xl font-semibold">Filters</h2>
            
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <Camera className="w-4 h-4" /> Camera
              </label>
              <select 
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full bg-black/50 border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--solar-orange)]"
              >
                {CAMERAS.map(cam => (
                  <option key={cam.id} value={cam.id}>{cam.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Martian Sol
              </label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={solNumber}
                  onChange={(e) => setSolNumber(e.target.value)}
                  placeholder={`Max: ${manifest?.photo_manifest.max_sol || '...'}`}
                  className="w-full bg-black/50 border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--solar-orange)]"
                />
              </div>
            </div>
          </div>

          {/* Mission Stats */}
          {manifest && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6 border border-[var(--border-default)]"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--solar-orange)]" />
                Mission Status
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Status</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    manifest.photo_manifest.status === 'active' ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  )}>
                    {manifest.photo_manifest.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Total Photos</span>
                  <span className="font-mono">{manifest.photo_manifest.total_photos.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Launch Date</span>
                  <span>{manifest.photo_manifest.launch_date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Landing Date</span>
                  <span>{manifest.photo_manifest.landing_date}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Gallery */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} className="h-64 rounded-xl w-full" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center glass rounded-2xl border border-[var(--border-default)]">
              <Info className="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)] text-lg">No photos found for these filters.</p>
              <p className="text-sm text-[var(--text-muted)]">Try a different camera or sol number.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <div 
                    onClick={() => openLightbox(index)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-black/40 border border-[var(--border-default)] hover:border-[var(--solar-orange)]/50 transition-all duration-500"
                  >
                    <img 
                      src={photo.img_src} 
                      alt={`Mars ${photo.rover.name} - ${photo.camera.name}`} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-semibold text-white truncate max-w-[150px]">{photo.camera.full_name}</p>
                          <p className="text-xs text-gray-300">Sol {photo.sol} • {photo.earth_date}</p>
                        </div>
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full max-w-6xl max-h-full flex items-center justify-center">
              {/* Prev */}
              <button 
                onClick={handlePrev}
                disabled={selectedPhotoIndex === 0}
                className="absolute left-2 md:left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white disabled:opacity-30 transition-colors z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.img 
                key={photos[selectedPhotoIndex].id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={photos[selectedPhotoIndex].img_src}
                alt={`Mars ${photos[selectedPhotoIndex].rover.name}`}
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Next */}
              <button 
                onClick={handleNext}
                disabled={selectedPhotoIndex === photos.length - 1}
                className="absolute right-2 md:right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white disabled:opacity-30 transition-colors z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white text-center w-[90%] md:w-auto min-w-[300px]"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="font-semibold">{photos[selectedPhotoIndex].camera.full_name}</p>
                <p className="text-sm text-gray-300">
                  {photos[selectedPhotoIndex].rover.name} Rover • Sol {photos[selectedPhotoIndex].sol} • {photos[selectedPhotoIndex].earth_date}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
