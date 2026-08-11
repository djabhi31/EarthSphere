// =============================================================================
// EarthSphere — Geospatial Timezone Resolver & Live Clock Utilities
// =============================================================================

export interface UserTimezoneInfo {
  timeStr: string;
  dateStr: string;
  tzCode: string;
  offsetStr: string;
}

export interface EventLocalTimeInfo {
  localTimeStr: string;
  localDateStr: string;
  tzCode: string;
  offsetStr: string;
  isNightAtLocation: boolean;
}

/**
 * Retrieves the user's current local timezone info from the browser
 */
export function getUserTimezoneInfo(): UserTimezoneInfo {
  const now = new Date();

  // Time format
  const timeStr = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Date format
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Timezone code / offset
  const offsetMinutes = now.getTimezoneOffset();
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const mins = String(absOffset % 60).padStart(2, '0');
  const offsetStr = `UTC${sign}${hours}:${mins}`;

  // Timezone short name
  let tzCode = 'LOCAL';
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart) tzCode = tzPart.value;
  } catch {
    /* fallback */
  }

  return { timeStr, dateStr, tzCode, offsetStr };
}

/**
 * Calculates the local time and timezone for physical coordinates [lon, lat]
 */
export function getEventLocalTimeInfo(
  lon: number,
  lat: number,
  utcDateIso: string
): EventLocalTimeInfo {
  const eventDate = new Date(utcDateIso);

  // Approximate longitude timezone offset in hours (-12 to +14)
  let rawOffsetHours = Math.round(lon / 15);
  if (rawOffsetHours > 14) rawOffsetHours = 14;
  if (rawOffsetHours < -12) rawOffsetHours = -12;

  // Calculate site timestamp by applying offset hours
  const localTimestamp = eventDate.getTime() + rawOffsetHours * 3600 * 1000;
  const localDate = new Date(localTimestamp);

  const localHours = localDate.getUTCHours();
  const localMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

  const hour12 = localHours % 12 || 12;
  const ampm = localHours >= 12 ? 'PM' : 'AM';

  const localTimeStr = `${String(hour12).padStart(2, '0')}:${localMinutes} ${ampm}`;

  const localDateStr = localDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const sign = rawOffsetHours >= 0 ? '+' : '-';
  const absH = String(Math.abs(rawOffsetHours)).padStart(2, '0');
  const offsetStr = `UTC${sign}${absH}:00`;

  // Estimate timezone code from regional bounds
  let tzCode = `UTC${sign}${Math.abs(rawOffsetHours)}`;
  if (lon >= -125 && lon <= -114 && lat >= 30 && lat <= 50) tzCode = 'PST';
  else if (lon >= -114 && lon <= -102 && lat >= 30 && lat <= 50) tzCode = 'MST';
  else if (lon >= -102 && lon <= -85 && lat >= 25 && lat <= 50) tzCode = 'CST';
  else if (lon >= -85 && lon <= -65 && lat >= 25 && lat <= 50) tzCode = 'EST';
  else if (lon >= -10 && lon <= 35 && lat >= 35 && lat <= 70) tzCode = 'CET';
  else if (lon >= 65 && lon <= 90 && lat >= 8 && lat <= 38) tzCode = 'IST';
  else if (lon >= 125 && lon <= 145 && lat >= 25 && lat <= 45) tzCode = 'JST';
  else if (lon >= 140 && lon <= 155 && lat <= -10 && lat >= -45) tzCode = 'AEST';

  // Night time at physical location if local hour is between 20:00 and 06:00
  const isNightAtLocation = localHours >= 20 || localHours < 6;

  return { localTimeStr, localDateStr, tzCode, offsetStr, isNightAtLocation };
}
