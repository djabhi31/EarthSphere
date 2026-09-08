import { Dispatch, SetStateAction } from 'react';
import { Activity, Thermometer, CloudFog, Droplets, Eye } from 'lucide-react';

interface VitalSignsPanelProps {
  activeLayer: string;
  setActiveLayer: Dispatch<SetStateAction<string>>;
}

export function VitalSignsPanel({ activeLayer, setActiveLayer }: VitalSignsPanelProps) {
  
  const layers = [
    { id: 'visual', label: 'Visible Earth', icon: Eye, color: 'text-blue-400' },
    { 
      id: 'temperature', 
      label: 'Air Temperature', 
      icon: Thermometer, 
      color: 'text-red-400',
      gradient: 'from-blue-600 via-white to-red-600',
      min: '-50°C', max: '50°C'
    },
    { 
      id: 'co2', 
      label: 'Carbon Dioxide', 
      icon: CloudFog, 
      color: 'text-orange-400',
      gradient: 'from-yellow-200 via-orange-500 to-red-900',
      min: '390 ppm', max: '420 ppm'
    },
    { 
      id: 'sea-level', 
      label: 'Sea Level', 
      icon: Droplets, 
      color: 'text-cyan-400',
      gradient: 'from-blue-700 via-white to-red-700',
      min: '-15 cm', max: '+15 cm'
    },
    { 
      id: 'ozone', 
      label: 'Ozone', 
      icon: Activity, 
      color: 'text-purple-400',
      gradient: 'from-blue-500 via-green-400 to-red-500',
      min: '100 DU', max: '500 DU'
    },
  ];

  const activeLayerData = layers.find(l => l.id === activeLayer);

  return (
    <div className="flex flex-col gap-4 w-full md:w-64">
      <h3 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.3em] mb-2 border-b border-white/10 pb-2">
        Vital Signs
      </h3>
      
      <div className="flex flex-col gap-1">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className="flex items-center gap-4 px-2 py-2 text-xs transition-all duration-300 group text-left relative"
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
              )}
              <Icon size={14} className={isActive ? layer.color : 'text-white/30 group-hover:text-white/60'} />
              <span className={`font-mono uppercase tracking-widest ${isActive ? 'text-white font-bold' : 'text-white/50 group-hover:text-white/80'}`}>
                {layer.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Data Legend */}
      {activeLayerData && activeLayerData.gradient && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-500">
          <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
            <span>{activeLayerData.min}</span>
            <span>{activeLayerData.max}</span>
          </div>
          <div className={`h-[2px] w-full bg-gradient-to-r ${activeLayerData.gradient}`} />
        </div>
      )}
    </div>
  );
}
