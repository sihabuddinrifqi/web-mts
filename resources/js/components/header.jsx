import React, { useState, useEffect } from 'react';

// 1. Definisikan gambar-gambar Anda di sini
const backgroundImages = [
  'background.jpg',
  'background1.jpg', 
  'background2.jpg',
  'background3.jpg',
];

export default function Header() {

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? backgroundImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // FUNGSI BARU: Pindah ke slide berikutnya
  const goToNext = () => {
    const isLastSlide = currentIndex === backgroundImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };


  // useEffect untuk membuat slider berjalan otomatis
  useEffect(() => {
    // MODIFIKASI: Tambahkan currentIndex ke dependency array.
    // Ini akan me-reset timer setiap kali slide diganti (baik otomatis maupun manual)
    const interval = setInterval(() => {
      goToNext(); // Menggunakan fungsi goToNext agar logika terpusat
    }, 4000);

    // Membersihkan interval saat komponen tidak lagi ditampilkan atau saat currentIndex berubah
    return () => clearInterval(interval);
  }, [currentIndex]); // <--- MODIFIKASI PENTING DI SINI


  return (
    <header className="relative h-screen overflow-hidden">
      
      {/* Wrapper untuk semua slide gambar */}
      <div
        className="absolute inset-0 flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
      </div>
      
      {/* Lapisan overlay gelap */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.60)' }}></div>

      {/* Konten teks */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Membentuk Generasi Cerdas & Berakhlak Mulia
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Selamat datang di portal resmi MTs Ash-Sholihin. Temukan informasi terbaru seputar kegiatan belajar mengajar dan prestasi siswa kami.
        </p>
      </div>
      
      {/* ELEMEN BARU: Tombol Navigasi Kiri & Kanan */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button 
          onClick={goToPrevious}
          className="bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button 
          onClick={goToNext}
          className="bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

    </header>
  );
}