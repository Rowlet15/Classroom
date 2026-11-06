import { CloakPreset } from '../types';

export const CLOAK_PRESETS: CloakPreset[] = [
  {
    id: 'default',
    name: 'Normal (PortalHub)',
    title: 'PortalHub Unblocked Games',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6366f1"><path d="M6 11h4V7H6v4zm0 6h4v-4H6v4zm6 0h4v-4h-4v4zm0-6h4V7h-4v4zm-6 8h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>`
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e8e3e"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>`
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4285f4"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbc04"><path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm4.86 11.5l3.43 6h7.71l-3.43-6h-7.71zM14.86 3.5l-3.43 6 6.55 11.5 3.43-6L14.86 3.5z"/></svg>`
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas LMS',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e02424"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5" fill="#ffffff"/></svg>`
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d9488"><rect width="20" height="20" x="2" y="2" rx="4"/><path fill="#fff" d="M7 16l3-8 4 8 3-4"/></svg>`
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4h2v4zm0-6h-2V8h2v2z"/></svg>`
  }
];

export function applyCloak(presetId: string): void {
  try {
    const preset = CLOAK_PRESETS.find(p => p.id === presetId) || CLOAK_PRESETS[0];
    document.title = preset.title;

    let faviconEl = document.getElementById('tab-favicon') as HTMLLinkElement | null;
    if (!faviconEl) {
      faviconEl = document.createElement('link');
      faviconEl.id = 'tab-favicon';
      faviconEl.rel = 'icon';
      document.head.appendChild(faviconEl);
    }

    const encodedSvg = encodeURIComponent(preset.iconSvg.trim());
    faviconEl.href = `data:image/svg+xml,${encodedSvg}`;

    localStorage.setItem('portal_cloak_preset', preset.id);
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function initCloak(): void {
  try {
    const saved = localStorage.getItem('portal_cloak_preset');
    if (saved) {
      applyCloak(saved);
    }
  } catch {
    // Ignore
  }
}

export function triggerPanic(): void {
  try {
    const panicUrl = localStorage.getItem('portal_panic_url') || 'https://classroom.google.com';
    window.location.replace(panicUrl);
  } catch {
    window.location.href = 'https://classroom.google.com';
  }
}

export function launchAboutBlank(iframeUrl: string, title: string): boolean {
  try {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      return false;
    }

    const currentCloakId = localStorage.getItem('portal_cloak_preset') || 'default';
    const preset = CLOAK_PRESETS.find(p => p.id === currentCloakId) || CLOAK_PRESETS[0];
    const pageTitle = preset.id === 'default' ? title : preset.title;
    const faviconHref = `data:image/svg+xml,${encodeURIComponent(preset.iconSvg.trim())}`;

    // Resolve absolute URL if relative
    const absoluteUrl = iframeUrl.startsWith('http') 
      ? iframeUrl 
      : new URL(iframeUrl, window.location.href).href;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${pageTitle}</title>
        <link rel="icon" type="image/svg+xml" href="${faviconHref}">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
          iframe { width: 100%; height: 100%; border: none; display: block; }
        </style>
      </head>
      <body>
        <iframe src="${absoluteUrl}" allow="autoplay; fullscreen; keyboard; gamepad" allowfullscreen></iframe>
      </body>
      </html>
    `);
    win.document.close();
    return true;
  } catch {
    return false;
  }
}
