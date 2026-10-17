import { pick } from '../../lib/util.js';

const JAWAB = ['Ya.', 'Tidak.', 'Mungkin.', 'Sepertinya iya.', 'Sepertinya tidak.', 'Tanya lagi nanti.', 'Pasti!', 'Jangan berharap.'];

export default {
  name: 'tanya',
  aliases: ['8ball'],
  desc: 'Bola ajaib jawab pertanyaanmu',
  usage: '<pertanyaan>',
  async run({ text, reply }) {
    if (!text) return reply('Contoh: .tanya apakah besok hujan?');
    await reply(`🎱 ${pick(JAWAB)}`);
  },
};
