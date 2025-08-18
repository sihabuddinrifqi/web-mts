import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        // Latar belakang utama diatur di sini untuk bagian paling bawah
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
            <Head title="Login" />
            
            {/* Latar Belakang - Bagian Hijau (Sekarang menjadi wadah) */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 w-full bg-emerald-700" />

            {/* Latar Belakang - Gambar Separuh Atas */}
            <div className="absolute inset-x-0 top-0 h-1/2 w-full">
                <img
                    src="/background.jpg" 
                    className="h-full w-full object-cover"
                    alt="Suasana MTs Ash-Sholihin"
                />
                <div className="absolute inset-0 bg-black/70"></div>
            </div>

            {/* Gelombang Hijau (Pemisah Atas) */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 transform">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 1440 190" 
                    className="w-full"
                >
                    <path 
                        fill="#047857" // Warna emerald-700
                        d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,85.3C672,96,768,96,864,85.3C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,190L0,190Z"
                    ></path>
                </svg>
            </div>

            {/* 👇 1. GELOMBANG PUTIH BARU (Pemisah Bawah) 👇 */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 1440 120"
                    className="relative block w-full h-[90px] sm:h-[120px]"
                >
                    <path 
                        fill="#ffffff" // Warna putih, sesuai latar belakang di bawahnya
                        // Filter untuk drop shadow, agar bayangan mengikuti lekukan
                        style={{ filter: 'drop-shadow(0 -8px 6px rgba(0,0,0,0.1))' }}
                        // Path dengan bentuk yang sedikit berbeda
                        d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,121L0,121Z"
                    ></path>
                </svg>
            </div>

            {/* Konten Utama (Layout Terbelah) */}
            <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between p-9">
                
                {/* Sisi Kiri - Teks Ajakan dengan Shadow yang Lebih Jelas */}
                <div className="hidden lg:block lg:w-1/2 text-white pr-12">
                    {/* 👇 2. SHADOW DITINGKATKAN MENJADI 'drop-shadow-lg' 👇 */}
                    <h1 className="text-5xl xl:text-6xl font-bold leading-tight drop-shadow-lg">
                        Sistem Informasi MTs Ash-Sholihin
                    </h1>
                    {/* 👇 2. SHADOW DITINGKATKAN MENJADI 'drop-shadow-md' 👇 */}
                    <p className="mt-4 text-lg xl:text-xl text-white/80 drop-shadow-md">
                        Masuk untuk mengakses dashboard, melihat nilai, dan informasi penting lainnya.
                    </p>
                </div>

                {/* Sisi Kanan - Kartu Form Login */}
                <div className="w-full max-w-md lg:w-1/2 mx-9">
                    <div className="space-y-6 rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md backdrop-filter">
                        {/* ... (Isi form tidak perlu diubah) ... */}
                        <div className="text-center">
                            <img src="/logo.png" className="mx-auto w-20 h-20 object-contain mb-4" alt="Logo" />
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Selamat Datang</h1>
                            <p className="mt-2 text-sm text-gray-600">Silakan masuk untuk melanjutkan</p>
                        </div>
                        {status && (
                            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">{status}</div>
                        )}
                        <form className="space-y-6" onSubmit={submit}>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" 
                                //type="email" 
                                value={data.email} onChange={(e) => setData('email', e.target.value)} required autoFocus />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" checked={data.remember} onCheckedChange={(checked) => setData('remember', !!checked)} />
                                    <Label htmlFor="remember">Ingat saya</Label>
                                </div>
                                {canResetPassword && (<TextLink href={route('password.request')}>Lupa kata sandi?</TextLink>)}
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Masuk
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}