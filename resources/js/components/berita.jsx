import React from 'react';

// 1. Data dipindahkan ke luar komponen agar tidak dibuat ulang setiap render
const beritaData = [
  {
    id: 1,
    judul: "Siswa MTs Ash-Sholihin Juara 1 Lomba Tahfidz Tingkat Provinsi",
    foto: "/background.jpg",
    tanggal: "15 Juli 2025",
    kategori: "Prestasi",
    slug: "juara-1-lomba-tahfidz" // Tambahkan slug untuk URL
  },
  {
    id: 2,
    judul: "Kegiatan Pesantren Ramadan 1446 H di MTs Ash-Sholihin",
    foto: "/background.jpg",
    tanggal: "28 Juni 2025",
    kategori: "Kegiatan",
    slug: "pesantren-ramadan-1446h"
  },
  {
    id: 3,
    judul: "Penerimaan Siswa Baru Tahun Ajaran 2025/2026 Dibuka",
    foto: "/background.jpg", // Pastikan path ke gambar lokal benar
    tanggal: "1 Juni 2025",
    kategori: "Pengumuman",
    slug: "penerimaan-siswa-baru-2025"
  },
];

// Fungsi untuk menentukan warna kategori tetap sama
const getKategoriColor = (kategori) => {
  switch (kategori) {
    case 'Prestasi': return 'bg-yellow-100 text-yellow-800';
    case 'Kegiatan': return 'bg-blue-100 text-blue-800';
    case 'Pengumuman': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function BeritaCards() {
  return (
    // 2. Padding vertikal dibuat responsif agar tidak terlalu besar di mobile
    <section className="py-12 sm:py-16 lg:py-20 h-screen bg-gray-50">
      
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          {/* 3. Ukuran font judul dibuat responsif */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Berita Terkini
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Ikuti perkembangan terbaru kegiatan dan prestasi siswa-siswi MTs Ash-Sholihin
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 md:gap-8">
          
          {beritaData.map((berita) => (
            // 4. Seluruh kartu dibungkus dengan tag <a> agar bisa diklik
            <a 
              href={`/berita/${berita.slug}`} 
              key={berita.id} 
              className="group bg-white rounded-lg shadow-lg overflow-hidden block hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={berita.foto}
                  alt={berita.judul}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getKategoriColor(berita.kategori)}`}>
                    {berita.kategori}
                  </span>
                </div>
              </div>

              {/* 5. Padding konten kartu dibuat responsif */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {berita.tanggal}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200">
                  {berita.judul}
                </h3>

                <div className="inline-flex items-center text-emerald-700 group-hover:text-emerald-800 font-medium text-sm transition-colors duration-200">
                  Baca Selengkapnya
                  <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12 lg:mt-16">
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Lihat Berita Lainnya
          </button>
        </div>
      </div>
      
    </section>
  );
}