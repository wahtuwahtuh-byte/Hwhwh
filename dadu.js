export default {
  name: 'dadu',
  desc: 'Lempar dadu',
  async run({ reply }) {
    await reply(`🎲 Hasil: *${1 + Math.floor(Math.random() * 6)}*`);
  },
};
