import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../commands');

export async function loadCommands() {
  const map = new Map();
  for (const category of fs.readdirSync(dir)) {
    const catPath = path.join(dir, category);
    if (!fs.statSync(catPath).isDirectory()) continue;
    for (const file of fs.readdirSync(catPath).filter((f) => f.endsWith('.js'))) {
      const mod = (await import(pathToFileURL(path.join(catPath, file)).href)).default;
      if (!mod?.name) continue;
      mod.category ||= category;
      map.set(mod.name, mod);
      for (const alias of mod.aliases || []) map.set(alias, mod);
    }
  }
  return map;
}
