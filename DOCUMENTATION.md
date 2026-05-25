# Guz Sector

**Guz Sector** is a manual sector timing stopwatch application designed for sim racing and mobile racing games. It features a dark, futuristic motorsport HUD aesthetic with high-contrast neon accents, built to replicate professional telemetry systems.

## 🏁 Fitur Utama (Core Features)

### 1. Timer & Lap Tracking (Timer Screen)
- **Current Lap Time**: Menampilkan waktu lap saat ini yang sedang berjalan di tengah layar dengan ukuran besar (font 7-segment/digital style).
- **Dynamic Sectors**: Mendukung pembagian trek menjadi 2 hingga 5 sektor.
- **Tap to Record**: Tombol besar yang mudah ditekan tanpa harus melihat layar dengan teliti saat balapan. Berfungsi untuk mencatat waktu setiap sektor.
- **Delta & Color Coding (F1 Style)**:
  - 🟪 **Ungu (Purple)**: Waktu sektor tercepat secara keseluruhan (Overall Best).
  - 🟩 **Hijau (Green)**: Waktu sektor lebih cepat dari lap sebelumnya (Personal Best).
  - 🟨 **Kuning (Yellow)**: Waktu sektor lebih lambat.
- **Live Telemetry Panel**: Panel bawah yang menampilkan:
  - **Last Lap**: Waktu putaran terakhir.
  - **Delta**: Perbandingan waktu dengan lap terbaik.
  - **Best Lap**: Waktu putaran tercepat secara keseluruhan.
  - **Optimal (Teo)**: Putaran ideal teoretis (dihitung dari gabungan seluruh sektor tercepat).
  - **Best Sectors Table**: Ringkasan berderet waktu terbaik untuk masing-masing sektor (S1, S2, S3, dst).
- **Undo feature**: Tombol *Undo* untuk membatalkan tap sektor terakhir jika terjadi kesalahan ketuk (hanya berlaku dalam batas lap yang sedang berjalan).

### 2. Lap History (History Screen)
- **Daftar Lap Lengkap**: Menyimpan dan menampilkan seluruh riwayat lap dalam satu sesi.
- **Best Lap Highlight**: Putaran tercepat akan ditandai secara otomatis dengan ikon trofi dan border berwarna ungu bercahaya (`glow purple`).
- **Data Per Sektor**: Setiap kartu riwayat lap akan menampilkan breakdown waktu tiap sektor secara mendetail beserta indikator warna delta di bagian bawah blok sektor.
- **Manajemen Lap**: 
  - Fitur **Hapus Lap Individu (Trash icon)** pada setiap kartu.
  - Fitur **Hapus Semua History (Clear All)** di pojok kanan atas untuk mereset seluruh data sesi.

### 3. Settings (Setup Screen)
- **Track Sectors Configuration**: Pengguna dapat mengubah jumlah sektor pada trek (Pilihan: 2, 3, 4, atau 5 Sektor). Sektor default umumnya adalah 3.
- **Engineer Radio (Mockup)**: Tombol *toggle* untuk mengaktifkan "audio feedback" seolah engineer membacakan waktu sektor dan delta. 

### 4. Home Screen
- Panel antarmuka bergaya radar dengan sentuhan animasi putar (spin) dan pulse pada latar belakang.
- Tombol **Start Session** besar bercahaya di tengah.

---

## 🎨 Desain dan Estetika (Design & Aesthetics)

**Guz Sector** dirancang dengan pendekatan desain *Mobile First* bernuansa **Futuristic Dark Racing HUD**. Fokus utama desain ini adalah visibilitas tinggi dan kontras warna yang tajam.

### Tema Warna (Color Palette)
- **Background**: `#050505` (Hitam pekat/Dark Racing Background) menghasilkan kesan layar OLED dan imersif.
- **Panel/Cards**: `#0a0a0c` (Hitam keabuan dengan border abu-abu gelap).
- **Aksen Neon**: 
  - **Cyan** (`#22d3ee`) - Elemen UI interaktif (Tombol navigasi, teks informatif).
  - **Emerald / Green** (`#10b981`) - Untuk start button dan delta waktu yang lebih cepat.
  - **Purple** (`#a855f7`) - Khusus penanda rekaman waktu *Ultimate / Best Overall*.
  - **Red / Rose** (`#f43f5e`) - Tombol stop, bahaya, atau delta waktu lebih lambat (+).
  - **Yellow / Amber** (`#f59e0b`) - Waktu lebih lambat dalam standar motorsport.

### Tipografi (Typography)
Pemilihan font krusial untuk menampilkan gaya dasbor balap:
1. **Orbitron** (`font-display`): Digunakan pada judul utama, layar utama, dan teks display besar (memori estetika HUD fiksi ilmiah / otomotif).
2. **JetBrains Mono** (`font-mono`): Digunakan **secara ekstensif** pada segala angka timer, waktu lap, sektor, dan delta. Font *monospaced* memastikan angka-angka yang berjalan tidak bergoyang, menjaga struktur kolom agar lurus layaknya sistem telemetri asli.
3. **Inter** (`font-sans`): Digunakan untuk label teks biasa pada UI umum (meski hampir seluruh aplikasi mengutamakan Mono / Display).

### Trik Visual (Visual Enhancements)
- **Glow & Drop Shadows**: Memanfaatkan Tailwind CSS `shadow-[0_0_Xpx_rgba(...)]` memberikan kesan lampu LED/Neon pada elemen interaktif yang aktif. Latar juga diredupkan untuk fokus pada cahaya tombol.
- **Block Colors**: Bagian bawah indikator sektor menggunakan garis balok (h-1) untuk menginterpretasikan penanda warna bergaya F1 di dalam aplikasi.
- **Custom Scrollbar**: Scrollbar sistem disembunyikan `::-webkit-scrollbar { display: none; }` agar estetika UI terlihat lebih menyatu sebagai dashboard bawaan mesin mobil daripada sekedar aplikasi web.
