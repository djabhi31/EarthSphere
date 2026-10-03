import type { Mission } from "./missions";

// Public NASA/JPL glTF assets. These are model files, not the Eyes application.
const FILES: Record<string, string> = {
  sc_aqua: "sc_aqua/Aqua.gltf", sc_aura: "sc_aura/Aura.gltf",
  sc_sac_d: "sc_sac_d/aquarius.gltf", sc_calipso: "sc_calipso/calipso.gltf",
  sc_cloudsat: "sc_cloudsat/CloudSat.gltf", sc_cygnss_1: "sc_cygnss/CYGNSS.gltf",
  sc_gpm: "sc_gpm/GPM.gltf", sc_grace_1: "sc_grace/grace.gltf",
  sc_grace_fo1: "sc_grace_fo/graceFO.gltf", sc_icesat_2: "sc_icesatii/ICESat2.gltf",
  sc_iss: "sc_iss/ISS_stationary.gltf", sc_jason_1: "sc_ostm/ostm.gltf",
  sc_jason_2: "sc_ostm/ostm.gltf", sc_jason_3: "sc_ostm/ostm.gltf",
  sc_landsat_7: "sc_landsat_7/LandSat7.gltf", sc_landsat_8: "sc_landsat_8/LandSat8.gltf",
  sc_landsat_9: "sc_landsat_9/Landsat9.gltf", sc_mcubed_2: "sc_mcubed_2/M-Cubed2.gltf",
  sc_nisar: "sc_nisar/Nisar.gltf", sc_noaa_20: "sc_noaa_20/noaa20.gltf",
  sc_noaa_21: "sc_noaa_21/noaa21.gltf", sc_oco_2: "sc_oco_2/oco2.gltf",
  sc_pace: "sc_pace/pace.gltf", sc_prefire_1: "sc_prefire/prefire.gltf",
  sc_prefire_2: "sc_prefire/prefire.gltf", sc_raincube: "sc_raincube/Raincube.gltf",
  sc_sentinel_6: "sc_sentinel_6/Sentinel6.gltf", sc_sentinel_6b: "sc_sentinel_6/Sentinel6.gltf",
  sc_smap: "sc_smap/SMAP.gltf", sc_sorce: "sc_sorce/sorce.gltf",
  sc_suomi_npp: "sc_npp/NPP.gltf", sc_swot: "sc_swot_v2/swot.gltf",
  sc_tempo: "sc_tempo/tempo.gltf", sc_terra: "sc_terra/Terra.gltf",
  sc_tropics_01: "sc_tropics/tropics.gltf", sc_tropics_03: "sc_tropics/tropics.gltf",
  sc_tropics_05: "sc_tropics/tropics.gltf", sc_tropics_06: "sc_tropics/tropics.gltf",
  sc_tropics_07: "sc_tropics/tropics.gltf",
};

export function spacecraftAsset(id: string): string | null {
  return Object.hasOwn(FILES, id) ? `https://eyes.nasa.gov/assets/static/models/${FILES[id]}` : null;
}

export function missionThumbnail(mission: Mission): string | null {
  const name = mission.thumb_name;
  return name && /^[a-z0-9_-]+$/i.test(name)
    ? `https://eyes.nasa.gov/assets/dynamic/earth/api/thumbnail/${name}.webp` : null;
}

export function missionColor(mission?: Pick<Mission, "categories">): string {
  const category = mission?.categories[0]?.toLowerCase();
  return category === "atmosphere" ? "#e6ab6b" : category === "land" ? "#8ace89" : "#8ab9f0";
}

/** Camera distance fitting a unit sphere into both viewport axes, including its limb. */
export function globeDistance(width: number, height: number, fov = 42): number {
  const aspect = Math.max(.2, width / Math.max(height, 1));
  const halfAngle = Math.atan(Math.tan(fov * Math.PI / 360) * Math.min(.78, aspect * .82));
  return 1 / Math.sin(halfAngle);
}
