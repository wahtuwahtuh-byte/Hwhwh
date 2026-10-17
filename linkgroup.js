export default {
  name: 'linkgrup',
  aliases: ['linkgc', 'linkgroup'],
  desc: 'Ambil link undangan grup',
  group: true,
  admin: true,
  botAdmin: true,
  async run({ sock, jid, reply }) {
    const code = await sock.groupInviteCode(jid);
    await reply(`🔗 https://chat.whatsapp.com/${code}`);
  },
};
