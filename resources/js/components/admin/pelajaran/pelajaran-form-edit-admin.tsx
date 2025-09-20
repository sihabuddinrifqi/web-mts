'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Guru } from '@/types/walisiswa/anak';
import { APIPaginateResponse, APIResponse } from '@/types/response';
import { FormEventHandler, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

// Tipe data pelajaran dari API
interface Pelajaran {
    id: number;
    nama_pelajaran: string;
    pengampu_id: number;
    semester: number;
    angkatan: string;
}

// Tipe data yang dikirim ke server
// [PERBAIKAN 2] Menambahkan index signature untuk memenuhi constraint 'FormDataType' dari Inertia
interface PelajaranRequestType {
    nama_pelajaran: string;
    pengampu_id: number;
    semester: number;
    angkatan: string;
    [key: string]: any; // Menambahkan ini untuk kompatibilitas
}

// [PERBAIKAN 1] Menambahkan kembali onUpdateSuccess ke dalam props
type PelajaranFormEditAdminProps = {
    id: number;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    onUpdateSuccess: () => void;
};

export default function PelajaranFormEditAdmin({ id, open, onOpenChange, onUpdateSuccess }: PelajaranFormEditAdminProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dataGuru, setDataGuru] = useState<Guru[]>([]);

    const { data, setData, patch, processing, errors, reset } = useForm<PelajaranRequestType>({
        nama_pelajaran: '',
        pengampu_id: -1,
        semester: 1,
        angkatan: '',
    });

    // Fungsi untuk memuat data awal (hanya dijalankan saat modal dibuka)
    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            const pelajaranUrl = (window as any).route('api.detail.pelajaran', { pelajaran: id });
            const guruUrl = (window as any).route('api.guru');

            const [pelajaranRes, guruRes] = await Promise.all([
                fetch(pelajaranUrl),
                fetch(guruUrl)
            ]);

            if (!pelajaranRes.ok) throw new Error(`Gagal memuat data pelajaran (Status: ${pelajaranRes.status})`);
            if (!guruRes.ok) throw new Error(`Gagal memuat data guru (Status: ${guruRes.status})`);

            const pelajaranResp: APIResponse<Pelajaran> = await pelajaranRes.json();
            const guruResp: APIPaginateResponse<Guru> = await guruRes.json();

            setDataGuru(guruResp.data);
            
            setData({
                nama_pelajaran: pelajaranResp.data.nama_pelajaran || '',
                pengampu_id: pelajaranResp.data.pengampu_id || -1,
                semester: pelajaranResp.data.semester || 1,
                angkatan: pelajaranResp.data.angkatan || '',
            });

        } catch (error: any) {
            setError(error.message || 'Gagal memuat data awal.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (open && id) {
            loadInitialData();
        }
    }, [open, id]);

    // Fungsi submit menggunakan metode 'patch' dari useForm
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch((window as any).route('admin.pelajaran.update', { pelajaran: id }), {
            onSuccess: () => {
                onUpdateSuccess(); // Panggil callback sukses
                onOpenChange(false);
            },
            onError: (err) => {
                console.error('Gagal memperbarui data pelajaran:', err);
                setError('Gagal memperbarui data. Periksa kembali isian Anda.');
            }
        });
    };
    
    // Fungsi untuk mereset form saat modal ditutup
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset(); // Reset form dan error saat modal ditutup
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Data Pembelajaran</DialogTitle>
                    <DialogDescription>
                        Ubah informasi terkait mata pelajaran yang telah terdaftar di sistem.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center">Memuat data...</div>
                ) : error ? (
                    <div className="py-12 text-center text-red-600">
                        <p className="font-semibold">Terjadi Kesalahan:</p>
                        <p className="text-sm">{error}</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={loadInitialData}>Coba Lagi</Button>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        <div className="space-y-4 py-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama-pelajaran" className="text-sm font-medium">Nama Mata Pelajaran</label>
                                <Input id="nama-pelajaran" value={data.nama_pelajaran} onChange={(e) => setData('nama_pelajaran', e.target.value)} required />
                                {errors.nama_pelajaran && <p className="text-sm text-red-500">{errors.nama_pelajaran}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="pengampu" className="text-sm font-medium">Pengampu</label>
                                    <Select value={data.pengampu_id > 0 ? data.pengampu_id.toString() : ""} onValueChange={(val) => setData('pengampu_id', parseInt(val))} required>
                                        <SelectTrigger><SelectValue placeholder="Pilih Pengampu" /></SelectTrigger>
                                        <SelectContent>
                                            {dataGuru.map(guru => (
                                                <SelectItem key={guru.id} value={guru.id.toString()}>{guru.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pengampu_id && <p className="text-sm text-red-500">{errors.pengampu_id}</p>}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="semester" className="text-sm font-medium">Semester</label>
                                    <Select value={data.semester.toString()} onValueChange={(val) => setData('semester', parseInt(val))} required>
                                        <SelectTrigger><SelectValue placeholder="Pilih Semester" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Semester 1</SelectItem>
                                            <SelectItem value="2">Semester 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="angkatan" className="text-sm font-medium">Untuk Angkatan</label>
                                <Input id="angkatan" type="number" placeholder="Contoh: 2025" value={data.angkatan} onChange={(e) => setData('angkatan', e.target.value)} required />
                                {errors.angkatan && <p className="text-sm text-red-500">{errors.angkatan}</p>}
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

