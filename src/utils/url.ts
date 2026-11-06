/**
 * Resolves game iframe URLs so they work whether hosted at root,
 * on a local dev server, or under a GitHub Pages repository subfolder.
 */
export function resolveGameUrl(url: string): string {
  if (!url) return '';
  // External absolute URLs (e.g. Basket Bros on instructure.click)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${cleanBase}${cleanUrl}`;
}
