export type ContentArt = { src: string; alt: string; caption: string; credit: string; kind: string };
const earth: ContentArt = { src: "/images/editorial/earth-horizon.webp", alt: "Sunset along Earth's atmosphere, photographed from the International Space Station", caption: "EARTH'S ATMOSPHERE / EXPEDITION 23", credit: "https://images.nasa.gov/details/iss023e057948", kind: "earth" };
const cosmos: ContentArt = { src: "/images/editorial/cosmic-cliffs.webp", alt: "The star-forming Cosmic Cliffs in the Carina Nebula, imaged by Webb", caption: "COSMIC CLIFFS / WEBB NIRCAM", credit: "https://images.nasa.gov/details/carina_nebula", kind: "cosmos" };
const orbit: ContentArt = { src: "/images/editorial/orbital-science.webp", alt: "A small satellite deployed from the International Space Station above Earth", caption: "SCIENCE IN ORBIT / EXPEDITION 45", credit: "https://images.nasa.gov/details/iss045e014236", kind: "orbit" };
export function contentArt(path: string): ContentArt {
  if (path === "/mars") return { src: "/images/editorial/mars-landscape.webp", alt: "Perseverance's panorama of boulders near Santa Cruz on Mars", caption: "SANTA CRUZ / PERSEVERANCE, SOL 353", credit: "https://images.nasa.gov/details/PIA25172", kind: "mars" };
  if (path === "/space-weather") return { src: "/images/editorial/solar-observatory.webp", alt: "The Sun observed by NASA's Solar Dynamics Observatory", caption: "OUR STAR / SOLAR DYNAMICS OBSERVATORY", credit: "https://images.nasa.gov/details/PIA26681", kind: "sun" };
  if (["/satellites", "/techport"].includes(path)) return orbit;
  if (["/events", "/analytics", "/epic", "/earth-imagery", "/intel"].includes(path)) return earth;
  return cosmos;
}
