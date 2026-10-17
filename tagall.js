export default {
  name: 'tagall',
  aliases: ['everyone'],
  desc: 'Mention semua anggota',
  usage: '[pesan]',
  group: true,
  admin: true,
  async run({ sock, jid, msg, text, loadMeta }) {
    const meta = await loadMeta();
    const ids = meta.participants.map((p) => p.id);
    const list = ids.map((id) => `› @${id.split('@')[0]}`).join('\n');
    await sock.sendMessage(jid, { text: `📢 ${text || 'Perhatian semua!'}\n\n${list}`, mentions: ids }, { quoted: msg });
  },
};
