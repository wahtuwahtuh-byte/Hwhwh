export default {
  name: 'kick',
  aliases: ['remove'],
  desc: 'Keluarkan anggota (tag/reply)',
  usage: '@user',
  group: true,
  admin: true,
  botAdmin: true,
  async run({ sock, jid, target, reply }) {
    if (!target) return reply('Tag atau reply anggota yang ingin dikeluarkan.');
    await sock.groupParticipantsUpdate(jid, [target], 'remove');
    await reply('✅ Anggota dikeluarkan.');
  },
};
