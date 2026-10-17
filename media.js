import { downloadMediaMessage, normalizeMessageContent, getContentType } from '@whiskeysockets/baileys';
import pino from 'pino';

const logger = pino({ level: 'silent' });
const MEDIA = ['imageMessage', 'videoMessage', 'stickerMessage'];

/** Ambil media dari pesan itu sendiri atau dari pesan yang di-reply. */
export async function getMedia(ctx) {
  const candidates = [ctx.msg, ctx.quoted].filter(Boolean);
  for (const m of candidates) {
    const content = normalizeMessageContent(m.message);
    const type = content && getContentType(content);
    if (MEDIA.includes(type)) {
      const buffer = await downloadMediaMessage(
        m,
        'buffer',
        {},
        { logger, reuploadRequest: ctx.sock.updateMediaMessage },
      );
      return { buffer, type, seconds: content[type]?.seconds || 0 };
    }
  }
  return null;
}
