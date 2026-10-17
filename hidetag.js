export default {
  name: 'hidetag',
  aliases: ['h'],
  desc: 'Mention semua anggota tanpa terlihat',
  usage: '<pesan>',
  group: true,
  admin: true,
  async run({ sock, jid, text, loadMeta, reply }) {
    if (!text) return reply('Contoh: .hidetag rapat jam 8');
    const meta = await loadMeta();
    await sock.sendMessage(jid, { text, mentions: meta.participants.map((p) => p.id) });
  },
};
