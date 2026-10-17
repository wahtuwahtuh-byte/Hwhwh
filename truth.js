import { pick } from '../../lib/util.js';

const T = [
  'Hal paling memalukan yang pernah kamu alami?',
  'Siapa orang terakhir yang kamu stalking di media sosial?',
  'Kebiasaan aneh apa yang kamu punya?',
  'Apa kebohongan terbesar yang pernah kamu ucapkan?',
  'Makanan apa yang diam-diam kamu benci tapi tetap dimakan?',
  'Apa mimpi teraneh yang pernah kamu alami?',
];

export default {
  name: 'truth',
  desc: 'Pertanyaan truth',
  async run({ reply }) {
    await reply(`🙊 *Truth*\n${pick(T)}`);
  },
};
