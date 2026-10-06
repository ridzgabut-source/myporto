// ── Semua konten halaman sketchbook ──────────────────────────────────────
// Setiap spread = 2 halaman (left + right) yang terlihat bersamaan

export interface Spread {
  id: string;
  leftPage: PageContent;
  rightPage: PageContent;
}

export interface PageContent {
  type:
    | 'cover'
    | 'intro'
    | 'portfolio-1'
    | 'portfolio-2'
    | 'portfolio-3'
    | 'portfolio-4'
    | 'services'
    | 'process'
    | 'pricing'
    | 'contact'
    | 'back-cover'
    | 'divider'
    | 'portfolio-index';
  pageNumber?: number;
}

export interface PortfolioProject {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  url: string;
  tags: string[];
  colorAccent: string;
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'catalog',
    number: 'I',
    title: 'Contoh Catalog',
    category: 'E-Commerce · Katalog',
    year: '2024',
    description:
      'Website katalog produk dengan UI yang bersih dan terstruktur. Navigasi intuitif, tampilan produk grid/list, dan filter kategori yang cepat.',
    url: 'https://contohcatalog.netlify.app/',
    tags: ['React', 'Katalog', 'Responsive'],
    colorAccent: '#5c7a5e',
  },
  {
    id: 'creative-agency',
    number: 'II',
    title: 'Creative Agency',
    category: 'Agency · Studio',
    year: '2024',
    description:
      'Landing page agensi kreatif dengan motion yang dinamis, portofolio yang impresif, dan branding kuat untuk menarik klien premium.',
    url: 'https://creativeagen.netlify.app/',
    tags: ['Animation', 'Landing Page', 'Branding'],
    colorAccent: '#a83c28',
  },
  {
    id: 'barbershop',
    number: 'III',
    title: 'Barbershop',
    category: 'Bisnis Lokal · Booking',
    year: '2024',
    description:
      'Website barbershop profesional dengan booking online real-time, galeri hasil kerja, daftar layanan & harga, dan profil barber.',
    url: 'https://barbershop-xi-eight.vercel.app/',
    tags: ['Booking', 'Local Business', 'Calendar'],
    colorAccent: '#9a6a3e',
  },
  {
    id: 'wedding',
    number: 'IV',
    title: 'Wedding System',
    category: 'Event · Wedding',
    year: '2024',
    description:
      'Platform pemesanan wedding elegan. Kalender interaktif, paket layanan, galeri foto, manajemen tamu, dan konfirmasi otomatis.',
    url: 'https://weddingbookingsistem.vercel.app/',
    tags: ['Wedding', 'Booking', 'Admin Panel'],
    colorAccent: '#6b5c8a',
  },
];

export const SERVICES_DATA = [
  {
    icon: '◈',
    title: 'Landing Page',
    price: 'mulai 500rb',
    desc: 'Satu halaman yang dioptimasi konversi. Ideal untuk campaign, produk baru, atau perkenalan bisnis.',
  },
  {
    icon: '◉',
    title: 'Website Profil',
    price: 'mulai 1.5jt',
    desc: 'Website multi-halaman profesional untuk membangun kredibilitas dan kepercayaan klien.',
  },
  {
    icon: '◐',
    title: 'E-Commerce',
    price: 'mulai 3jt',
    desc: 'Toko online lengkap dengan katalog produk, keranjang belanja, dan integrasi payment gateway.',
  },
  {
    icon: '◑',
    title: 'Booking System',
    price: 'mulai 2jt',
    desc: 'Sistem reservasi online untuk barbershop, restoran, wedding, klinik, dan layanan lainnya.',
  },
];

export const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Brief & Konsultasi',
    duration: '1–2 hari',
    desc: 'Diskusi kebutuhan, referensi, target audiens, dan tujuan website melalui WhatsApp atau meeting online.',
  },
  {
    num: '02',
    title: 'Desain UI/UX',
    duration: '3–5 hari',
    desc: 'Mockup interaktif di Figma. Anda bisa review dan request revisi sebelum koding dimulai.',
  },
  {
    num: '03',
    title: 'Development',
    duration: '5–14 hari',
    desc: 'Koding dengan React/Next.js, optimasi performa, SEO on-page, dan testing di berbagai device.',
  },
  {
    num: '04',
    title: 'Review & Revisi',
    duration: '2–3 hari',
    desc: 'Anda test website secara langsung. Revisi minor gratis hingga puas.',
  },
  {
    num: '05',
    title: 'Launch',
    duration: '1 hari',
    desc: 'Deploy ke domain pilihan Anda. Support teknis 30 hari pasca-launch.',
  },
];
