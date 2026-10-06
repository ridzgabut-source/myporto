export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  demo: string;
  github?: string;
  technologies: string[];
  features: string[];
  problem: string;
  solution: string;
  challenge: string;
  color: string;
  kind: string;
  cover?: string;
}
export const projects: Project[] = [
  {
    slug: 'cleancraft-laundry',
    title: 'CleanCraft Laundry',
    category: 'Frontend',
    year: '2026',
    description:
      'Mockup website laundry dengan pilihan layanan, jadwal pickup, dan pelacakan cucian dalam satu pengalaman yang jelas.',
    demo: 'https://laundrymockup.netlify.app/',
    technologies: ['Responsive UI', 'Booking flow', 'Order tracking'],
    features: [
      'Katalog layanan dan harga',
      'Alur penjadwalan pickup',
      'Halaman pelacakan cucian',
      'Antarmuka portal admin',
    ],
    problem:
      'Pelanggan membutuhkan cara yang mudah untuk memilih perawatan pakaian dan mengetahui langkah berikutnya tanpa percakapan yang berulang.',
    solution:
      'Antarmuka CleanCraft menghubungkan informasi layanan, booking pickup, dan pelacakan pesanan melalui navigasi yang konsisten.',
    challenge:
      'Menyusun harga, durasi layanan, dan proses pickup agar mudah dipahami di layar kecil, sambil menjaga karakter visual editorial.',
    color: '#d5dfc1',
    kind: 'laundry',
    cover: '/projects/laundry.jpg',
  },
  {
    slug: 'catalog',
    title: 'Contoh Catalog',
    category: 'Frontend',
    year: '2024',
    description:
      'Etalase digital yang membuat produk mudah ditemukan dan pesanan mudah dimulai.',
    demo: 'https://contohcatalog.netlify.app/',
    technologies: ['React', 'Responsive UI'],
    features: ['Filter kategori', 'Detail produk', 'WhatsApp checkout'],
    problem:
      'Bisnis membutuhkan katalog yang terstruktur dan mudah dijelajahi di perangkat mobile.',
    solution:
      'Antarmuka katalog dengan filter kategori, detail produk, dan alur menuju pemesanan.',
    challenge:
      'Menjaga navigasi dan keterbacaan katalog pada berbagai ukuran layar.',
    color: '#b7cf8b',
    kind: 'catalog',
  },
  {
    slug: 'creative-agency',
    title: 'Creative Agency',
    category: 'Frontend',
    year: '2024',
    description:
      'Identitas digital untuk studio kreatif. Tipografi ekspresif, motion, dan karya sebagai pusat perhatian.',
    demo: 'https://creativeagen.netlify.app/',
    technologies: ['Motion UI', 'Responsive UI'],
    features: ['Showcase portofolio', 'Tipografi ekspresif', 'Interaksi hover'],
    problem:
      'Agensi kreatif membutuhkan identitas visual yang kuat untuk memperkenalkan layanan dan karya.',
    solution:
      'Landing page yang menghubungkan branding, showcase, dan call to action.',
    challenge:
      'Menyeimbangkan animasi dengan keterbacaan dan kenyamanan navigasi.',
    color: '#aeacf4',
    kind: 'agency',
  },
  {
    slug: 'barbershop',
    title: 'Barbershop Booking',
    category: 'Full Stack',
    year: '2024',
    description:
      'Dari memilih gaya hingga memilih jadwal. Pengalaman reservasi untuk bisnis lokal.',
    demo: 'https://barbershop-xi-eight.vercel.app/',
    technologies: ['Booking', 'Calendar', 'Responsive UI'],
    features: ['Pemilihan jadwal', 'Layanan dan harga', 'Galeri gaya rambut'],
    problem:
      'Pelanggan perlu menemukan layanan dan jadwal dalam satu pengalaman yang jelas.',
    solution:
      'Website barbershop dengan katalog layanan, galeri, dan alur reservasi online.',
    challenge:
      'Menyampaikan pilihan layanan dan waktu secara sederhana untuk pengguna mobile.',
    color: '#cdaf86',
    kind: 'barber',
  },
  {
    slug: 'wedding',
    title: 'Wedding Booking System',
    category: 'Full Stack',
    year: '2024',
    description:
      'Pengalaman pemesanan wedding yang menyatukan paket, tanggal acara, dan konfirmasi tamu.',
    demo: 'https://weddingbookingsistem.vercel.app/',
    technologies: ['Booking', 'RSVP', 'Admin Panel'],
    features: ['Kalender acara', 'Paket wedding', 'Konfirmasi tamu'],
    problem:
      'Informasi paket, tanggal, dan tamu sering tersebar dalam banyak percakapan.',
    solution:
      'Platform booking dengan pilihan paket, kalender, dan alur konfirmasi.',
    challenge:
      'Menyusun informasi acara yang kompleks menjadi pengalaman pemesanan yang mudah.',
    color: '#d6a8b8',
    kind: 'wedding',
  },
];
