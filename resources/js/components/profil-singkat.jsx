import React, { useState, useEffect, useRef } from 'react';

export default function ProfilSingkat() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.cardIndex);
            setVisibleCards(prev => new Set([...prev, cardIndex]));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const setCardRef = (index) => (el) => {
    cardRefs.current[index] = el;
  };
    return (
    <section className="items-center justify-center about py-12 sm:py-16 lg:py-20 bg-gray-50"> 
      <div className="container mx-auto px-4">
        <h1
          data-aos="fade-up"
          className="lg:text-4xl font-bold font-sans text-center text-3xl text-gray-800"
        >
          Mengapa Perlu Sekolah di <span className="text-emerald-700">MTs Ash-Sholihin</span>?
        </h1>
        
        {/* Baris pertama kartu */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-12">
          {/* Card 1 */}
          <div 
            ref={setCardRef(0)}
            data-card-index="0"
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-700 transform ${
              visibleCards.has(0) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="text-center mb-4">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kurikulum Terintegrasi</h3>
              <p className="text-gray-600 text-sm">
                Menggabungkan pendidikan umum dan agama dengan kurikulum yang komprehensif.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            ref={setCardRef(1)}
            data-card-index="1"
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-700 transform ${
              visibleCards.has(1) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="text-center mb-4">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tenaga Pengajar Berkualitas</h3>
              <p className="text-gray-600 text-sm">
                Didukung oleh guru-guru berpengalaman dan berdedikasi tinggi yang siap membimbing siswa mencapai prestasi terbaik.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            ref={setCardRef(2)}
            data-card-index="2"
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-700 transform ${
              visibleCards.has(2) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="text-center mb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 5h10M7 8h10m-10 4h10m-10 4h7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fasilitas Lengkap</h3>
              <p className="text-gray-600 text-sm">
                Tersedia fasilitas modern seperti laboratorium, perpustakaan, masjid, dan area olahraga untuk mendukung kegiatan belajar mengajar.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Cards tambahan di bawah */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-8">
          {/* Card 4 */}
          <div 
            ref={setCardRef(3)}
            data-card-index="3"
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-700 transform ${
              visibleCards.has(3) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="text-center mb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prestasi Akademik</h3>
              <p className="text-gray-600 text-sm">
                Siswa-siswi MTs Ash-Sholihin secara konsisten meraih prestasi gemilang dalam berbagai kompetisi akademik tingkat daerah dan nasional.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div 
            ref={setCardRef(4)}
            data-card-index="4"
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-700 transform ${
              visibleCards.has(4) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="text-center mb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lingkungan Islami</h3>
              <p className="text-gray-600 text-sm">
                Suasana sekolah yang kondusif dengan nilai-nilai Islam, menciptakan karakter siswa yang berakhlak mulia dan bertakwa kepada Allah SWT.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div 
            ref={setCardRef(5)}
            data-card-index="5"
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-700 transform ${
              visibleCards.has(5) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="text-center mb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ekstrakurikuler Beragam</h3>
              <p className="text-gray-600 text-sm">
                Tersedia berbagai kegiatan ekstrakurikuler seperti tahfidz, pramuka, olahraga, dan seni untuk mengembangkan bakat dan minat siswa.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}