import React from 'react';

export default function PendaftaranSection() {
  return (
    // 1. Hapus bg-emerald-700, pastikan 'relative' ada
    <section className="relative overflow-hidden ">
      
      {/* 2. Tambahkan <img> sebagai background dan overlay */}
      <div className="absolute inset-0">
        <img
          src="/bgdaftar.png" // Pastikan gambar ada di folder /public/
          alt="Latar belakang pendaftaran"
          className="w-full h-full object-cover"
        />
        {/* Lapisan overlay gelap agar teks lebih kontras */}
        <div className="absolute inset-0" />
      </div>

      {/* Konten (tidak berubah, z-10 membuatnya tetap di depan) */}
      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Sisi Kiri - Semua Teks dan Tombol */}
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-md">
              Bergabunglah dengan Keluarga Besar <br className="hidden lg:block"/> MTs Ash-Sholihin.
            </h1>
            <p className="text-white text-lg lg:text-xl font-light leading-relaxed mb-8 drop-shadow">
              Dapatkan pendidikan berkualitas yang mengintegrasikan ilmu pengetahuan umum dan agama. 
            </p>
            <div className="text-center lg:text-left">
              <button className="bg-white text-emerald-700 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Daftar Sekarang
              </button>
            </div>
          </div>

          {/* Sisi Kanan - Dikosongkan untuk visual/gambar ilustrasi */}
          <div className="lg:w-1/2">
             {/* Di sini Anda bisa menempatkan tag <img> untuk ilustrasi */}
          </div>

        </div>
      </div>
    </section>
  );
}