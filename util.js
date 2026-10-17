export async function fetchJson(url, options = {}) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchText(url, options = {}) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function formatDuration(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}h`, h && `${h}j`, m && `${m}m`, `${s}d`].filter(Boolean).join(' ');
}
