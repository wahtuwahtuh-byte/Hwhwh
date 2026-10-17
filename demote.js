export default {
  name: 'demote',
  desc: 'Turunkan admin (tag/reply)',
  usage: '@user',
  group: true,
  admin: true,
  botAdmin: true,
  async run({ sock, jid, target, reply }) {
    if (!target) return reply('Tag atau reply admin yang dituju.');
    await sock.groupParticipantsUpdate(jid, [target], 'demote');
    await reply('✅ Admin diturunkan.');
  },
};
