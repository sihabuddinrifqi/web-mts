'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SiswaRequestType, Siswa } from '@/types/admin/siswa';
import { APIPaginateResponse, APIResponse } from '@/types/response';
import { WaliSiswa } from '@/types/users';
import { Guru } from '@/types/walisiswa/anak';
import { FormEventHandler, useState, Dispatch, SetStateAction } from 'react';

type SiswaFormEditAdminProps = {
    id: number;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export default function SiswaFormEditAdmin({ id, open, onOpenChange }: SiswaFormEditAdminProps) {
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<SiswaRequestType>>({});
    const [data, setData] = useState<SiswaRequestType>({
        name: '',
        nik: '',
        alamat: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        angkatan: new Date().getFullYear(),
        jenis_kelamin: 'pria',
        siswa_role: 'regular',
        guru_id: -1,
        ortu_id: -1,
    });

    const [dataWali, setDataWali] = useState<WaliSiswa[]>([]);
    const [dataGuru, setDataGuru] = useState<Guru[]>([]);

    const handleSetData = (key: keyof SiswaRequestType, value: any) => {
        setData(prevData => ({ ...prevData, [key]: value }));
    };

    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            // FIX: Pass the 'id' as an object with a key matching the route parameter name ('siswa').
            const [siswaRes, guruRes, waliRes] = await Promise.all([
                fetch(route('api.detail.siswa', { siswa: id })),
                fetch('/api/guru'),
                fetch('/api/walisiswa')
            ]);

            if (!siswaRes.ok) throw new Error(`Gagal memuat data siswa (Status: ${siswaRes.status})`);
            if (!guruRes.ok) throw new Error(`Gagal memuat data guru (Status: ${guruRes.status})`);
            if (!waliRes.ok) throw new Error(`Gagal memuat data wali (Status: ${waliRes.status})`);

            const siswaResp: APIResponse<Siswa> = await siswaRes.json();
            const guruResp: APIPaginateResponse<Guru> = await guruRes.json();
            const waliResp: APIPaginateResponse<WaliSiswa> = await waliRes.json();

            setDataGuru(guruResp.data);
            setDataWali(waliResp.data);

            const siswa = siswaResp.data;
            const formattedDate = siswa.tanggal_lahir ? new Date(siswa.tanggal_lahir).toISOString().split('T')[0] : '';
            setData({
                name: siswa.name || '',
                nik: String(siswa.nik || ''),
                alamat: siswa.alamat || '',
                tempat_lahir: siswa.tempat_lahir || '',
                tanggal_lahir: formattedDate,
                angkatan: siswa.angkatan || new Date().getFullYear(),
                jenis_kelamin: siswa.jenis_kelamin || 'pria',
                siswa_role: siswa.siswa_role || 'regular',
                guru_id: siswa.guru_id || -1,
                ortu_id: siswa.ortu_id || -1,
            });

        } catch (error: any) {
            console.error("Gagal mengambil data:", error);
            setError(error.message || 'Gagal memuat data awal.');
        } finally {
            setLoading(false);
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

        try {
            // FIX: Also pass the 'id' as an object for the update route.
            const response = await fetch(route('admin.siswa.update', { siswa: id }), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 422) {
                const errorData = await response.json();
                setErrors(errorData.errors);
            } else if (!response.ok) {
                throw new Error('Server responded with an error');
            } else {
                onOpenChange(false);
            }
        } catch (error) {
            console.error('Gagal memperbarui data siswa:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={loadInitialData}
            >
                <DialogHeader>
                    <DialogTitle>Edit Data Siswa</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi siswa sesuai data terbaru. Pastikan semua kolom terisi dengan benar.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center">Memuat data...</div>
                ) : error ? (
                    <div className="py-12 text-center text-red-600">
                        <p>Terjadi Kesalahan:</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        <div className="space-y-4 py-4">
                            {/* NIK */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="edit-nik" className="font-medium">NIK</label>
                                <Input id="edit-nik" placeholder="Masukan NIK" value={data.nik} onChange={(e) => handleSetData('nik', e.target.value)} required />
                                {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
                            </div>

                            {/* Nama & Jenis Kelamin */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-nama" className="font-medium">Nama Lengkap</label>
                                    <Input id="edit-nama" placeholder="Masukan nama lengkap" value={data.name} onChange={(e) => handleSetData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-jenisKelamin" className="font-medium">Jenis Kelamin</label>
                                    <Select value={data.jenis_kelamin} onValueChange={(val) => handleSetData('jenis_kelamin', val as 'pria' | 'wanita')} required>
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
                                    <label htmlFor="edit-tempatLahir" className="font-medium">Tempat Lahir</label>
                                    <Input id="edit-tempatLahir" placeholder="Masukan Tempat Lahir" value={data.tempat_lahir} onChange={(e) => handleSetData('tempat_lahir', e.target.value)} required />
                                    {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-tanggalLahir" className="font-medium">Tanggal Lahir</label>
                                    <Input type="date" id="edit-tanggalLahir" value={data.tanggal_lahir} className="block w-full" onChange={(e) => handleSetData('tanggal_lahir', e.target.value)} required />
                                    {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>}
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="edit-alamat" className="font-medium">Alamat</label>
                                <Textarea id="edit-alamat" placeholder="Masukan alamat lengkap" rows={3} value={data.alamat} onChange={(e) => handleSetData('alamat', e.target.value)} required />
                                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                            </div>

                            {/* Angkatan & Peran */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-angkatan" className="font-medium">Angkatan</label>
                                    <Input id="edit-angkatan" placeholder="Contoh: 2025" type="number" value={data.angkatan.toString()} onChange={(e) => handleSetData('angkatan', parseInt(e.target.value))} required />
                                     {errors.angkatan && <p className="text-sm text-red-500">{errors.angkatan}</p>}
                               </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-peran" className="font-medium">Peran</label>
                                    <Select value={data.siswa_role} onValueChange={(ev) => handleSetData('siswa_role', ev as 'regular' | 'pengurus')} required>
                                        <SelectTrigger><SelectValue placeholder="Regular" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="regular">Regular</SelectItem>
                                            <SelectItem value="pengurus">Pengurus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Guru & Wali */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="edit-guru" className="font-medium">Guru Pembimbing</label>
                                    <Select value={data.guru_id?.toString()} onValueChange={(value) => handleSetData('guru_id', parseInt(value))} required>
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
                                    <label htmlFor="edit-wali" className="font-medium">Nama Orang Tua / Wali</label>
                                    <Select value={data.ortu_id?.toString()} onValueChange={(value) => handleSetData('ortu_id', parseInt(value))} required>
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
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
