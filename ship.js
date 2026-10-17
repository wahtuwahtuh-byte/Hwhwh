export default {
  name: 'ship',
  aliases: ['jodoh'],
  desc: 'Kecocokan dua orang (iseng)',
  usage: '@user1 @user2',
  async run({ sock, jid, msg, mentioned, reply }) {
    if (mentioned.length < 2) return reply('Tag dua orang. Contoh: .ship @A @B');
    const pct = Math.floor(Math.random() * 101);
    const [a, b] = mentioned;
    await sock.sendMessage(
      jid,
      { text: `💞 @${a.split('@')[0]} × @${b.split('@')[0]}\nKecocokan: *${pct}%*`, mentions: [a, b] },
      { quoted: msg },
    );
  },
};
