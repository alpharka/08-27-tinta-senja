# Panduan Kustomisasi Website Undangan Digital

Dokumen ini menjelaskan cara mengganti identitas pasangan, detail acara, foto, musik, warna, tipografi, serta perilaku interaktif pada website undangan digital **Tinta Senja**.

Website ini adalah frontend statis berbasis React dan TypeScript. Data contoh tidak dikirim ke server. RSVP dan buku tamu hanya disimpan di `localStorage` browser sampai backend ditambahkan.

> **Lokasi file utama:** `client/src/pages/Home.tsx` untuk data dan markup section, `client/src/index.css` untuk tampilan, dan `client/index.html` untuk metadata halaman.

## 1. Persiapan lokal

Pastikan Node.js dan pnpm tersedia, kemudian jalankan perintah berikut dari root repository:

```bash
pnpm install
pnpm dev
```

Buka alamat lokal yang ditampilkan oleh Vite. Untuk pemeriksaan sebelum commit, jalankan:

```bash
pnpm check
pnpm build
```

`pnpm check` memeriksa tipe TypeScript, sedangkan `pnpm build` membuat production build frontend dan server wrapper proyek.

## 2. Mengganti data pasangan dan acara

Semua data yang paling sering diganti berada dalam satu objek konfigurasi bernama `invitation` di bagian awal `client/src/pages/Home.tsx`. Jangan menyebarkan nilai pasangan ke banyak komponen; cukup ubah konfigurasi ini agar seluruh section ikut konsisten.

| Properti | Fungsi | Contoh nilai |
|---|---|---|
| `names` | Nama lengkap yang tampil pada cover, hero, dan footer | `"Nadia & Raka"` |
| `shortNames` | Nama pendek pada header dan footer | `"Nad & Rak"` |
| `parents` | Nama orang tua | `"Putri dari ... · Putra dari ..."` |
| `dateLabel` | Format tanggal yang dibaca manusia | `"Minggu, 21 Maret 2027"` |
| `dateShort` | Format singkat pada cover | `"21.03.27"` |
| `eventDate` | Waktu target countdown dalam ISO 8601 | `"2027-03-21T15:30:00+07:00"` |
| `akad.time`, `akad.venue` | Waktu dan venue akad | `"08.00 WIB"`, `"Masjid ..."` |
| `reception.time`, `reception.venue` | Waktu dan venue resepsi | `"18.30–21.00 WIB"`, `"Gedung ..."` |
| `address` | Alamat yang tampil dan dikirim ke Calendar | Alamat lengkap venue |
| `mapsUrl` | Link Google Maps yang dibuka pada tab baru | URL Google Maps |
| `musicUrl` | URL file audio instrumental | URL MP3 publik |
| `ewallet.provider` | Nama provider e-wallet | `"DANA"` |
| `ewallet.number` | Nomor e-wallet | Nomor penerima |
| `ewallet.recipient` | Nama penerima e-wallet | Nama lengkap |
| `bank.name` | Nama bank | `"Bank Mandiri"` |
| `bank.number` | Nomor rekening | Nomor rekening |
| `bank.recipient` | Nama pemilik rekening | Nama lengkap |

Setelah mengganti tanggal, ubah pula isi fungsi `calendarUrl()` apabila waktu akad atau resepsi berubah. Nilai `start` dan `end` menggunakan format Google Calendar UTC `YYYYMMDDTHHmmssZ`. Pastikan durasi event, timezone, judul, lokasi, dan deskripsi sesuai acara yang sebenarnya.

## 3. Mengatur nama tamu melalui URL

Nama tamu dibaca dari query parameter `to`. Contoh URL:

```text
https://undangan-dig-hjjnxq4t.manus.space/?to=Keluarga%20Budi%20Santoso
```

Fungsi `getGuestName()` melakukan tiga hal penting: mengambil parameter `to`, merapikan whitespace, dan membatasi panjang nama menjadi 70 karakter. Nilai tersebut ditampilkan sebagai teks React biasa sehingga tidak dirender sebagai HTML. Jika parameter tidak tersedia, fallback yang digunakan adalah **“Tamu undangan”**.

Untuk mengirim link ke tamu, gunakan `encodeURIComponent()` saat membuat URL secara programatik. Jangan menaruh HTML mentah di dalam parameter nama tamu.

## 4. Mengganti foto galeri dan hero

Daftar foto berada pada array `gallery` di `client/src/pages/Home.tsx`. Setiap item memiliki empat nilai:

| Nilai | Fungsi |
|---|---|
| `src` | URL gambar yang digunakan browser |
| `alt` | Deskripsi aksesibilitas untuk pembaca layar |
| `caption` | Keterangan yang tampil pada overlay dan lightbox |
| `size` | Kelas layout: `tall`, `wide`, `portrait`, atau `square` |

Untuk aset lokal atau hasil generate, simpan file asli di luar folder source pada `/home/ubuntu/webdev-static-assets/`, lalu gunakan URL storage yang diberikan proyek. Jangan menaruh foto besar di `client/public` atau `client/src/assets` karena dapat memperlambat deployment.

Setiap foto sebaiknya memiliki crop dan subjek yang berbeda. Jangan menggunakan foto yang sama berulang kali. Tulis `alt` yang menjelaskan subjek dan konteks, bukan sekadar “foto 1”. Jika menambah foto baru, pastikan item tersebut juga bisa dibuka oleh lightbox karena lightbox membaca seluruh array `gallery` secara otomatis.

Untuk mengganti hero, ubah `src` pada `.hero-image-wrap` dan background `.cover-photo` di CSS agar keduanya menggunakan foto utama yang sama. Jika foto memiliki karakter terang, pertahankan overlay gelap atau ubah warna teks agar kontras tetap memadai.

## 5. Mengganti musik latar

URL musik berada pada `invitation.musicUrl`. Gunakan file instrumental tanpa vokal dengan izin penggunaan yang sesuai. Website tidak mengandalkan autoplay: playback dicoba setelah tombol **Buka undangan** ditekan, sesuai batasan autoplay browser. Jika browser menolak playback, tombol floating **Putar musik** tetap tersedia.

Volume default dapat diatur pada elemen audio dengan menambahkan `audioRef.current.volume = 0.25` sebelum `play()`. Jangan mengubah musik menjadi autoplay sebelum interaksi pengguna karena hal tersebut dapat gagal pada banyak browser dan mengganggu pengalaman tamu.

## 6. Mengubah tema visual

Arah visual saat ini adalah **Tinta Senja**, yaitu editorial romanticism dengan biru tinta, krem kertas, dan tembaga senja. Token warna berada di bagian `:root` dalam `client/src/index.css`.

| Token | Peran | Nilai saat ini |
|---|---|---|
| `--ink` | Latar gelap utama | `#172A3A` |
| `--ink-deep` | Latar cover dan section gelap | `#0E1C29` |
| `--paper` | Latar kertas utama | `#F2EEE6` |
| `--paper-bright` | Latar footer | `#FBF9F5` |
| `--copper` | Aksen brand dan CTA | `#B9754A` |
| `--copper-light` | Aksen pada latar gelap | `#D29A75` |
| `--text` | Warna teks utama | `#233140` |
| `--muted` | Teks sekunder | `#69727A` |

Jika ingin membuat tema baru, ubah token terlebih dahulu, lalu periksa seluruh section gelap dan terang. Pastikan teks di atas foto tetap terbaca; overlay `.cover-wash` dan warna `--copper-light` biasanya perlu disesuaikan bersama-sama. Hindari mengganti hanya satu warna tanpa memeriksa kontras tombol, border, kicker, countdown, dan footer.

## 7. Mengganti tipografi

Font dimuat dari Google Fonts pada bagian paling atas `client/src/index.css`. Saat ini:

- **Cormorant Garamond** digunakan untuk nama pasangan, judul display, angka countdown, dan signature.
- **DM Sans** digunakan untuk body copy, label, navigasi, form, dan tombol.

Jika mengganti font, ubah import Google Fonts dan semua deklarasi `font-family` yang terkait. Pertahankan satu display font berkarakter dan satu font body yang mudah dibaca. Hindari menggunakan satu font yang sama untuk semua elemen karena hierarki editorial merupakan bagian penting dari identitas Tinta Senja.

## 8. RSVP dan buku tamu

Form RSVP berada pada section `#rsvp`. Field yang tersedia adalah nama, status kehadiran, dan pesan. Validasi saat ini menolak nama kurang dari dua karakter dan pesan kurang dari tiga karakter. Setelah berhasil, pesan baru ditambahkan ke state, disimpan ke `localStorage` dengan key `tinta-senja-rsvp`, lalu ditampilkan di buku tamu tanpa reload.

Dalam versi statis, data hanya tersimpan pada browser perangkat pengirim. Data tidak otomatis terlihat oleh pasangan atau tamu lain. Untuk penyimpanan online, ganti handler `handleRSVP()` dengan request ke backend yang memiliki validasi server, autentikasi admin, rate limiting, dan sanitasi data. Jangan menambahkan data seed atau testimoni buatan; empty state harus tetap tampil ketika belum ada pesan asli.

Untuk menghapus data RSVP lokal selama pengujian, jalankan perintah ini di DevTools Console:

```js
localStorage.removeItem("tinta-senja-rsvp");
```

## 9. Tanda kasih dan QR code

Nomor e-wallet dan rekening diambil dari `invitation.ewallet` serta `invitation.bank`. Tombol salin menggunakan Clipboard API dengan fallback textarea untuk browser yang tidak mendukung Clipboard API. Label berubah menjadi **Tersalin** selama sekitar dua detik.

Komponen `.qr-placeholder` saat ini adalah pola visual placeholder, bukan QR code pembayaran yang dapat dipindai. Sebelum publikasi final, ganti komponen tersebut dengan QR code yang benar-benar dihasilkan dari payload e-wallet yang telah diverifikasi. Pastikan provider, nomor, dan nama penerima juga sudah final. Jangan membiarkan data contoh tampil pada undangan yang dibagikan.

## 10. Animasi, aksesibilitas, dan mobile

Reveal saat scroll memakai `IntersectionObserver`, sedangkan lightbox mendukung tombol tutup, overlay click, `Escape`, `ArrowLeft`, dan `ArrowRight`. Body dikunci saat lightbox terbuka. Media query `prefers-reduced-motion: reduce` menonaktifkan motion non-esensial dan menampilkan konten secara langsung.

Saat mengubah layout, pertahankan prinsip berikut:

| Area | Yang perlu diperiksa |
|---|---|
| Cover | Tombol tetap terlihat pada layar tinggi maupun pendek |
| Header | Header muncul setelah cover dibuka dan tidak menutupi teks |
| Mobile nav | Tidak menutupi tombol musik atau kontrol penting |
| Galeri | Tidak menimbulkan overflow horizontal pada lebar 320px |
| Form | Semua label tetap terhubung dengan input dan fokus terlihat |
| Lightbox | Fokus dipindahkan ke tombol tutup dan scroll body terkunci |
| Foto | Tetapkan aspect ratio agar tidak menyebabkan layout shift besar |

## 11. Checklist sebelum publikasi

Sebelum membagikan URL final, lakukan pemeriksaan berikut secara manual:

1. Buka URL tanpa parameter dan pastikan fallback `Tamu undangan` tampil.
2. Buka URL dengan `?to=Nama%20Tamu` dan pastikan nama tampil aman serta tidak merusak layout.
3. Tekan **Buka undangan**, pastikan cover slide-up dan musik dapat dikontrol.
4. Periksa countdown menggunakan tanggal acara yang benar.
5. Uji link Google Maps dan Google Calendar pada tab baru.
6. Buka setiap foto, navigasikan lightbox dengan tombol dan keyboard, lalu tutup dengan `Escape`.
7. Kirim RSVP kosong dan pastikan pesan validasi terlihat.
8. Kirim RSVP valid dan pastikan pesan muncul di buku tamu.
9. Uji tombol salin rekening dan e-wallet pada perangkat mobile.
10. Uji ukuran layar sekitar 320px, 390px, tablet, dan desktop lebar.
11. Jalankan `pnpm check` dan `pnpm build`.
12. Pastikan data pembayaran, foto, tanggal, lokasi, dan nama penerima sudah bukan data contoh.

## 12. Struktur file yang relevan

```text
client/
├── index.html                 # Judul, bahasa, metadata, dan theme color
└── src/
    ├── index.css              # Token visual, layout, responsive, dan motion
    └── pages/
        └── Home.tsx           # Konfigurasi data dan section undangan
ideas.md                       # Keputusan arah desain Tinta Senja
todo.md                        # Checklist pekerjaan dokumentasi
CUSTOMIZATION.md              # Panduan ini
```

## Referensi

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API "MDN Intersection Observer API"

[2]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "MDN Window.localStorage"

[3]: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API "MDN Clipboard API"

[4]: https://developers.google.com/calendar/api/guides/create-events "Google Calendar API — Create Events"
