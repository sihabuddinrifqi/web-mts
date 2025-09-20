'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea untuk alamat
import { WaliSiswa } from '@/types/users';
import { APIResponse } from '@/types/response';
import { FormEventHandler, useState, Dispatch, SetStateAction, useEffect } from 'react';

// Tipe properti untuk komponen
type WaliSiswaFormEditAdminProps = {
    id: number;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    // Callback untuk memicu refresh data di halaman induk
    onUpdateSuccess: () => void;
};

// Tipe data yang dikirim ke server (ditambahkan jenis_kelamin dan alamat)
interface WaliSiswaRequestType {
    name: string;
    phone: string;
    jenis_kelamin: 'pria' | 'wanita';
    alamat: string;
    password?: string; // Password bersifat opsional
}

// [PERBAIKAN] Mendefinisikan ulang tipe respons secara eksplisit
// untuk menghindari error inferensi dari tipe utilitas yang kompleks.
interface WaliSiswaResponse {
    id: number;
    name: string;
    phone: string;
    // Asumsikan properti lain dari WaliSiswa ada di sini jika diperlukan
    
    // Properti yang berbeda atau baru
    jenis_kelamin?: 'pria' | 'wanita' | 'L' | 'P';
    alamat?: string;
}


export default function WaliSiswaFormEditAdmin({ id, open, onOpenChange, onUpdateSuccess }: WaliSiswaFormEditAdminProps) {
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<WaliSiswaRequestType>>({});
    const [data, setData] = useState<WaliSiswaRequestType>({
        name: '',
        phone: '',
        jenis_kelamin: 'pria',
        alamat: '',
        password: '',
    });

    // Fungsi generik untuk memperbarui state 'data'
    const handleSetData = (key: keyof WaliSiswaRequestType, value: any) => {
        setData(prevData => ({ ...prevData, [key]: value }));
    };

    // Fungsi untuk memuat data awal wali siswa
    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = (window as any).route('api.detail.walisiswa', { walisiswa: id });
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Gagal memuat data wali siswa (Status: ${res.status})`);

            const resp: APIResponse<WaliSiswaResponse> = await res.json();
            const wali = resp.data;
            
            // Menyesuaikan data jenis kelamin dari backend
            let jk: 'pria' | 'wanita' = 'pria';
            if (wali.jenis_kelamin === 'wanita' || wali.jenis_kelamin === 'P') {
                jk = 'wanita';
            }

            setData({
                name: wali.name || '',
                phone: wali.phone || '',
                jenis_kelamin: jk,
                alamat: wali.alamat || '',
                password: '', // Kosongkan password saat load
            });
        } catch (error: any) {
            console.error("Gagal mengambil data wali:", error);
            setError(error.message || 'Gagal memuat data awal.');
        } finally {
            setLoading(false);
        }
    };

    // Muat data saat modal dibuka
    useEffect(() => {
        if (open && id) {
            loadInitialData();
        }
    }, [open, id]);

    // Fungsi untuk mengirim data yang sudah diubah
    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        
        const payload: Partial<WaliSiswaRequestType> & { _method: string } = {
            name: data.name,
            phone: data.phone,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            _method: 'PATCH',
        };

        if (data.password) {
            payload.password = data.password;
        }

        try {
            const response = await fetch((window as any).route('admin.walisiswa.update', { walisiswa: id }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 422) {
                const errorData = await response.json();
                setErrors(errorData.errors);
                throw new Error('Data yang diberikan tidak valid.');
            } else if (!response.ok) {
                throw new Error('Server merespons dengan error');
            } else {
                onUpdateSuccess();
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error('Gagal memperbarui data wali siswa:', error);
            setError(error.message || 'Gagal memperbarui data.');
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
                    <DialogTitle>Edit Data Wali Siswa</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi wali siswa. Pastikan semua kolom terisi dengan benar.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center">Memuat data...</div>
                ) : error ? (
                    <div className="py-12 text-center text-red-600">
                        <p className='font-semibold'>Terjadi Kesalahan:</p>
                        <p className="text-sm">{error}</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={loadInitialData}>Coba Lagi</Button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4 pt-4">
                        {/* Nama Lengkap */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="edit-wali-nama" className="font-medium">Nama Lengkap</label>
                            <Input id="edit-wali-nama" placeholder="Masukan nama lengkap" value={data.name} onChange={(e) => handleSetData('name', e.target.value)} required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="edit-wali-jk" className="font-medium">Jenis Kelamin</label>
                            <Select value={data.jenis_kelamin} onValueChange={(val) => handleSetData('jenis_kelamin', val as 'pria' | 'wanita')} required>
                                <SelectTrigger id="edit-wali-jk"><SelectValue placeholder="Pilih Jenis Kelamin" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pria">Pria</SelectItem>
                                    <SelectItem value="wanita">Wanita</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
                        </div>

                        {/* Alamat */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="edit-wali-alamat" className="font-medium">Alamat</label>
                            <Textarea id="edit-wali-alamat" placeholder="Masukan alamat lengkap" value={data.alamat} onChange={(e) => handleSetData('alamat', e.target.value)} required />
                            {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                        </div>
                        
                        {/* Nomor Telepon */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="edit-wali-phone" className="font-medium">Nomor Telepon</label>
                            <Input id="edit-wali-phone" placeholder="Masukan nomor telepon" value={data.phone} onChange={(e) => handleSetData('phone', e.target.value)} required />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="edit-wali-password" className="font-medium">Reset Password (Opsional)</label>
                            <Input id="edit-wali-password" type="password" placeholder="Isi untuk mengubah password" value={data.password || ''} onChange={(e) => handleSetData('password', e.target.value)} />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>
                        
                        <DialogFooter className="pt-4">
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

