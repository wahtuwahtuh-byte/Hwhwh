import { pick } from '../../lib/util.js';

export default {
  name: 'koin',
  desc: 'Lempar koin',
  async run({ reply }) {
    await reply(`🪙 ${pick(['Angka', 'Gambar'])}`);
  },
};
