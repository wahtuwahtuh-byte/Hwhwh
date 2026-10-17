import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import config from './config.js';
import { loadCommands } from './lib/loader.js';
import { handleMessage, handleGroupUpdate } from './lib/handler.js';

const logger = pino({ level: 'silent' });
const commands = await loadCommands();
console.log(`✔ ${new Set(commands.values()).size} perintah dimuat`);

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: state,
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  // Login dengan kode pairing (jika PAIRING_NUMBER diisi)
  if (!sock.authState.creds.registered && config.pairingNumber) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(config.pairingNumber);
        console.log(`\n🔑 Kode pairing: ${code}`);
        console.log('WhatsApp > Perangkat tertaut > Tautkan dengan nomor telepon\n');
      } catch (e) {
        console.error('Gagal meminta kode pairing:', e.message);
      }
    }, 3000);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr && !config.pairingNumber) {
      console.log('Scan QR berikut dengan WhatsApp:');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') console.log(`✅ ${config.botName} terhubung sebagai ${sock.user?.id}`);
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.log('❌ Sesi keluar. Hapus folder "session" lalu jalankan ulang.');
        process.exit(1);
      }
      console.log('Koneksi terputus, mencoba menyambung ulang...');
      start();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        await handleMessage(sock, msg, commands);
      } catch (e) {
        console.error('Handler error:', e);
      }
    }
  });

  sock.ev.on('group-participants.update', (u) => handleGroupUpdate(sock, u).catch(console.error));
}

process.on('unhandledRejection', (e) => console.error('Unhandled:', e));
start();
