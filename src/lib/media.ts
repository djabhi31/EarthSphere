/** Select a playable NASA asset and upgrade legacy HTTP URLs for secure pages. */
export function playableNasaMedia(hrefs: readonly string[], type: 'image' | 'video' | 'audio'): string | undefined {
  if (type === 'image') return undefined;
  const urls = hrefs.flatMap(href => {
    try {
      const url = new URL(href);
      if (!['http:', 'https:'].includes(url.protocol) || url.hostname !== 'images-assets.nasa.gov' || url.username || url.password) return [];
      url.protocol = 'https:';
      return [url];
    } catch { return []; }
  });
  const preferred = urls.find(url => type === 'video' ? /~medium\.mp4$/i.test(url.pathname) : /\.mp3$/i.test(url.pathname));
  const fallback = urls.find(url => type === 'video' ? /\.mp4$/i.test(url.pathname) : /\.(mp3|wav)$/i.test(url.pathname));
  return (preferred || fallback)?.href;
}
