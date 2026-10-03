export const FIELD_GUIDE = [
  { title: "One planet. Many perspectives.", text: "Begin over Africa and the Indian Ocean. Drag the globe to look around, then use the layers to see what the naked eye cannot.", latitude: 12, longitude: 36, layer: null },
  { title: "Follow the warmth.", text: "Surface air temperature reveals how unevenly the planet heats up. Click an observed point for a reading.", latitude: 30, longitude: 60, layer: "air-temperature" },
  { title: "A moving ocean.", text: "Ocean height varies with circulation, temperature and climate. Explore positive and negative sea-level anomalies.", latitude: 5, longitude: -130, layer: "sea-level" },
  { title: "Water beneath our feet.", text: "SMAP follows moisture in the land. Compare dry regions with places where the soil holds more water.", latitude: -8, longitude: -55, layer: "soil-moisture" },
  { title: "A protective atmosphere.", text: "Ozone has a different story at every altitude. Explore the total column, then switch to Aura’s stratospheric measurements.", latitude: -64, longitude: 20, layer: "ozone" },
] as const;

// NASA's public science media, presented in EarthSphere's own player.
export const SCIENCE_STORIES = [
  { title: "Carbon monoxide & fire", file: "CO_Palm_Oil.webm", topic: "Atmosphere", text: "AIRS observations show carbon monoxide travelling through the atmosphere." },
  { title: "The polar vortex", file: "Polar_Vortex.mp4", topic: "Temperature", text: "Watch surface air temperature patterns in this NASA visualization." },
  { title: "The rise of carbon dioxide", file: "CO2.webm", topic: "Climate", text: "A historical AIRS visualization of atmospheric carbon dioxide, 2002–2016." },
  { title: "Ocean surface winds", file: "ccmp.webm", topic: "Ocean", text: "Follow the wind patterns that help move the surface ocean." },
  { title: "Water on the move", file: "grace.webm", topic: "Water", text: "GRACE reveals changes in the storage of water around the planet." },
  { title: "Sea-level variation", file: "ostm.webm", topic: "Ocean", text: "Explore ocean height during the strong El Niño of 2015." },
  { title: "Atmospheric rivers", file: "atmo_river_dated_1080p30.webm", topic: "Weather", text: "Watch long bands of water vapor move through the atmosphere." },
  { title: "A world of change", file: "full_world_aria_events.webm", topic: "Land", text: "NASA’s ARIA project maps the effects of major natural events." },
  { title: "A sinking valley", file: "CA_Central_Valley.webm", topic: "Land", text: "Satellite observations reveal subsidence in California’s Central Valley." },
  { title: "The Keeling Curve", file: "Keeling_Curve.webm", topic: "Climate", text: "See the long-term accumulation and seasonal cycle of carbon dioxide." },
  { title: "Greenland’s changing ice", file: "grace_monthly_anomaly_gris_black_vel_720p4.mp4", topic: "Ice", text: "GRACE measurements reveal changes in Greenland’s ice mass." },
  { title: "A planet of lightning", file: "LightningData.webm", topic: "Weather", text: "Explore global patterns of lightning activity." },
  { title: "A warming world, 1880–2024", file: "GISTEMP_Curves_English_degC_2160p60.webm", topic: "Climate", text: "NASA’s GISTEMP visualization follows changes in global temperature." },
  { title: "The pulse of our rivers", file: "Swot_Rivers_V_Anom_Final02_Comp_1080P30.webm", topic: "Water", text: "SWOT measurements reveal changing river volumes." },
  { title: "The sea-level record", file: "slrtrend_tpx_2022.webp", topic: "Ocean", text: "A historical NASA graphic showing sea-level trends through 2022.", image: true },
  { title: "Carbon dioxide in context", file: "co2_graph_072623.webp", topic: "Climate", text: "NASA’s historical carbon-dioxide graphic, published in 2023.", image: true },
];
