'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAPODSingle, useAPOD } from '@/hooks/useNasaApi';
import { Calendar, Download, RefreshCw, Maximize2, X, Play, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { APODResponse } from '@/lib/types/nasa';

export default function APODPageClient() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showRandom, setShowRandom] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const { data: todayData, isLoading: isTodayLoading } = useAPODSingle(selectedDate || undefined);
  const { data: randomData, isLoading: isRandomLoading, refetch: refetchRandom } = useAPOD({ count: 6 });

  const handleRandomClick = () => {
    setShowRandom(true);
    refetchRandom();
  };

  const handleFullscreen = (url: string) => {
    setFullscreenImage(url);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenImage(null);
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-end pb-24 pt-32 px-6 lg:px-12 overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0 z-0">
          {isTodayLoading ? (
            <div className="w-full h-full bg-[var(--surface-primary)] animate-pulse" />
          ) : todayData?.media_type === 'video' ? (
            <iframe
              src={`${todayData.url}?autoplay=1&mute=1&loop=1`}
              className="w-full h-full object-cover pointer-events-none opacity-60"
              allow="autoplay; encrypted-media"
              title={todayData.title}
            />
          ) : (
            <img
              src={todayData?.hdurl || todayData?.url}
              alt={todayData?.title || 'APOD'}
              className="w-full h-full object-cover opacity-60 transition-transform duration-[2s] hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl ep-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="ep-eyebrow text-[var(--electric-cyan)]">Astronomy Picture of the Day</div>
            
            {isTodayLoading ? (
              <div className="space-y-4">
                <div className="h-12 w-2/3 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-24 w-full bg-white/10 rounded-lg animate-pulse mt-6" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                  {todayData?.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                    <Calendar className="w-4 h-4 text-[var(--electric-cyan)]" />
                    {todayData?.date}
                  </span>
                  {todayData?.copyright && (
                    <span className="glass px-3 py-1.5 rounded-full">
                      © {todayData.copyright}
                    </span>
                  )}
                  {todayData?.hdurl && (
                    <a
                      href={todayData.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Download className="w-4 h-4 text-[var(--electric-cyan)]" />
                      HD Image
                    </a>
                  )}
                  {todayData?.media_type === 'image' && (
                    <button
                      onClick={() => handleFullscreen(todayData.hdurl || todayData.url)}
                      className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4 text-[var(--electric-cyan)]" />
                      Fullscreen
                    </button>
                  )}
                </div>

                <p className="text-base md:text-lg text-gray-200 max-w-3xl leading-relaxed drop-shadow-md line-clamp-4 hover:line-clamp-none transition-all duration-300">
                  {todayData?.explanation}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="ep-section py-8 border-b border-[var(--border-default)]">
        <div className="ep-container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <label htmlFor="date-picker" className="sr-only">Select Date</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="date-picker"
                type="date"
                min="1995-06-20"
                max={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowRandom(false);
                }}
                className="block w-full pl-10 pr-4 py-3 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-white focus:ring-2 focus:ring-[var(--electric-cyan)] focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
          
          <button
            onClick={handleRandomClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isRandomLoading && showRandom}
          >
            <RefreshCw className={cn("w-5 h-5", isRandomLoading && showRandom && "animate-spin")} />
            Random Discovery
          </button>
        </div>
      </section>

      {/* Random Gallery */}
      {showRandom && (
        <section className="ep-section py-16">
          <div className="ep-container">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-gradient">Cosmic Gallery</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isRandomLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-4 h-[400px] flex flex-col gap-4">
                      <div className="flex-1 bg-white/5 rounded-xl animate-pulse" />
                      <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
                      <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
                    </div>
                  ))
                ) : (
                  Array.isArray(randomData) && randomData.map((item: APODResponse, index: number) => (
                    <motion.div
                      key={item.date + index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-strong rounded-2xl overflow-hidden border border-[var(--border-default)] group flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {item.media_type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--surface-primary)]">
                            <Play className="w-12 h-12 text-white/50" />
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          {item.media_type === 'image' && (
                            <button
                              onClick={() => handleFullscreen(item.hdurl || item.url)}
                              className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                              <Maximize2 className="w-6 h-6" />
                            </button>
                          )}
                        </div>
                        <div className="absolute top-4 left-4 glass px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                          {item.media_type === 'video' ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                          {item.date}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-3 mt-auto">{item.explanation}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

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
            alt="Fullscreen APOD"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </motion.div>
      )}
    </main>
  );
}
