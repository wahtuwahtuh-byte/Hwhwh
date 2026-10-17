import fs from 'fs';

const dir = 'data';
const file = `${dir}/db.json`;
fs.mkdirSync(dir, { recursive: true });

let data = { settings: { mode: 'public' }, groups: {} };
try {
  const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
  data = { ...data, ...saved, settings: { ...data.settings, ...saved.settings } };
} catch {}

let timer;
export function save() {
  clearTimeout(timer);
  timer = setTimeout(() => fs.writeFileSync(file, JSON.stringify(data, null, 2)), 500);
}

export function group(jid) {
  data.groups[jid] ||= { antilink: false, welcome: false };
  return data.groups[jid];
}

export default { data, save, group };
