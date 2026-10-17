export default {
  name: 'promote',
  desc: 'Jadikan admin (tag/reply)',
  usage: '@user',
  group: true,
  admin: true,
  botAdmin: true,
  async run({ sock, jid, target, reply }) {
    if (!target) return reply('Tag atau reply anggota yang dituju.');
    await sock.groupParticipantsUpdate(jid, [target], 'promote');
    await reply('✅ Berhasil dijadikan admin.');
  },
};
