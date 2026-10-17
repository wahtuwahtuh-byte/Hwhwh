export default {
  name: 'welcome',
  desc: 'Pesan sambutan anggota baru',
  usage: '<on|off>',
  group: true,
  admin: true,
  async run({ args, jid, db, reply }) {
    const g = db.group(jid);
    const v = args[0]?.toLowerCase();
    if (!['on', 'off'].includes(v)) return reply(`Status welcome: *${g.welcome ? 'ON' : 'OFF'}*\nGunakan: .welcome on/off`);
    g.welcome = v === 'on';
    db.save();
    await reply(`✅ Welcome ${v.toUpperCase()}`);
  },
};
