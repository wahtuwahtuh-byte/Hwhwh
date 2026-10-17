const ICON = { general: '🧭', tools: '🛠️', fun: '🎲', media: '🖼️', group: '👥', owner: '👑' };

export default {
  name: 'menu',
  aliases: ['help', 'bantuan'],
  desc: 'Tampilkan daftar perintah',
  async run({ reply, commands, prefix, config }) {
    const byCat = {};
    for (const c of new Set(commands.values())) (byCat[c.category] ||= []).push(c);

    let out = `*${config.botName}*\nPrefix: ${config.prefixes.join('  ')}\n`;
    for (const [cat, list] of Object.entries(byCat)) {
      out += `\n${ICON[cat] || '•'} *${cat.toUpperCase()}*\n`;
      out += list.sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => `› ${prefix}${c.name}${c.usage ? ' ' + c.usage : ''} — ${c.desc}`).join('\n');
      out += '\n';
    }
    await reply(out.trim());
  },
};
