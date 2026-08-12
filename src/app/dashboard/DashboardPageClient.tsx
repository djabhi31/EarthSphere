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

function WidgetCard({ title, icon: Icon, href, children, loading, className }: { 
  title: string; 
  icon: React.ElementType; 
  href: string; 
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn(
          "glass rounded-2xl p-6 border border-[var(--border-default)] h-full flex flex-col transition-colors hover:border-[var(--electric-cyan)] group relative overflow-hidden",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] group-hover:text-[var(--electric-cyan)] transition-colors">
            <Icon size={20} />
            <h3 className="font-semibold tracking-wide text-sm uppercase">{title}</h3>
          </div>
          <ArrowRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--electric-cyan)] transition-all transform group-hover:translate-x-1" />
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
    <div className="ep-container pb-20">
      <div className="ep-section pt-24 md:pt-32 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="ep-eyebrow mb-4">Command Center</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--cosmic-purple)]">Mission Control</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl">
            Welcome back, Commander. Here is your real-time overview of the cosmos for {format(new Date(), 'MMMM do, yyyy')}.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* APOD Widget */}
        <WidgetCard 
          title="Picture of the Day" 
          icon={ImageIcon} 
          href="/apod" 
          loading={apodLoading}
          className="md:col-span-2 xl:col-span-1"
        >
          {apod && (
            <div className="relative w-full h-48 md:h-64 xl:h-48 rounded-xl overflow-hidden mb-3">
              {apod.media_type === 'image' ? (
                <Image 
                  src={apod.url} 
                  alt={apod.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-black/50 flex items-center justify-center text-white/50">
                  Video Content
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <p className="text-white font-medium line-clamp-1">{apod.title}</p>
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
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-1">
                {todayCount}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Objects tracking near Earth this week
              </div>
            </div>
            
            {closestNeo && (
              <div className="glass-subtle p-3 rounded-lg border border-orange-500/20">
                <div className="text-xs text-orange-400 mb-1 font-semibold uppercase tracking-wider">Closest Approach</div>
                <div className="font-mono text-sm">{closestNeo.name}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Distance: {minDistance.toFixed(2)} Lunar Distances
                </div>
                {closestNeo.is_potentially_hazardous_asteroid && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                    <ShieldAlert size={12} />
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
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 mb-1">
                {flares?.length || 0}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Solar Flares reported recently
              </div>
            </div>

            {latestFlare ? (
              <div className="glass-subtle p-3 rounded-lg border border-yellow-500/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Latest Flare</div>
                  <div className="font-mono font-bold text-yellow-300">{latestFlare.classType}</div>
                </div>
                <div className="text-xs text-[var(--text-secondary)] truncate">
                  Region {latestFlare.activeRegionNum || 'Unknown'}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] mt-1">
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
            <div className="relative w-full h-48 md:h-64 xl:h-48 rounded-xl overflow-hidden bg-black flex items-center justify-center group-hover:border-[var(--electric-cyan)] transition-colors">
              <Image 
                src={`https://epic.gsfc.nasa.gov/archive/natural/${epicImage.date.split(' ')[0].replace(/-/g, '/')}/png/${epicImage.image}.png`}
                alt="Earth"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                <div className="text-xs text-white/80 text-center font-mono">
                  {format(new Date(epicImage.date), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-white/5 rounded-xl flex items-center justify-center text-white/30">
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
            <div className="relative w-full h-48 md:h-64 xl:h-48 rounded-xl overflow-hidden group-hover:border-[var(--rust-orange)] transition-colors">
              <Image 
                src={marsPhoto.img_src}
                alt="Mars Surface"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <div>
                  <div className="text-white text-sm font-medium">{marsPhoto.rover.name}</div>
                  <div className="text-white/70 text-xs font-mono">Sol {marsPhoto.sol} • {marsPhoto.camera.name}</div>
                </div>
              </div>
            </div>
          ) : (
             <div className="w-full h-48 bg-white/5 rounded-xl flex items-center justify-center text-white/30">
              No image available
            </div>
          )}
        </WidgetCard>

        {/* Quick Links */}
        <div className="glass rounded-2xl p-6 border border-[var(--border-default)]">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-4">
            <Rocket size={20} />
            <h3 className="font-semibold tracking-wide text-sm uppercase">Quick Launch</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 h-[calc(100%-2rem)]">
             <Link href="/satellites" className="glass-subtle rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-transparent hover:border-[var(--ice-blue)] group">
               <Activity className="text-[var(--text-secondary)] group-hover:text-[var(--ice-blue)]" size={24} />
               <span className="text-xs font-medium text-center">Satellites</span>
             </Link>
             <Link href="/techport" className="glass-subtle rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-transparent hover:border-[var(--aurora-mint)] group">
               <Rocket className="text-[var(--text-secondary)] group-hover:text-[var(--aurora-mint)]" size={24} />
               <span className="text-xs font-medium text-center">Techport</span>
             </Link>
             <Link href="/earth" className="glass-subtle rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-transparent hover:border-emerald-400 group">
               <Globe className="text-[var(--text-secondary)] group-hover:text-emerald-400" size={24} />
               <span className="text-xs font-medium text-center">Earth Imager</span>
             </Link>
             <Link href="/exoplanets" className="glass-subtle rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-transparent hover:border-purple-400 group">
               <Globe className="text-[var(--text-secondary)] group-hover:text-purple-400" size={24} />
               <span className="text-xs font-medium text-center">Exoplanets</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
