export default {
  name: 'ping',
  desc: 'Cek kecepatan respon bot',
  async run({ msg, reply }) {
    const ts = Number(msg.messageTimestamp) * 1000;
    const ms = Math.max(0, Date.now() - ts);
    await reply(`🏓 Pong! ${ms} ms`);
  },
};
