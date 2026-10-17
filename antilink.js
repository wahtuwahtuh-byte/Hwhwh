export default {
  name: 'antilink',
  desc: 'Hapus otomatis link grup WhatsApp',
  usage: '<on|off>',
  group: true,
  admin: true,
  async run({ args, jid, db, reply }) {
    const g = db.group(jid);
    const v = args[0]?.toLowerCase();
    if (!['on', 'off'].includes(v)) return reply(`Status antilink: *${g.antilink ? 'ON' : 'OFF'}*\nGunakan: .antilink on/off`);
    g.antilink = v === 'on';
    db.save();
    await reply(`✅ Antilink ${v.toUpperCase()}${g.antilink ? '\n(Bot harus admin agar bisa menghapus pesan.)' : ''}`);
  },
};
