'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useEPIC } from '@/hooks/useNasaApi';
import { getEPICImageUrl } from '@/lib/nasa-api';
import { Play, Pause, Maximize2, X, Compass, Sun, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EPICImageType } from '@/lib/types/nasa';

export default function EPICPageClient() {
  const [imageType, setImageType] = useState<EPICImageType>('natural');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const { data: epicImages, isLoading } = useEPIC(imageType);

  // Auto-play timelapse
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && epicImages && epicImages.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % epicImages.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, epicImages]);

  // Reset index when changing image type or images load
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [imageType, epicImages?.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleFullscreen = (url: string) => {
    setFullscreenImage(url);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenImage(null);
  };

  const latestImage = epicImages?.[currentIndex];
  const latestImageUrl = latestImage ? getEPICImageUrl(imageType, latestImage.date.split(' ')[0], latestImage.image) : null;

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden bg-[var(--background)]">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05),transparent_50%)]" />
        
        {/* Main Earth Viewer */}
        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Earth Image Container */}
          <div className="relative w-full lg:w-1/2 aspect-square max-w-[600px] flex items-center justify-center">
            {isLoading ? (
              <div className="w-full h-full rounded-full bg-white/5 border border-white/10 animate-pulse flex items-center justify-center shadow-[0_0_100px_rgba(0,240,255,0.1)]">
                <ImageIcon className="w-12 h-12 text-white/20" />
              </div>
            ) : latestImageUrl ? (
              <motion.div
                key={latestImageUrl}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full rounded-full shadow-[0_0_100px_rgba(0,240,255,0.15)] group"
              >
                <img
                  src={latestImageUrl}
                  alt="Earth from EPIC"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  loading="eager"
                />
                <button
                  onClick={() => handleFullscreen(latestImageUrl)}
                  className="absolute bottom-6 right-6 p-4 glass rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-white/50">
                No images available
              </div>
            )}
          </div>

          {/* Controls & Metadata */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="ep-eyebrow text-[var(--electric-cyan)]">DSCOVR Satellite</div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                Earth from <span className="text-gradient">Deep Space</span>
              </h1>
              <p className="text-gray-400 text-lg">
                View our home planet from 1 million miles away. Images are taken by NASA's Earth Polychromatic Imaging Camera (EPIC).
              </p>
            </motion.div>

            {/* Controls */}
            <div className="glass-strong p-6 rounded-2xl border border-[var(--border-default)] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                  <button
                    onClick={() => setImageType('natural')}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                      imageType === 'natural' ? "bg-[var(--electric-cyan)] text-black" : "text-gray-400 hover:text-white"
                    )}
                  >
                    Natural Color
                  </button>
                  <button
                    onClick={() => setImageType('enhanced')}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                      imageType === 'enhanced' ? "bg-[var(--electric-cyan)] text-black" : "text-gray-400 hover:text-white"
                    )}
                  >
                    Enhanced Color
                  </button>
                </div>

                <button
                  onClick={togglePlay}
                  disabled={isLoading || !epicImages?.length}
                  className="p-3 rounded-xl bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)] text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span className="hidden sm:inline font-medium">{isPlaying ? 'Pause' : 'Timelapse'}</span>
                </button>
              </div>

              {/* Progress Bar for Timelapse */}
              {epicImages && epicImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Frame {currentIndex + 1} of {epicImages.length}</span>
                    <span>{epicImages[currentIndex]?.date}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--electric-cyan)] transition-all duration-300 ease-linear"
                      style={{ width: `${((currentIndex + 1) / epicImages.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Image Metadata */}
            {latestImage && (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl border border-[var(--border-default)]">
                  <div className="flex items-center gap-2 text-[var(--electric-cyan)] mb-2">
                    <MapIcon className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Centroid</span>
                  </div>
                  <div className="text-sm text-gray-300 font-mono">
                    Lat: {latestImage.centroid_coordinates.lat.toFixed(4)}°<br />
                    Lon: {latestImage.centroid_coordinates.lon.toFixed(4)}°
                  </div>
                </div>
                <div className="glass p-4 rounded-xl border border-[var(--border-default)]">
                  <div className="flex items-center gap-2 text-[var(--electric-cyan)] mb-2">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Sun Position</span>
                  </div>
                  <div className="text-sm text-gray-300 font-mono">
                    X: {latestImage.sun_j2000_position.x.toFixed(0)}<br />
                    Y: {latestImage.sun_j2000_position.y.toFixed(0)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="ep-section py-16 border-t border-[var(--border-default)]">
        <div className="ep-container">
          <div className="flex items-center gap-3 mb-8">
            <Compass className="w-6 h-6 text-[var(--electric-cyan)]" />
            <h2 className="text-3xl font-bold text-white">Daily Sequence</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="glass rounded-xl aspect-square animate-pulse flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/10" />
                </div>
              ))
            ) : (
              epicImages?.map((image, idx) => {
                const imgUrl = getEPICImageUrl(imageType, image.date.split(' ')[0], image.image);
                const isSelected = idx === currentIndex;
                
                return (
                  <motion.div
                    key={image.identifier}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={cn(
                      "relative aspect-square glass rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300",
                      isSelected ? "border-[var(--electric-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.2)]" : "border-transparent hover:border-white/20"
                    )}
                  >
                    <img
                      src={imgUrl}
                      alt={`Earth at ${image.date}`}
                      className="w-full h-full object-cover scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                      <p className="text-xs text-white/90 font-medium text-center">
                        {image.date.split(' ')[1]}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {isFullscreen && fullscreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 p-3 glass rounded-full text-white hover:bg-white/10 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen Earth"
            className="max-w-[90vw] max-h-[90vh] object-contain drop-shadow-[0_0_100px_rgba(0,240,255,0.2)]"
          />
        </motion.div>
      )}
    </main>
  );
}
