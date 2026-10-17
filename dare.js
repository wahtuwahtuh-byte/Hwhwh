import { pick } from '../../lib/util.js';

const D = [
  'Kirim voice note menyanyikan lagu favoritmu.',
  'Ganti foto profil jadi foto lucu selama 1 jam.',
  'Ceritakan lelucon terburuk yang kamu tahu.',
  'Kirim stiker paling random yang kamu punya.',
  'Tulis pantun untuk anggota grup yang pertama online.',
  'Pakai bahasa baku semua selama 10 menit.',
];

export default {
  name: 'dare',
  desc: 'Tantangan dare',
  async run({ reply }) {
    await reply(`😈 *Dare*\n${pick(D)}`);
  },
};
