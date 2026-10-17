# WA-Bot Multi-Fitur

Bot WhatsApp berbasis [Baileys](https://github.com/WhiskeySockets/Baileys) dengan sistem perintah modular.
Cukup tambah file di folder `commands/<kategori>/` untuk menambah fitur baru.

## Fitur

| Kategori | Perintah |
|---|---|
| General | `menu`, `ping`, `info`, `owner` |
| Tools | `calc`, `cuaca`, `sholat`, `kurs`, `tr` (terjemah), `short`, `qr`, `password`, `base64`, `ai` |
| Fun | `dadu`, `koin`, `tanya`, `truth`, `dare`, `receh`, `ship` |
| Media | `sticker` (`s`), `pp` |
| Grup | `tagall`, `hidetag`, `kick`, `promote`, `demote`, `antilink`, `welcome`, `linkgrup`, `infogrup` |
| Owner | `mode` (public/self), `bc` (broadcast) |

Ketik `.menu` untuk daftar lengkap beserta cara pakai.

## Cara pakai

Butuh **Node.js 20+** dan **git**.

```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
npm install
cp .env.example .env     # lalu edit isinya
npm start
```

Isi `.env`:
- `OWNER_NUMBER` nomor owner, format internasional tanpa `+` (contoh `628123456789`)
- `PAIRING_NUMBER` nomor yang dipakai untuk bot. Jika diisi, login memakai **kode pairing** (tanpa scan QR). Kosongkan untuk login via QR.
- `ANTHROPIC_API_KEY` opsional, untuk perintah `.ai`

Login pairing: jalankan bot, salin kode 8 karakter yang muncul di terminal, lalu di WhatsApp buka
**Perangkat tertaut > Tautkan perangkat > Tautkan dengan nomor telepon**.

Sesi tersimpan di folder `session/` (jangan di-commit, sudah ada di `.gitignore`).

## Menjalankan terus-menerus

**VPS (pm2):**
```bash
npm i -g pm2
pm2 start index.js --name wa-bot
pm2 save
```

**Docker:**
```bash
docker build -t wa-bot .
docker run -d --name wa-bot --env-file .env -v $(pwd)/session:/app/session -v $(pwd)/data:/app/data wa-bot
```

**Termux (Android):** `pkg install nodejs git ffmpeg`, lalu langkah di atas.

## Menambah perintah

Buat file `commands/tools/halo.js`:

```js
export default {
  name: 'halo',
  aliases: ['hai'],
  desc: 'Menyapa',
  // group: true, admin: true, botAdmin: true, owner: true  (opsional)
  async run({ reply, senderNumber }) {
    await reply(`Halo ${senderNumber}!`);
  },
};
```

Objek `ctx` berisi: `sock, msg, jid, sender, args, text, quoted, mentioned, target, isGroup, isOwner, reply, db, config`.

## Catatan

- Baileys adalah library **tidak resmi**. Gunakan nomor cadangan dan jangan untuk spam, karena nomor bisa dibatasi/diblokir WhatsApp.
- Stiker video butuh `ffmpeg` terpasang.
- Jika `session/` rusak atau muncul "logged out", hapus folder tersebut lalu login ulang.

## Lisensi

MIT
