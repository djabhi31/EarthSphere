'use client';

import { Dispatch, SetStateAction } from 'react';
import { Activity, Thermometer, CloudFog, Droplets, Eye, ArrowUpRight } from 'lucide-react';

interface VitalSignsPanelProps {
  activeLayer: string;
  setActiveLayer: Dispatch<SetStateAction<string>>;
}

const layers = [
  { id: 'visual', label: 'Visible Earth', icon: Eye, note: 'NASA Blue Marble reference imagery.' },
  { id: 'temperature', label: 'Air temperature', icon: Thermometer, legend: 'AIRS_Surface_Air_Temperature_Daily_Day_H.png', note: 'Latest available AIRS daily composite.' },
  { id: 'co2', label: 'CO₂ difference', icon: CloudFog, legend: 'OCO_Carbon_Dioxide_Global_Mean_Difference_H.png', note: 'Difference from the global mean, from OCO-2. Coverage is incomplete.' },
  { id: 'sea-level', label: 'Sea level archive', icon: Droplets, legend: 'MEaSUREs_Sea_Surface_Height_Anomalies_H.png', note: 'Archived sea surface height anomalies. This collection ends in January 2019.' },
  { id: 'ozone', label: 'Ozone', icon: Activity, legend: 'OMPS_Ozone_Total_Column_H.png', note: 'Latest available OMPS total-column ozone.' },
];

export function VitalSignsPanel({ activeLayer, setActiveLayer }: VitalSignsPanelProps) {
  const active = layers.find(layer => layer.id === activeLayer);
  return <div className="es-layer-panel">
    <h3>Earth observation layers</h3>
    <div className="es-layer-options">{layers.map(layer => <button key={layer.id} aria-pressed={activeLayer === layer.id} onClick={() => setActiveLayer(layer.id)}><layer.icon size={15} /><span>{layer.label}</span></button>)}</div>
    {active && <div className="es-layer-caption">
      {active.legend && <a href={`https://gibs.earthdata.nasa.gov/legends/${active.legend}`} target="_blank" rel="noopener noreferrer">NASA color legend <ArrowUpRight size={11} /></a>}
      <p>{active.note}</p><p>Imagery is independent of the orbit simulation time.</p>
    </div>}
  </div>;
}
