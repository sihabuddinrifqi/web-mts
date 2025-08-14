import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Header from '@/components/Header';
import ProfilSingkat from '@/components/profil-singkat';
import Berita from '@/components/berita';
import Pendaftaran from '@/components/pendaftaran';
import Footer from '@/components/footer';

export default function Welcome() {
  return (
    <>
      <Head title="MTs Ash-Sholihin" />
      
      <Navbar />
      
      <Header />

      <ProfilSingkat />
      
      <Berita />
      
      <Pendaftaran />

      <Footer />

    </>
  );
}