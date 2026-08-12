"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Image as ImageIcon, Video, Mic, MapPin, X, Loader2, Play, Calendar } from 'lucide-react';
import { useNASAMedia } from '@/hooks/useNasaApi';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type MediaType = 'image' | 'video' | 'audio' | '';

export default function MediaPageClient() {
  const [searchTerm, setSearchTerm] = useState('galaxy');
  const [searchInput, setSearchInput] = useState('galaxy');
  const [mediaType, setMediaType] = useState<MediaType>('');
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const { data, isLoading, error } = useNASAMedia({
    q: searchTerm,
    media_type: mediaType || undefined,
    page: page,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  const mediaItems = data?.collection?.items || [];
  const totalHits = data?.collection?.metadata?.total_hits || 0;

  return (
    <div className="ep-container py-12 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">NASA Media Library</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Explore the vast archives of NASA's image, video, and audio library.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-4 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input
              type="text"
              placeholder="Search galaxies, missions, astronauts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full glass-subtle rounded-full py-4 pl-12 pr-6 border border-[var(--border-default)] focus:border-[var(--electric-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--electric-cyan)] transition-all bg-transparent text-[var(--text-primary)]"
            />
          </div>
          <button 
            type="submit" 
            className="glass hover:bg-[var(--surface-primary)] px-8 py-4 rounded-full font-medium border border-[var(--border-default)] transition-all flex items-center justify-center whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {[
            { id: '', label: 'All', icon: null },
            { id: 'image', label: 'Images', icon: ImageIcon },
            { id: 'video', label: 'Videos', icon: Video },
            { id: 'audio', label: 'Audio', icon: Mic },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setMediaType(type.id as MediaType);
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-sm font-medium",
                mediaType === type.id 
                  ? "bg-[var(--electric-cyan)]/20 border-[var(--electric-cyan)] text-[var(--electric-cyan)]"
                  : "glass-subtle border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              )}
            >
              {type.icon && <type.icon className="w-4 h-4" />}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Results for "{searchTerm}"</h2>
        <span className="text-[var(--text-muted)] text-sm">{totalHits.toLocaleString()} found</span>
      </div>

      {isLoading && page === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass rounded-2xl h-80 animate-pulse border border-[var(--border-default)]"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">Failed to load media. Please try again.</div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">No results found for your search.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {mediaItems.map((item: any, i: number) => {
              const data = item.data[0];
              const previewLink = item.links?.find((l: any) => l.rel === 'preview')?.href;
              const isVideo = data.media_type === 'video';
              const isAudio = data.media_type === 'audio';
              
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={data.nasa_id}
                  className="glass rounded-2xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--electric-cyan)] transition-all cursor-pointer group flex flex-col"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-video bg-[var(--surface-primary)] overflow-hidden">
                    {previewLink ? (
                      <img 
                        src={previewLink} 
                        alt={data.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                        {isAudio ? <Mic className="w-12 h-12" /> : <ImageIcon className="w-12 h-12" />}
                      </div>
                    )}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="bg-[var(--electric-cyan)]/80 text-black p-3 rounded-full backdrop-blur-sm">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md uppercase tracking-wider font-semibold border border-white/10">
                        {data.media_type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-[var(--electric-cyan)] transition-colors">
                      {data.title}
                    </h3>
                    <div className="mt-auto flex justify-between items-center text-xs text-[var(--text-muted)]">
                      <span>{data.date_created ? format(new Date(data.date_created), 'MMM d, yyyy') : 'Unknown Date'}</span>
                      {data.center && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {data.center}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {mediaItems.length < totalHits && (
            <div className="flex justify-center">
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="glass hover:bg-[var(--surface-primary)] px-8 py-3 rounded-full font-medium border border-[var(--border-default)] transition-all flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-strong w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-[var(--border-default)] flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black p-2 rounded-full transition-colors text-white"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
                {selectedItem.data[0].media_type === 'video' ? (
                  // For video, we'd ideally fetch the collection to get the .mp4, but for now show preview + message
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <img 
                      src={selectedItem.links?.find((l: any) => l.rel === 'preview')?.href} 
                      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                      alt=""
                    />
                    <Video className="w-16 h-16 text-white mb-4 z-10" />
                    <p className="text-white z-10">Video playback requires fetching the manifest.</p>
                  </div>
                ) : (
                  <img 
                    src={selectedItem.links?.find((l: any) => l.rel === 'preview')?.href} 
                    alt={selectedItem.data[0].title}
                    className="w-full h-full object-contain max-h-[60vh] md:max-h-[90vh]"
                  />
                )}
              </div>
              
              <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[90vh] flex flex-col">
                <div className="flex gap-2 mb-3">
                  <span className="bg-[var(--surface-primary)] text-[var(--electric-cyan)] text-xs px-2 py-1 rounded-md uppercase font-semibold">
                    {selectedItem.data[0].media_type}
                  </span>
                  {selectedItem.data[0].center && (
                    <span className="bg-[var(--surface-primary)] text-[var(--text-secondary)] text-xs px-2 py-1 rounded-md">
                      {selectedItem.data[0].center}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{selectedItem.data[0].title}</h2>
                
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-6 pb-6 border-b border-[var(--border-default)]">
                  {selectedItem.data[0].date_created && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(selectedItem.data[0].date_created), 'MMMM d, yyyy')}
                    </div>
                  )}
                  {selectedItem.data[0].photographer && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {selectedItem.data[0].photographer}
                    </div>
                  )}
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)] mb-6">
                  {selectedItem.data[0].description}
                </div>
                
                {selectedItem.data[0].keywords && (
                  <div className="mt-auto pt-6">
                    <h4 className="text-xs font-semibold uppercase text-[var(--text-muted)] mb-3">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.data[0].keywords.slice(0, 10).map((kw: string) => (
                        <span key={kw} className="bg-[var(--surface-primary)] border border-[var(--border-default)] px-3 py-1 rounded-full text-xs text-[var(--text-secondary)]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
