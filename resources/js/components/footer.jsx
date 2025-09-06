import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// --- 1. DATA DIPISAHKAN ---
// Semua informasi sekarang ada di sini, mudah untuk diubah.
const contactInfo = {
    alamat: "Yayasan Ash-Sholihin, Kemiri, Bumiroso, Watumalang, Wonosobo, Jawa Tengah 56352",
    telepon: "+62 286 321234",
    email: "info@mts-ashsholihin.sch.id",
    jamOperasional: [
        "Senin - Jumat: 07:00 - 15:00",
        "Sabtu: 07:00 - 12:00",
        "Minggu: Tutup"
    ]
};

const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
];

const footerNavLinks = [
    { href: '#', text: 'Kebijakan Privasi' },
    { href: '#', text: 'Syarat & Ketentuan' },
    { href: '#', text: 'Bantuan' },
];

// --- 2. KOMPONEN KECIL DIBUAT ---
// Komponen kecil untuk menampilkan item kontak agar tidak berulang
const ContactItem = ({ icon: Icon, title, children }) => (
    <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 text-emerald-700 mt-1 flex-shrink-0" />
        <div>
            <p className="font-medium text-gray-800">{title}</p>
            <div className="text-gray-600 text-sm">{children}</div>
        </div>
    </div>
);

export default function Footer() {
    return (
        <footer className="bg-white border-t-2 border-emerald-700">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* === BAGIAN KIRI: INFORMASI & SOSIAL MEDIA === */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-emerald-700 mb-2">Hubungi Kami</h2>
                            <div className="w-20 h-1 bg-emerald-700"></div>
                        </div>
                        <div className="space-y-6">
                            <ContactItem icon={MapPin} title="Alamat">
                                <p>{contactInfo.alamat}</p>
                            </ContactItem>
                            <ContactItem icon={Phone} title="Telepon">
                                <a href={`tel:${contactInfo.telepon}`} className="hover:text-emerald-700">{contactInfo.telepon}</a>
                            </ContactItem>
                            <ContactItem icon={Mail} title="Email">
                                <a href={`mailto:${contactInfo.email}`} className="hover:text-emerald-700">{contactInfo.email}</a>
                            </ContactItem>
                            <ContactItem icon={Clock} title="Jam Operasional">
                                {contactInfo.jamOperasional.map((jam, index) => <p key={index}>{jam}</p>)}
                            </ContactItem>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 mb-3">Ikuti Kami</p>
                            <div className="flex space-x-3">
                                {socialLinks.map(({ href, icon: Icon, label }) => (
                                    <a 
                                      key={label}
                                      href={href} 
                                      aria-label={label}
                                      className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-800 transition-colors"
                                    >
                                        <Icon className="w-5 h-5 text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* === BAGIAN KANAN: PETA LOKASI === */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Lokasi Kami</h3>
                        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border-2 border-emerald-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10478.235429951164!2d109.88438250552959!3d-7.351050811467986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa1f877e92079%3A0x8597970812393f53!2sYAYASAN%20ASH-SHOLIHIN%20KEMIRI!5e1!3m2!1sid!2sid!4v1757134651385!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Lokasi Yayasan Ash-Sholihin"
                            ></iframe>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            Klik pada peta untuk membuka di Google Maps
                        </p>
                    </div>
                </div>
            </div>

            {/* === BAGIAN PALING BAWAH: COPYRIGHT === */}
            <div className="border-t border-emerald-200 bg-emerald-50">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-gray-600 text-sm">
                                © {new Date().getFullYear()} MTs Ash-Sholihin. Hak Cipta Dilindungi.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end space-x-6">
                            {footerNavLinks.map(({ href, text }) => (
                                <a key={text} href={href} className="text-emerald-700 hover:text-emerald-800 text-sm transition-colors">
                                    {text}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};