/** Only these fixed, read-only providers can be reached through the NASA proxy. */
export function nasaUpstream(path: readonly string[], input: URLSearchParams, apiKey: string): URL | null {
  const [service, ...rest] = path;
  const endpoint = rest.join("/");
  let url: URL;
  let allowed: string[];
  if (service === "core") {
    if (!/^(planetary\/apod|neo\/rest\/v1\/(feed|neo\/(browse|\d+))|DONKI\/(FLR|CME|GST|IPS|SEP|MPC|RBE|HSS|WSAEnlilSimulations|notifications)|EPIC\/api\/(natural|enhanced)(\/(all|date\/\d{4}-\d{2}-\d{2}))?)$/.test(endpoint)) return null;
    // CCMC moved DONKI off the old gateway on 2026-09-30; the public API is keyless.
    if (endpoint.startsWith("DONKI/")) url = new URL(`https://ccmc.gsfc.nasa.gov/DONKI-API/get/${rest[1]}`);
    else {
      url = new URL(`https://api.nasa.gov/${endpoint}`);
      url.searchParams.set("api_key", apiKey);
    }
    allowed = ["date", "start_date", "end_date", "count", "thumbs", "startDate", "endDate", "type", "page", "size"];
  } else if (service === "media" && !endpoint) {
    url = new URL("https://images-api.nasa.gov/search");
    allowed = ["q", "media_type", "year_start", "year_end", "center", "keywords", "page", "page_size"];
  } else if (service === "asset" && rest.length === 1 && endpoint !== "." && endpoint !== ".." && /^[\w .-]{1,200}$/.test(endpoint)) {
    url = new URL(`https://images-api.nasa.gov/asset/${encodeURIComponent(endpoint)}`);
    allowed = [];
  } else if (service === "fireballs" && !endpoint) {
    url = new URL("https://ssd-api.jpl.nasa.gov/fireball.api");
    allowed = ["date-min", "date-max", "energy-min", "vel-min", "limit", "sort", "req-loc"];
  } else if (service === "tle" && (!endpoint || /^\d+$/.test(endpoint))) {
    url = new URL(`https://tle.ivanstanojevic.me/api/tle/${endpoint}`);
    allowed = ["search", "page", "page_size"];
  } else if (service === "techport" && (!endpoint || /^\d+$/.test(endpoint))) {
    url = new URL(`https://techport.nasa.gov/api/projects${endpoint ? `/${endpoint}` : ""}`);
    allowed = ["updatedSince"];
  } else if (service === "exoplanets" && !endpoint) {
    const query = input.get("query") || "";
    if (query.length > 4000 || !/^SELECT\s/i.test(query) || /;|--|\/\*/.test(query)) return null;
    url = new URL("https://exoplanetarchive.ipac.caltech.edu/TAP/sync");
    url.searchParams.set("format", "json");
    allowed = ["query"];
  } else return null;
  for (const key of allowed) {
    const value = input.get(key);
    if (value !== null && value.length <= 4000) url.searchParams.set(key, value);
  }
  return url;
}
