import { normalizeMessageContent, getContentType, jidNormalizedUser } from '@whiskeysockets/baileys';
import config from '../config.js';
import db from './db.js';

const cooldown = new Map();
const groupCache = new Map();

async function getGroup(sock, jid) {
  const hit = groupCache.get(jid);
  if (hit && Date.now() - hit.t < 60_000) return hit.meta;
  const meta = await sock.groupMetadata(jid);
  groupCache.set(jid, { t: Date.now(), meta });
  return meta;
}

const idsOf = (p) =>
  [p.id, p.jid, p.phoneNumber, p.lid].filter(Boolean).map((x) => jidNormalizedUser(x));

const isAdminOf = (meta, candidates) =>
  meta.participants.some((p) => p.admin && idsOf(p).some((id) => candidates.includes(id)));

export async function handleMessage(sock, msg, commands) {
  if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

  const jid = msg.key.remoteJid;
  const isGroup = jid.endsWith('@g.us');
  const content = normalizeMessageContent(msg.message);
  if (!content) return;

  const type = getContentType(content);
  const info = content[type]?.contextInfo;
  const body =
    content.conversation ||
    content.extendedTextMessage?.text ||
    content.imageMessage?.caption ||
    content.videoMessage?.caption ||
    '';
  if (!body) return;

  const rawSender = msg.key.fromMe ? sock.user.id : isGroup ? msg.key.participant : jid;
  if (!rawSender) return;
  const sender = jidNormalizedUser(rawSender);
  const senderIds = [sender, msg.key.participantAlt, msg.key.remoteJidAlt]
    .filter(Boolean)
    .map((x) => jidNormalizedUser(x));
  const senderNumber = sender.split('@')[0];

  const isOwner =
    !!msg.key.fromMe || senderIds.some((id) => config.owner.includes(id.split('@')[0]));

  // Mode self: hanya owner yang boleh memakai bot
  if (db.data.settings.mode === 'self' && !isOwner) return;

  const reply = (text, opts = {}) =>
    sock.sendMessage(jid, { text, ...opts }, { quoted: msg });

  let meta = null;
  const loadMeta = async () => (meta ||= await getGroup(sock, jid));

  // Anti-link grup
  if (isGroup && db.group(jid).antilink && /chat\.whatsapp\.com\/[A-Za-z0-9]+/i.test(body)) {
    try {
      const m = await loadMeta();
      const botIds = [sock.user.id, sock.user.lid].filter(Boolean).map((x) => jidNormalizedUser(x));
      if (isAdminOf(m, botIds) && !isAdminOf(m, senderIds) && !isOwner) {
        await sock.sendMessage(jid, { delete: msg.key });
        await sock.sendMessage(jid, {
          text: `🚫 @${senderNumber} dilarang mengirim link grup.`,
          mentions: [sender],
        });
        return;
      }
    } catch {}
  }

  // Parse perintah
  const prefix = config.prefixes.find((p) => body.startsWith(p));
  if (!prefix) return;
  const rest = body.slice(prefix.length).trim();
  if (!rest) return;
  const [rawName, ...args] = rest.split(/\s+/);
  const name = rawName.toLowerCase();
  const cmd = commands.get(name);
  if (!cmd) return;
  const text = rest.slice(rawName.length).trim();

  // Cooldown 2 detik per pengguna
  const last = cooldown.get(sender) || 0;
  if (Date.now() - last < 2000 && !isOwner) return;
  cooldown.set(sender, Date.now());

  // Validasi hak akses
  if (cmd.owner && !isOwner) return reply('⛔ Perintah ini khusus owner.');
  if (cmd.group && !isGroup) return reply('⛔ Perintah ini hanya bisa dipakai di grup.');

  if (cmd.admin || cmd.botAdmin) {
    const m = await loadMeta();
    if (cmd.admin && !isAdminOf(m, senderIds) && !isOwner) return reply('⛔ Perintah ini khusus admin grup.');
    if (cmd.botAdmin) {
      const botIds = [sock.user.id, sock.user.lid].filter(Boolean).map((x) => jidNormalizedUser(x));
      if (!isAdminOf(m, botIds)) return reply('⚠️ Jadikan bot sebagai admin grup terlebih dahulu.');
    }
  }

  const quoted = info?.quotedMessage
    ? {
        message: info.quotedMessage,
        key: { remoteJid: jid, id: info.stanzaId, participant: info.participant },
        sender: info.participant ? jidNormalizedUser(info.participant) : null,
      }
    : null;

  const mentioned = info?.mentionedJid || [];
  const numArg = args.find((a) => /^\+?\d{8,15}$/.test(a));
  const target =
    mentioned[0] || quoted?.sender || (numArg ? `${numArg.replace(/\D/g, '')}@s.whatsapp.net` : null);

  const ctx = {
    sock, msg, jid, isGroup, sender, senderNumber, isOwner,
    prefix, name, args, text, quoted, mentioned, target,
    commands, config, db, reply, loadMeta,
  };

  try {
    await cmd.run(ctx);
  } catch (e) {
    console.error(`Error di perintah ${name}:`, e);
    await reply('❌ Terjadi kesalahan saat menjalankan perintah.');
  }
}

export async function handleGroupUpdate(sock, { id, participants, action }) {
  const g = db.group(id);
  if (!g.welcome || !['add', 'remove'].includes(action)) return;
  const meta = await sock.groupMetadata(id).catch(() => null);
  const jids = participants.map((p) => (typeof p === 'string' ? p : p.phoneNumber || p.id));
  for (const j of jids) {
    const n = j.split('@')[0];
    const text =
      action === 'add'
        ? `👋 Selamat datang @${n} di *${meta?.subject || 'grup'}*!\nBaca deskripsi grup ya.`
        : `👋 Sampai jumpa @${n}.`;
    await sock.sendMessage(id, { text, mentions: [j] });
  }
}
