// ── High-Resolution Vector Plates for Tactile Sketchbook (1760 x 1240) ──
// All strings are strictly XML-escaped so that every plate renders reliably
// without any XML parsing errors or broken image placeholders.
//
// Alur kerja disesuaikan 100% dengan alur kerja nyata RidzWeb Studio:
// 1. Brief & Konsultasi Kebutuhan (WhatsApp / Online)
// 2. Desain & Mockup UI/UX di Figma (Review Interaktif)
// 3. Development & Integrasi Fitur (React/Next.js, WA Checkout, Booking)
// 4. Live Testing & Revisi Bersama (Staging Link Preview)
// 5. Launch & Serah Terima Resmi (Domain, GitHub Source Code & Garansi 30 Hari)

export interface StudioPlateData {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  phase: string;
  duration: string;
  leftTitle: string;
  leftSubtitle: string;
  leftBoxHeader: string;
  leftPoints: string[];
  leftHighlight: string;
  rightTitle: string;
  rightSubtitle: string;
  rightBoxHeader: string;
  rightPoints: string[];
  stamp: string;
}

export interface ProcessPlate {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  phase: string;
  url: string;
}

function escapeXml(unsafe: unknown): string {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildPlateSvg(plate: StudioPlateData): string {
  const leftItems = plate.leftPoints
    .map(
      (pt, i) =>
        `<text x="24" y="${120 + i * 44}" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="16" fill="#3c342a">• ${escapeXml(pt)}</text>`
    )
    .join('');

  const rightItems = plate.rightPoints
    .map(
      (pt, i) =>
        `<text x="24" y="${120 + i * 44}" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="16" fill="#3c342a">✓ ${escapeXml(pt)}</text>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 1240" width="1760" height="1240">
  <defs>
    <style>
      .title { font-family: 'Playfair Display', Georgia, serif; font-size: 34px; fill: #1a1612; font-weight: 700; }
      .subtitle { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 18px; fill: #5c5244; font-weight: 400; }
      .meta { font-family: 'DM Mono', SFMono-Regular, monospace; font-size: 14px; fill: #8a7c68; letter-spacing: 0.14em; text-transform: uppercase; }
      .badge-txt { font-family: 'DM Mono', SFMono-Regular, monospace; font-size: 15px; font-weight: 700; fill: #a83c28; }
    </style>
    <linearGradient id="paperGrad_${plate.num}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f5efe4"/>
      <stop offset="48%" stop-color="#faf6ee"/>
      <stop offset="50%" stop-color="#e0d6c2"/>
      <stop offset="52%" stop-color="#faf6ee"/>
      <stop offset="100%" stop-color="#f5efe4"/>
    </linearGradient>
    <linearGradient id="spineShade_${plate.num}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(40,30,15,0)"/>
      <stop offset="50%" stop-color="rgba(40,30,15,0.24)"/>
      <stop offset="100%" stop-color="rgba(40,30,15,0)"/>
    </linearGradient>
  </defs>

  <!-- Solid Paper Background -->
  <rect width="1760" height="1240" fill="url(#paperGrad_${plate.num})"/>

  <!-- Notebook Ruled Lines -->
  <g stroke="#2b2318" stroke-width="0.7" opacity="0.08">
    ${Array.from({ length: 26 })
      .map(
        (_, i) =>
          `<line x1="80" y1="${220 + i * 36}" x2="810" y2="${220 + i * 36}"/><line x1="950" y1="${220 + i * 36}" x2="1680" y2="${220 + i * 36}"/>`
      )
      .join('')}
  </g>

  <!-- Left and Right Red Notebook Margin Lines -->
  <line x1="140" y1="70" x2="140" y2="1170" stroke="#a83c28" stroke-width="1.3" opacity="0.28"/>
  <line x1="1010" y1="70" x2="1010" y2="1170" stroke="#a83c28" stroke-width="1.3" opacity="0.28"/>

  <!-- Center Spine Fold and Shading -->
  <rect x="835" y="0" width="90" height="1240" fill="url(#spineShade_${plate.num})"/>
  <line x1="880" y1="0" x2="880" y2="1240" stroke="#2b2318" stroke-width="1.2" opacity="0.2"/>

  <!-- Left Page Header Metadata -->
  <text x="170" y="135" class="meta">[ RIDZWEB ALUR KERJA // TAHAP ${escapeXml(plate.num)} ]</text>
  <text x="800" y="135" class="meta" text-anchor="end">HAL. 0${parseInt(plate.num) * 2 - 1}</text>

  <!-- Right Page Header Metadata -->
  <text x="1040" y="135" class="meta">${escapeXml(plate.phase)}</text>
  <text x="1660" y="135" class="meta" text-anchor="end">HAL. 0${parseInt(plate.num) * 2}</text>

  <!-- Left Page Content -->
  <g transform="translate(170, 185)">
    <text x="0" y="40" class="title">${escapeXml(plate.leftTitle)}</text>
    <text x="0" y="75" class="subtitle">${escapeXml(plate.leftSubtitle)}</text>
    
    <rect x="0" y="110" width="630" height="360" rx="14" fill="#ffffff" stroke="#dacdb5" stroke-width="1.5"/>
    <text x="24" y="145" class="meta">${escapeXml(plate.leftBoxHeader)}</text>
    <g transform="translate(0, 45)">
      ${leftItems}
    </g>

    <g transform="translate(0, 500)">
      <rect x="0" y="0" width="630" height="110" rx="10" fill="#fcf9f2" stroke="#e8dfce" stroke-width="1.2"/>
      <text x="24" y="32" class="meta">KOMITMEN LAYANAN KAMI</text>
      <text x="24" y="70" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="16" fill="#1a1612" font-weight="600">${escapeXml(plate.leftHighlight)}</text>
    </g>
  </g>

  <!-- Right Page Content -->
  <g transform="translate(1040, 185)">
    <text x="0" y="40" class="title">${escapeXml(plate.rightTitle)}</text>
    <text x="0" y="75" class="subtitle">${escapeXml(plate.rightSubtitle)}</text>
    
    <rect x="0" y="110" width="630" height="360" rx="14" fill="#ffffff" stroke="#dacdb5" stroke-width="1.5"/>
    <text x="24" y="145" class="meta">${escapeXml(plate.rightBoxHeader)}</text>
    <g transform="translate(0, 45)">
      ${rightItems}
    </g>

    <!-- Approved Stamp Box -->
    <g transform="translate(160, 510)">
      <rect x="0" y="0" width="320" height="78" rx="8" fill="rgba(168, 60, 40, 0.04)" stroke="#a83c28" stroke-width="3" stroke-dasharray="8,5" transform="rotate(-2)"/>
      <text x="160" y="48" class="badge-txt" text-anchor="middle" letter-spacing="0.1em" transform="rotate(-2)">
        ★ ${escapeXml(plate.stamp)} ★
      </text>
    </g>
  </g>

  <!-- Bottom Page Footers -->
  <text x="170" y="1185" class="meta">ESTIMASI PENGERJAAN: ${escapeXml(plate.duration)}</text>
  <text x="1660" y="1185" class="meta" text-anchor="end">RIDZWEB STUDIO // TERVERIFIKASI</text>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ── 5 Core Stages of RidzWeb Studio's Genuine Client Workflow ─────────────
const STUDIO_STAGES: StudioPlateData[] = [
  {
    id: 'stage-1',
    num: '01',
    title: 'Konsultasi & Briefing Kebutuhan',
    subtitle: 'Diskusi santai via WhatsApp untuk menentukan paket & arah website yang tepat.',
    phase: 'TAHAP 01: BRIEF & KONSULTASI',
    duration: '1–2 Hari Kerja',
    leftTitle: 'Konsultasi & Diskusi Kebutuhan',
    leftSubtitle: 'Memetakan tujuan bisnis, produk yang dijual, dan gaya website yang diinginkan.',
    leftBoxHeader: 'POIN DISKUSI AWAL VIA WHATSAPP',
    leftPoints: [
      'Diskusi kebutuhan bisnis & produk yang ingin dipasarkan secara online.',
      'Rekomendasi paket: Landing Page, Profil Bisnis, Katalog, atau Booking.',
      'Penentuan target pembeli agar gaya tulisan & visual tepat sasaran.',
      'Estimasi biaya transparan tanpa ada biaya tambahan tersembunyi.'
    ],
    leftHighlight: 'Komunikasi santai & respon cepat via WhatsApp langsung dengan tim teknis.',
    rightTitle: 'Penentuan Alur & Fitur Utama',
    rightSubtitle: 'Menyusun daftar halaman dan fitur utama yang paling dibutuhkan.',
    rightBoxHeader: 'LANGKAH KESEPAKATAN AWAL',
    rightPoints: [
      'Pesan masuk klien via WhatsApp / Telepon konsultasi.',
      'Pemilihan referensi website yang disukai klien sebagai acuan.',
      'Penetapan jadwal pengerjaan (timeline) yang disepakati bersama.',
      'Pembayaran tanda jadi (DP) & proyek langsung masuk antrean pengerjaan.'
    ],
    stamp: 'BRIEF AWAL DISEPAKATI'
  },
  {
    id: 'stage-2',
    num: '02',
    title: 'Desain Mockup UI/UX (Figma)',
    subtitle: 'Perancangan desain visual yang modern, rapi, dan nyaman dilihat pengunjung.',
    phase: 'TAHAP 02: DESAIN & REVIEW MOCKUP',
    duration: '3–5 Hari Kerja',
    leftTitle: 'Perancangan Desain Visual Eksklusif',
    leftSubtitle: 'Membuat tampilan website di Figma sesuai dengan warna dan karakter brand.',
    leftBoxHeader: 'STANDAR DESAIN RIDZWEB',
    leftPoints: [
      'Desain responsif: Tampilan diuji nyaman dilihat di layar HP maupun Laptop.',
      'Tipografi modern & kontras warna yang jelas agar enak dibaca pembeli.',
      'Tata letak rapi yang mengarahkan pengunjung ke tombol aksi (CTA).',
      'Pemilihan aset visual berkualitas tinggi tanpa gambar pecah.'
    ],
    leftHighlight: 'Desain dirancang khusus untuk bisnis Anda, bukan template pasaran.',
    rightTitle: 'Review Prototipe Bersama Klien',
    rightSubtitle: 'Klien mencoba langsung simulasi website sebelum tahap koding dimulai.',
    rightBoxHeader: 'LAYANAN REVIEW & REVISI',
    rightPoints: [
      'Klien menerima link prototipe Figma yang bisa diklik di browser smartphone.',
      'Sesi walkthrough via WhatsApp / Google Meet bersama desainer.',
      'Bebas mengajukan revisi penyesuaian detail sampai disetujui bersama.',
      'Persetujuan desain final agar hasil koding 100% sama dengan mockup.'
    ],
    stamp: 'MOCKUP RESMI DISETUJUI'
  },
  {
    id: 'stage-3',
    num: '03',
    title: 'Development & Integrasi Fitur',
    subtitle: 'Koding dengan React & Next.js modern yang ringan, cepat, dan anti-lag.',
    phase: 'TAHAP 03: DEVELOPMENT & FITUR',
    duration: '5–10 Hari Kerja',
    leftTitle: 'Koding Bersih dengan React & Next.js',
    leftSubtitle: 'Mengubah mockup menjadi website nyata yang cepat dan stabil.',
    leftBoxHeader: 'STANDAR REKAYASA TEKNIS',
    leftPoints: [
      'Kecepatan loading kilat di bawah 1 detik agar calon pembeli tidak kabur.',
      'Tampilan responsif otomatis di semua browser (Chrome, Safari, Edge).',
      'Animasi halus 60 FPS yang ringan dan tidak membebani baterai HP.',
      'Struktur SEO-friendly agar website mudah ditemukan di Google.'
    ],
    leftHighlight: 'Performa tinggi dengan arsitektur kode modern tanpa jeda re-render.',
    rightTitle: 'Integrasi Fitur Khusus Bisnis',
    rightSubtitle: 'Memasang fitur otomatisasi yang mempermudah operasional harian.',
    rightBoxHeader: 'FITUR YANG DIINTEGRASIKAN',
    rightPoints: [
      'Tombol WhatsApp order dengan pesan otomatis siap kirim.',
      'Sistem booking online & kalender slot real-time (jika paket booking).',
      'Katalog produk interaktif dengan filter kategori cepat.',
      'Formulir kontak langsung yang terproteksi dari pesan spam.'
    ],
    stamp: 'KODE & FITUR TERVERIFIKASI'
  },
  {
    id: 'stage-4',
    num: '04',
    title: 'Testing & Review Bersama',
    subtitle: 'Klien mencoba langsung website di link preview sebelum diluncurkan ke publik.',
    phase: 'TAHAP 04: TESTING & REVISI AKHIR',
    duration: '2–3 Hari Kerja',
    leftTitle: 'Uji Coba Langsung di Link Preview',
    leftSubtitle: 'Website di-deploy ke server staging sementara agar bisa ditest bersama.',
    leftBoxHeader: 'CHECKLIST PENGUJIAN LINTAS PERANGKAT',
    leftPoints: [
      'Uji coba klik seluruh tombol WhatsApp, form kontak, dan navigasi menu.',
      'Pengujian di HP Android dan iPhone untuk memastikan kerapian tampilan.',
      'Pemeriksaan teks, nomor WhatsApp, harga, dan foto produk agar tidak keliru.',
      'Pengecekan kecepatan buka halaman di jaringan 4G dan Wi-Fi.'
    ],
    leftHighlight: 'Klien memegang kendali penuh untuk mencoba website sebelum go-live.',
    rightTitle: 'Penyempurnaan Akhir Bebas Biaya',
    rightSubtitle: 'Memastikan seluruh masukan klien terpenuhi dengan sempurna.',
    rightBoxHeader: 'PENYEMPURNAAN TERAKHIR',
    rightPoints: [
      'Penyesuaian teks, foto produk, atau susunan menu sesuai masukan klien.',
      'Pengujian ulang tombol formulir dan notifikasi pesan.',
      'Pengecekan keamanan sertifikat SSL HTTPS agar website aman dikunjungi.',
      'Persetujuan peluncuran resmi ke domain utama bisnis Anda.'
    ],
    stamp: 'QUALITY ASSURANCE PASSED'
  },
  {
    id: 'stage-5',
    num: '05',
    title: 'Launch & Serah Terima Resmi',
    subtitle: 'Website resmi live di domain Anda, source code diserahkan, garansi 30 hari.',
    phase: 'TAHAP 05: LAUNCH & SERAH TERIMA',
    duration: '1 Hari Kerja',
    leftTitle: 'Peluncuran ke Domain Resmi Klien',
    leftSubtitle: 'Website dihubungkan langsung ke domain pilihan Anda (.com / .id).',
    leftBoxHeader: 'PAKET SERAH TERIMA UNTUK KLIEN',
    leftPoints: [
      'Domain kustom aktif (.com / .id) dengan SSL HTTPS terenkripsi aman.',
      'Akses penuh repositori GitHub (Source Code 100% hak milik Anda).',
      'Video tutorial singkat cara mengubah foto, teks, dan produk sendiri.',
      'Kredensial akun hosting & panduan teknis pengelolaan lengkap.'
    ],
    leftHighlight: '100% kepemilikan penuh di tangan Anda tanpa ikatan ketergantungan.',
    rightTitle: 'Garansi Dukungan Teknis 30 Hari',
    rightSubtitle: 'Pendampingan purna jual agar bisnis Anda dapat beroperasi tanpa khawatir.',
    rightBoxHeader: 'JAMINAN PURNA JUAL RIDZWEB',
    rightPoints: [
      'Bantuan perbaikan bebas biaya jika ada kendala teknis selama 30 hari.',
      'Konsultasi WhatsApp prioritas untuk pertanyaan seputar website.',
      'Monitoring performa server agar website selalu online 24/7.',
      'Sertifikat serah terima resmi: Website 100% siap memajukan bisnis Anda.'
    ],
    stamp: 'SERAH TERIMA RESMI 100%'
  }
];

export const PROCESS_PLATES: ProcessPlate[] = STUDIO_STAGES.map(stage => ({
  id: stage.id,
  number: stage.num,
  title: stage.title,
  subtitle: stage.subtitle,
  phase: stage.phase,
  url: buildPlateSvg(stage),
}));
