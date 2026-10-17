export default {
  name: 'owner',
  desc: 'Kontak owner bot',
  async run({ sock, jid, msg, config, reply }) {
    if (!config.owner.length) return reply('Owner belum diatur di file .env');
    const contacts = config.owner.map((n) => ({
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Owner\nTEL;type=CELL;waid=${n}:+${n}\nEND:VCARD`,
    }));
    await sock.sendMessage(jid, { contacts: { displayName: 'Owner', contacts } }, { quoted: msg });
  },
};
