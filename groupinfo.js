export default {
  name: 'infogrup',
  aliases: ['groupinfo'],
  desc: 'Info grup',
  group: true,
  async run({ loadMeta, reply }) {
    const m = await loadMeta();
    const admins = m.participants.filter((p) => p.admin).length;
    await reply(
      `👥 *${m.subject}*\nAnggota: ${m.participants.length}\nAdmin: ${admins}\n` +
      `Dibuat: ${new Date(m.creation * 1000).toLocaleDateString('id-ID')}\n\n` +
      `${m.desc || '(tanpa deskripsi)'}`,
    );
  },
};
