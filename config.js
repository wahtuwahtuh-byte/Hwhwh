import 'dotenv/config';

const list = (v, sep = ',') => (v || '').split(sep).map((s) => s.trim()).filter(Boolean);

export default {
  botName: process.env.BOT_NAME || 'WA-Bot',
  prefixes: list(process.env.PREFIX || '.,!,/'),
  owner: list(process.env.OWNER_NUMBER).map((n) => n.replace(/\D/g, '')),
  pairingNumber: (process.env.PAIRING_NUMBER || '').replace(/\D/g, ''),
  sessionDir: 'session',
  sticker: {
    pack: process.env.STICKER_PACK || 'WA-Bot',
    author: process.env.STICKER_AUTHOR || 'Bot',
  },
  ai: {
    key: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.AI_MODEL || 'claude-sonnet-5-5',
  },
};
