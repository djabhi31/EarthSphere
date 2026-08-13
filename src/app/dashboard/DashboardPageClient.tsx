'use client';

import { useAPODSingle, useNeoFeed, useDONKISolarFlares, useEPIC, useMarsLatestPhotos } from '@/hooks/useNasaApi';
import { format, addDays } from 'date-fns';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Image as ImageIcon, 
  Activity, 
  Globe, 
  Camera, 
  ArrowRight,
  ShieldAlert,
  Sun
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { audioSynth } from '@/lib/audio';
import { staggerContainer, staggerItem, scaleIn } from '@/lib/motion-presets';

function WidgetCard({ title, icon: Icon, href, children, loading, className }: { 
  title: string; 
  icon: React.ElementType; 
  href: string; 
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Link 
      href={href}
      onMouseEnter={() => audioSynth.playHover()}
      onClick={() => audioSynth.playClick()}
      className="group block h-full"
    >
      <motion.div 
        variants={scaleIn}
        className={cn(
          "glass-strong rounded-[2rem] p-6 border border-[var(--border-subtle)] h-full flex flex-col transition-all duration-500 hover:border-[var(--electric-cyan)] hover:shadow-glow-cyan relative overflow-hidden",
          className
        )}
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-[var(--electric-cyan)] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2.5 text-[var(--text-secondary)] group-hover:text-[var(--electric-cyan)] transition-colors duration-300">
            <div className="p-1.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] group-hover:border-[var(--electric-cyan)]/30 group-hover:bg-[var(--electric-cyan)]/10 transition-colors duration-300">
              <Icon size={18} />
            </div>
            <h3 className="font-bold tracking-wide text-sm uppercase">{title}</h3>
          </div>
          <ArrowRight size={18} className="text-[var(--text-tertiary)] group-hover:text-[var(--electric-cyan)] transition-all transform group-hover:translate-x-1" />
        </div>
        
        <div className="flex-1 relative z-10 flex flex-col">
          {loading ? (
            <div className="animate-pulse space-y-3 flex-1 flex flex-col justify-center">
              <div className="h-4 bg-white/5 rounded w-3/4"></div>
              <div className="h-4 bg-white/5 rounded w-1/2"></div>
              <div className="h-12 bg-white/5 rounded w-full mt-2"></div>
            </div>
          ) : children}
        </div>
      </motion.div>
    </Link>
  );
}

export default function DashboardPageClient() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  
  const { data: apod, isLoading: apodLoading } = useAPODSingle(today);
  const { data: neo, isLoading: neoLoading } = useNeoFeed(today, nextWeek);
  const { data: flares, isLoading: flaresLoading } = useDONKISolarFlares(
    format(addDays(new Date(), -30), 'yyyy-MM-dd'), 
    today
  );
  const { data: epic, isLoading: epicLoading } = useEPIC('natural');
  const { data: mars, isLoading: marsLoading } = useMarsLatestPhotos('curiosity');

  const todayCount = neo?.element_count || 0;
  
  // Calculate closest approach
  let closestNeo: any = null;
  let minDistance = Infinity;
  
  if (neo?.near_earth_objects) {
    Object.values(neo.near_earth_objects).flat().forEach(obj => {
      const distStr = obj.close_approach_data?.[0]?.miss_distance?.lunar;
      if (distStr) {
        const dist = parseFloat(distStr);
        if (dist < minDistance) {
          minDistance = dist;
          closestNeo = obj;
        }
      }
    });
  }

  const latestFlare = flares?.[flares.length - 1];
  const epicImage = epic?.[0];
  const marsPhoto = mars?.latest_photos?.[0];

  return (
    <div className="min-h-screen bg-[var(--canvas)] pb-20 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--electric-cyan)]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-28 md:pt-36 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric-cyan)] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
              Command Center
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Unified <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">Mission Control</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl font-medium">
              Welcome back, Commander. Here is your real-time overview of the cosmos for {format(new Date(), 'MMMM do, yyyy')}.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
        >
          {/* APOD Widget */}
          <WidgetCard 
            title="Picture of the Day" 
            icon={ImageIcon} 
            href="/apod" 
            loading={apodLoading}
            className="md:col-span-2 xl:col-span-1"
          >
            {apod && (
              <div className="relative w-full h-48 md:h-64 xl:h-48 rounded-[1.5rem] overflow-hidden mb-3 border border-[var(--border-subtle)] shadow-inner">
                {apod.media_type === 'image' ? (
                  <Image 
                    src={apod.url} 
                    alt={apod.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-black/50 flex items-center justify-center text-white/50">
                    Video Content
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/90 via-[#0a0e17]/20 to-transparent flex items-end p-5">
                  <p className="text-white font-bold line-clamp-2">{apod.title}</p>
                </div>
              </div>
            )}
          </WidgetCard>

          {/* NEO Widget */}
          <WidgetCard 
            title="Asteroid Watch" 
            icon={ShieldAlert} 
            href="/asteroids" 
            loading={neoLoading}
          >
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600 mb-2 drop-shadow-md">
                  {todayCount}
                </div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">
                  Objects tracking near Earth this week
                </div>
              </div>
              
              {closestNeo && (
                <div className="glass-subtle p-4 rounded-2xl border border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                  <div className="text-[10px] text-orange-400 mb-1.5 font-black uppercase tracking-wider">Closest Approach</div>
                  <div className="font-mono text-sm font-bold">{closestNeo.name}</div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-1">
                    Distance: <span className="text-white">{minDistance.toFixed(2)}</span> Lunar Distances
                  </div>
                  {closestNeo.is_potentially_hazardous_asteroid && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md border border-red-500/20">
                      <ShieldAlert size={14} />
                      Potentially Hazardous
                    </div>
                  )}
                </div>
              )}
            </div>
          </WidgetCard>

          {/* Space Weather Widget */}
          <WidgetCard 
            title="Space Weather" 
            icon={Sun} 
            href="/space-weather" 
            loading={flaresLoading}
          >
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-orange-500 mb-2 drop-shadow-md">
                  {flares?.length || 0}
                </div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">
                  Solar Flares reported recently
                </div>
              </div>

              {latestFlare ? (
                <div className="glass-subtle p-4 rounded-2xl border border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] text-yellow-400 font-black uppercase tracking-wider">Latest Flare</div>
                    <div className="font-mono font-bold text-yellow-300 text-sm bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-500/20">{latestFlare.classType}</div>
                  </div>
                  <div className="text-sm font-medium text-[var(--text-secondary)] truncate">
                    Region <span className="text-white">{latestFlare.activeRegionNum || 'Unknown'}</span>
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-1.5 font-mono">
                    {format(new Date(latestFlare.beginTime), 'MMM d, HH:mm')}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[var(--text-secondary)] italic">
                  No significant flares recently.
                </div>
              )}
            </div>
          </WidgetCard>

          {/* EPIC Earth Widget */}
          <WidgetCard 
            title="EPIC Earth" 
            icon={Globe} 
            href="/epic" 
            loading={epicLoading}
          >
            {epicImage ? (
              <div className="relative w-full h-48 md:h-64 xl:h-48 rounded-[1.5rem] overflow-hidden bg-[#050810] flex items-center justify-center border border-[var(--border-subtle)] group-hover:border-[var(--electric-cyan)]/50 transition-colors shadow-inner">
                <Image 
                  src={`https://epic.gsfc.nasa.gov/archive/natural/${epicImage.date.split(' ')[0].replace(/-/g, '/')}/png/${epicImage.image}.png`}
                  alt="Earth"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#050810] to-transparent">
                  <div className="text-xs text-white/90 text-center font-mono font-bold">
                    {format(new Date(epicImage.date), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/30 font-medium">
                No image available
              </div>
            )}
          </WidgetCard>

          {/* Mars Widget */}
          <WidgetCard 
            title="Latest from Mars" 
            icon={Camera} 
            href="/mars" 
            loading={marsLoading}
          >
            {marsPhoto ? (
              <div className="relative w-full h-48 md:h-64 xl:h-48 rounded-[1.5rem] overflow-hidden border border-[var(--border-subtle)] group-hover:border-rose-500/50 transition-colors shadow-inner">
                <Image 
                  src={marsPhoto.img_src}
                  alt="Mars Surface"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/90 via-transparent to-transparent flex items-end p-5">
                  <div>
                    <div className="text-white text-sm font-bold mb-0.5">{marsPhoto.rover.name}</div>
                    <div className="text-white/70 text-xs font-mono font-medium">Sol {marsPhoto.sol} • {marsPhoto.camera.name}</div>
                  </div>
                </div>
              </div>
            ) : (
               <div className="w-full h-48 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/30 font-medium">
                No image available
              </div>
            )}
          </WidgetCard>

          {/* Quick Links (Re-styled as Premium Grid) */}
          <motion.div variants={scaleIn} className="glass-strong rounded-[2rem] p-6 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5 text-[var(--text-secondary)] mb-6">
              <div className="p-1.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                <Rocket size={18} />
              </div>
              <h3 className="font-bold tracking-wide text-sm uppercase">Quick Launch</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)]">
               <Link 
                 href="/satellites" 
                 onMouseEnter={() => audioSynth.playHover()}
                 onClick={() => audioSynth.playClick()}
                 className="glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-[var(--surface-primary)] transition-all duration-300 border border-[var(--border-subtle)] hover:border-[var(--ice-blue)] group/ql hover:shadow-[0_0_20px_rgba(186,230,253,0.1)]"
               >
                 <Activity className="text-[var(--text-secondary)] group-hover/ql:text-[var(--ice-blue)] group-hover/ql:scale-110 transition-all" size={26} />
                 <span className="text-xs font-bold text-[var(--text-primary)]">Satellites</span>
               </Link>
               <Link 
                 href="/techport" 
                 onMouseEnter={() => audioSynth.playHover()}
                 onClick={() => audioSynth.playClick()}
                 className="glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-[var(--surface-primary)] transition-all duration-300 border border-[var(--border-subtle)] hover:border-[var(--aurora-mint)] group/ql hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
               >
                 <Rocket className="text-[var(--text-secondary)] group-hover/ql:text-[var(--aurora-mint)] group-hover/ql:scale-110 transition-all" size={26} />
                 <span className="text-xs font-bold text-[var(--text-primary)]">Techport</span>
               </Link>
               <Link 
                 href="/earth-imagery" 
                 onMouseEnter={() => audioSynth.playHover()}
                 onClick={() => audioSynth.playClick()}
                 className="glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-[var(--surface-primary)] transition-all duration-300 border border-[var(--border-subtle)] hover:border-emerald-400 group/ql hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]"
               >
                 <Globe className="text-[var(--text-secondary)] group-hover/ql:text-emerald-400 group-hover/ql:scale-110 transition-all" size={26} />
                 <span className="text-xs font-bold text-[var(--text-primary)]">Earth Imager</span>
               </Link>
               <Link 
                 href="/exoplanets" 
                 onMouseEnter={() => audioSynth.playHover()}
                 onClick={() => audioSynth.playClick()}
                 className="glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-[var(--surface-primary)] transition-all duration-300 border border-[var(--border-subtle)] hover:border-purple-400 group/ql hover:shadow-[0_0_20px_rgba(192,132,252,0.1)]"
               >
                 <Globe className="text-[var(--text-secondary)] group-hover/ql:text-purple-400 group-hover/ql:scale-110 transition-all" size={26} />
                 <span className="text-xs font-bold text-[var(--text-primary)]">Exoplanets</span>
               </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
