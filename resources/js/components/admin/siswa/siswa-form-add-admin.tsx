'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SiswaRequestType } from '@/types/admin/siswa';
import { APIPaginateResponse } from '@/types/response';
import { WaliSiswa } from '@/types/users';
import { Guru } from '@/types/walisiswa/anak';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function SiswaFormAddAdmin() {
    const { data, setData, post, processing, errors, reset } = useForm<SiswaRequestType>({
        name: '',
        nik: '',
        alamat: '',
        tempat_lahir: '',
        tanggal_lahir: '', // Dikosongkan agar user yang mengisi
        angkatan: new Date().getFullYear(),
        jenis_kelamin: 'pria',
        siswa_role: 'regular',
        guru_id: -1,
        ortu_id: -1,
    });

    const [open, setOpen] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.siswa.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
                // Toast notification logic removed to resolve module error.
                // You can add your preferred notification method here.
            },
            onError: () => {
                // Error handling logic can be added here.
            },
        });
    };

    const [dataWali, setDataWali] = useState<WaliSiswa[]>([]);
    const [dataGuru, setDataGuru] = useState<Guru[]>([]);

    useEffect(() => {
        if (open) {
            // Menggunakan fetch standar browser untuk mengambil data
            fetch('/api/guru')
                .then(res => res.json())
                .then((resp: APIPaginateResponse<Guru>) => setDataGuru(resp.data));
            fetch('/api/walisiswa')
                .then(res => res.json())
                .then((resp: APIPaginateResponse<WaliSiswa>) => setDataWali(resp.data));
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus /> Tambah Siswa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Data Siswa Baru</DialogTitle>
                        <DialogDescription>
                            Silakan isi formulir di bawah ini untuk menambahkan siswa baru ke dalam sistem. Pastikan seluruh data diisi dengan benar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* NIK */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nik" className="font-medium">NIK</label>
                            <Input
                                id="nik"
                                placeholder="Masukan 16 digit NIK"
                                value={data.nik}
                                onChange={(ev) => setData('nik', ev.target.value)}
                                maxLength={16}
                                minLength={16}
                                required
                            />
                            {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
                        </div>

                        {/* Nama & Jenis Kelamin */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama" className="font-medium">Nama Lengkap</label>
                                <Input id="nama" placeholder="Masukan nama lengkap" value={data.name} onChange={(ev) => setData('name', ev.target.value)} required />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="jenisKelamin" className="font-medium">Jenis Kelamin</label>
                                <Select value={data.jenis_kelamin} onValueChange={(ev) => setData('jenis_kelamin', ev as 'pria' | 'wanita')} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pria">Pria</SelectItem>
                                        <SelectItem value="wanita">Wanita</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tempat & Tanggal Lahir */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                             <div className="flex flex-col space-y-2">
                                <label htmlFor="tempatLahir" className="font-medium">Tempat Lahir</label>
                                <Input id="tempatLahir" placeholder="Masukan Tempat Lahir" value={data.tempat_lahir} onChange={(ev) => setData('tempat_lahir', ev.target.value)} required />
                                {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tanggalLahir" className="font-medium">Tanggal Lahir</label>
                                <Input type="date" id="tanggalLahir" value={data.tanggal_lahir} className="block w-full" onChange={(ev) => setData('tanggal_lahir', ev.target.value)} required />
                                {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>}
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="alamat" className="font-medium">Alamat</label>
                            <Textarea id="alamat" placeholder="Masukan alamat lengkap" rows={3} value={data.alamat} onChange={(ev) => setData('alamat', ev.target.value)} required />
                            {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                        </div>

                        {/* Angkatan & Peran */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="angkatan" className="font-medium">Angkatan</label>
                                <Input id="angkatan" placeholder="Contoh: 2025" type="number" value={data.angkatan} onChange={(ev) => setData('angkatan', parseInt(ev.target.value))} required />
                                 {errors.angkatan && <p className="text-sm text-red-500">{errors.angkatan}</p>}
                           </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="peran" className="font-medium">Jalur</label>
                                <Select value={data.siswa_role} onValueChange={(ev) => setData('siswa_role', ev as 'regular' | 'pengurus')} required>
                                    <SelectTrigger><SelectValue placeholder="Regular" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="beasiswa">Beasiswa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Guru & Wali */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="guru" className="font-medium">Wali Kelas</label>
                                <Select value={data.guru_id.toString()} onValueChange={(value) => setData('guru_id', parseInt(value))} required>
                                    <SelectTrigger><SelectValue placeholder="Cari dan pilih guru..." /></SelectTrigger>
                                    <SelectContent>
                                        {dataGuru.map((guru) => (
                                            <SelectItem key={guru.id} value={guru.id.toString()}>{guru.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.guru_id && <p className="text-sm text-red-500">{errors.guru_id}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="wali" className="font-medium">Nama Orang Tua / Wali</label>
                                <Select value={data.ortu_id.toString()} onValueChange={(value) => setData('ortu_id', parseInt(value))} required>
                                     <SelectTrigger><SelectValue placeholder="Cari dan pilih wali..." /></SelectTrigger>
                                     <SelectContent>
                                        {dataWali.map((wali) => (
                                            <SelectItem key={wali.id} value={wali.id.toString()}>{wali.name}</SelectItem>
                                        ))}
                                     </SelectContent>
                                </Select>
                                {errors.ortu_id && <p className="text-sm text-red-500">{errors.ortu_id}</p>}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
