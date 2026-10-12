# PERBANDINGAN STRUKTUR FILE & FOLDER CODEBASE
## WARUNG NASI GORENG CAK MOL: SEBELUM VS SESUDAH PEMBARUAN

Dokumen ini menyajikan perbandingan struktur direktori, berkas, dan fungsi komponen antara:
1. **`warungcakmol-copy-2`** : Codebase Versi Awal (Sebelum Pembaruan)
2. **`warungcakmol-copy`**   : Codebase Versi Terbaru (Setelah Pembaruan)

---

## 1. TREE STRUKTUR FILE & FOLDER

```
========================================================================================
CODEBASE LAMA (warungcakmol-copy-2)          CODEBASE BARU (warungcakmol-copy)
========================================================================================
warungcakmol-copy-2/                         warungcakmol-copy/
├── admin/                                   ├── admin/
│   ├── add.php                              │   ├── add.php
│   ├── cetakPDF.php                         │   ├── cetakLaporan.php       <-- [BARU: PDF Keuangan]
│   ├── delete.php                           │   ├── cetakPDF.php
│   ├── edit.php                             │   ├── delete.php
│   ├── fungsi.php                           │   ├── edit.php
│   ├── index.php                            │   ├── fungsi.php             <-- [DIROMBAK: Prepared Stmt]
│   ├── login.php                            │   ├── index.php              <-- [DIROMBAK: SPA Dashboard + Finansial]
│   ├── logout.php                           │   ├── login.php              <-- [DIPERKETAT: CSRF]
│   ├── registrasi.php                       │   ├── logout.php
│   ├── composer.json                        │   ├── registrasi.php
│   └── composer.lock                        │   ├── composer.json
│                                            │   └── composer.lock
├── assets/                                  ├── assets/
│   ├── notification.mp3                     │   ├── notification.mp3
│   └── qris.jpg                             │   └── qris.jpg
│                                            │
├── css/                                     ├── css/
│   ├── style-admin.css                      │   ├── style-admin.css
│   ├── style-user-index.css                 │   ├── style-user-index.css
│   ├── style-user-kasir.css                 │   ├── style-user-kasir.css
│   └── style-user-order.css                 │   └── style-user-order.css
│                                            │
├── img/                                     ├── img/
│   └── (aset foto menu & warung)            │   └── (aset foto menu & warung)
│                                            │
├── (TIDAK ADA MODUL INCLUDES)               ├── includes/                  <-- [MODUL BARU: Core Engine]
│                                            │   ├── auth.php               <-- [BARU: Session Guard Kasir/Admin]
│                                            │   ├── helpers.php            <-- [BARU: CSRF Token, Sanitasi, Rupiah]
│                                            │   └── koneksi.php            <-- [BARU: Sentralisasi DB MySQLi]
│                                            │
├── (TIDAK ADA MODUL DAPUR)                  ├── kitchen/                   <-- [MODUL BARU: Kitchen Display System]
│                                            │   ├── index.php              <-- [BARU: KDS 2-Kolom Realtime UI]
│                                            │   ├── poll_kitchen.php       <-- [BARU: Polling API 5 Detik]
│                                            │   └── update_status.php      <-- [BARU: Menunggu->Dimasak->Siap]
│                                            │
├── user/                                    ├── user/
│   ├── fungsi.php                           │   ├── cetak_struk.php        <-- [BARU: Print Thermal 58/80mm]
│   ├── index.php                            │   ├── fungsi.php
│   ├── kasir.php                            │   ├── index.php
│   ├── koneksi.php                          │   ├── kasir.php              <-- [DIROMBAK: Login Required, Modal Bayar]
│   ├── order.php                            │   ├── koneksi.php
│   ├── poll_orders.php                      │   ├── order.php              <-- [DIPERBARUI: Scan QR Meja & LocalStorage]
│   ├── process_order.php                    │   ├── poll_orders.php        <-- [DIPERBARUI: MD5 Status Hash]
│   ├── composer.json                        │   ├── process_order.php      <-- [DIPERBARUI: Support Takeaway & ACID]
│   └── composer.lock                        │   ├── takeaway.php           <-- [BARU: Order Mandiri Bawa Pulang]
│                                            │   ├── composer.json
│                                            │   └── composer.lock
│                                            │
├── nasgorcakmoldb (2).sql                   ├── nasgorcakmoldb (2).sql     <-- [SKEMA BARU: 4 Tabel -> 8 Tabel]
├── composer.json & composer.lock            ├── composer.json & composer.lock
└── vendor/ (mPDF library)                   └── vendor/ (mPDF library)
```

---

## 2. PENJELASAN FUNGSI TIAP FILE & DIREKTORI

### A. Direktori `includes/` (Hanya Ada di Codebase Baru)
Folder ini dibuat untuk memusatkan keamanan, otentikasi, dan koneksi agar tidak terjadi duplikasi kode:
- **`includes/koneksi.php`**: Inisialisasi koneksi MySQLi terpusat dengan penanganan galat dan set charset `utf8mb4`.
- **`includes/auth.php`**: Pengendali otentikasi sesi (`confirm_admin_login()`, `confirm_kasir_login()`, `init_user_session()`) serta regenerasi Session ID untuk mencegah *Session Fixation*.
- **`includes/helpers.php`**: Pustaka fungsi bantuan untuk validasi token CSRF (`csrf_token()`, `check_csrf_token()`), sanitasi string anti-XSS (`sanitize()`), dan format angka mata uang (`formatRupiah()`).

---

### B. Direktori `kitchen/` (Hanya Ada di Codebase Baru)
Modul operasional dapur (*Kitchen Display System* / KDS) untuk menggantikan sistem teriak/nota kertas:
- **`kitchen/index.php`**: Layar display interaktif koki dengan tampilan dua kolom antrean ("Menunggu Masak" & "Sedang Dimasak"), penghitung durasi tunggu (*elapsed timer*), tombol filter kategori, dan efek audio synthesizer via Web Audio API.
- **`kitchen/poll_kitchen.php`**: Endpoint API ringan yang dipanggil otomatis per 5 detik untuk memeriksa daftar tiket masakan dapur aktif.
- **`kitchen/update_status.php`**: Endpoint API pembaruan status masakan dari *Menunggu* -> *Dimasak* -> *Siap*.

---

### C. Direktori `user/` (Pelanggan & Kasir)
| Nama Berkas | Status di Versi Baru | Fungsi Utama |
|---|---|---|
| **`index.php`** | Ada di Kedua Versi | Landing page publik profil Cak Mol, review, jam buka, lokasi, dan tab katalog menu dinamis. |
| **`order.php`** | Diperbarui | Halaman pemesanan Dine In (Makan di Tempat). Di versi baru telah mendukung pemindaian QR Code meja (`?meja=...`), dropdown pilihan meja, dan persistensi keranjang di `localStorage`. |
| **`takeaway.php`** | **Baru (Hanya di v2)** | Halaman pemesanan Bawa Pulang khusus mandiri dengan validasi nama pemesan wajib dan pengosongan relasi meja (`meja_id = 0`). |
| **`process_order.php`** | Diperbarui | API transaksi ACID. Di versi baru mendukung pemisahan tipe pesanan (Dine In vs Takeaway), input nama pelanggan, server-side price check, dan inisialisasi status dapur *Menunggu*. |
| **`kasir.php`** | Dirombak Total | Di versi lama: terbuka tanpa login, hanya tombol "Tandai Selesai". Di versi baru: **wajib login kasir**, terintegrasi status dapur (border berkedip hijau jika siap), popup modal bayar (Cash/QRIS), kalkulator kembalian, auto-release meja jadi 'Kosong'. |
| **`poll_orders.php`** | Diperbarui | Polling kasir tiap 8 detik. Di versi baru menghitung hash MD5 status dapur sehingga reload hanya terjadi bila ada pesanan baru atau status dapur berubah. |
| **`cetak_struk.php`** | **Baru (Hanya di v2)** | Template struk belanja thermal printer 58mm/80mm yang otomatis memicu dialog cetak (`window.print()`). |
| **`fungsi.php`** | Diperbarui | Wrapper query basis data di ranah pengguna. |
| **`koneksi.php`** | Diperbarui | Di versi baru mengarah ke `includes/koneksi.php`. |

---

### D. Direktori `admin/` (Manajemen & Pemilik)
| Nama Berkas | Status di Versi Baru | Fungsi Utama |
|---|---|---|
| **`index.php`** | Dirombak Total | Di versi lama: hanya tabel CRUD menu sederhana (10 KB). Di versi baru: **Single Page Dashboard (56 KB)** memuat ringkasan omzet, grafik 7 hari Chart.js, Top 5 Best Seller, 5 Transaksi Kasir Terbaru, Tab CRUD Menu, Tab Keuangan Laba/Rugi, dan Tab Pengaturan Warung. |
| **`login.php`** | Diperketat | Autentikasi akun admin & kasir dengan password hash bcrypt, cookie remember-me SHA-256, dan validasi token CSRF. |
| **`registrasi.php`** | Ada di Kedua Versi | Pendaftaran akun admin baru dengan konfirmasi kata sandi. |
| **`logout.php`** | Ada di Kedua Versi | Penghancuran session server dan pembersihan cookie remember-me. |
| **`add.php`** | Diperbarui | Formulir tambah menu baru (upload foto maks 2MB, ekstensi jpg/png, dropdown kategori terhubung ke database). |
| **`edit.php`** | Diperbarui | Formulir ubah data menu dan penggantian foto dengan penghapusan berkas lama (`unlink`). |
| **`delete.php`** | Diperbarui | Penghapusan record menu sekaligus pembersihan file gambar fisik di storage. |
| **`cetakPDF.php`** | Ada di Kedua Versi | Export katalog menu berformat PDF landscape via mPDF. |
| **`cetakLaporan.php`**| **Baru (Hanya di v2)** | Export laporan pembukuan keuangan (Laba/Rugi, arus kas masuk, kas operasional keluar) ke PDF portrait via mPDF. |
| **`fungsi.php`** | Dirombak Total | Pustaka CRUD admin yang di versi baru telah di-refactor menggunakan *MySQLi Prepared Statements* untuk mitigasi SQL Injection. |

---

## 3. PERBANDINGAN STRUKTUR DATABASE (SQL)

```
========================================================================================
SKEMA DATABASE LAMA (4 TABEL)                SKEMA DATABASE BARU (8 TABEL)
========================================================================================
1. meja                                      1. meja (Ditambahkan kolom: kode_qr)
2. menu                                      2. menu
3. pesanan                                   3. pesanan (Ditambahkan: nama_pelanggan,
4. user                                                 tipe_pesanan, status_dapur,
   detail_pesanan (termasuk di SQL)                     metode_bayar, waktu_selesai)
                                             4. user
                                             5. detail_pesanan
                                             6. kategori       <-- [BARU: Master Kategori & Icon]
                                             7. pengaturan     <-- [BARU: Profil, WhatsApp, Running Text]
                                             8. uang_masuk     <-- [BARU: Kas Masuk Non-Pesanan]
                                             9. uang_keluar    <-- [BARU: Belanja Bahan & Operasional]
```

---

## 4. RANGKUMAN POIN EVOLUSI (CHEATSHEET BRAINSTORM)

1. **Dari Manual Kasir ke Multi-Lini Terintegrasi**: Versi lama hanya menghubungkan Pelanggan -> Kasir. Versi baru menghubungkan Pelanggan -> Dapur (KDS) -> Kasir -> Admin (Owner).
2. **Fleksibilitas Order**: Versi lama meja statis. Versi baru mendukung Scan QR Meja di meja makan, Dine In manual, dan Takeaway (bawa pulang).
3. **Peningkatan Keamanan Siber**: Penambahan modul `includes/` dengan token CSRF, proteksi halaman kasir (login required), dan sanitasi prepared statements.
4. **Pemberdayaan Finansial & Operasional**: Dari sekadar aplikasi pemesanan menjadi sistem POS & ERP mini yang mencatat laba/rugi harian, arus kas operasional, dan pengaturan profil warung dinamis.
