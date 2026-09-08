/**
 * NASA GIBS (Global Imagery Browse Services) Utility
 * Fetches WMS equirectangular maps for Three.js texture mapping.
 */

export const GIBS_LAYERS = {
  visual: 'MODIS_Terra_CorrectedReflectance_TrueColor',
  temperature: 'AIRS_L3_Surface_Air_Temperature_Daily_Day',
  co2: 'OCO-2_Carbon_Dioxide_Global_Mean_Difference',
  'sea-level': 'JPL_MEaSUREs_L4_Sea_Surface_Height_Anomalies', 
  ozone: 'OMPS_Ozone_Total_Column'
};

export const GIBS_FORMATS = {
  visual: 'image/jpeg',
  temperature: 'image/png',
  co2: 'image/png',
  'sea-level': 'image/png',
  ozone: 'image/png'
};

/**
 * Returns a WMS URL for a single equirectangular texture mapping to a sphere
 */
export function getGibsWmsUrl(layerKey: keyof typeof GIBS_LAYERS, date: Date, width = 4096, height = 2048) {
  const layerName = GIBS_LAYERS[layerKey] || GIBS_LAYERS.visual;
  const format = GIBS_FORMATS[layerKey] || 'image/jpeg';
  
  // By omitting the TIME parameter, GIBS will automatically return the most recent available data 
  // for that specific layer, avoiding 404/XML errors for dates that haven't been processed yet.
  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&LAYERS=${layerName}&VERSION=1.3.0&FORMAT=${format}&TRANSPARENT=true&WIDTH=${width}&HEIGHT=${height}&CRS=EPSG:4326&BBOX=-90,-180,90,180`;
}
