import os from 'os';
import { formatDuration } from '../../lib/util.js';

export default {
  name: 'info',
  aliases: ['status', 'runtime'],
  desc: 'Info & uptime bot',
  async run({ reply, config, db }) {
    const mem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    await reply(
      `🤖 *${config.botName}*\n` +
      `⏱️ Uptime: ${formatDuration(process.uptime())}\n` +
      `💾 Memori: ${mem} MB\n` +
      `🖥️ Platform: ${os.platform()} ${os.arch()}\n` +
      `🟢 Node: ${process.version}\n` +
      `🔓 Mode: ${db.data.settings.mode}`,
    );
  },
};
