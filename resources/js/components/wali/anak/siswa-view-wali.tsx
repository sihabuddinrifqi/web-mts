'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Siswa } from '@/types/users';
import { APIResponse } from '@/types/response';

// Definisikan tipe data yang dibutuhkan secara lokal
// Untuk solusi permanen, ekspor tipe ini dari file tipe utama Anda
interface Pelajaran {
    nama_pelajaran: string;
    semester: number | string;
}

interface Nilai {
    id: number;
    pelajaran: Pelajaran;
    semester: string;
    nilai: number; // Nilai akhir yang akan ditampilkan
}

export default function SiswaViewAdmin({ id }: { id: number }) {
    const [semester, setSemester] = useState('Semua');
    const [siswaData, setSiswaData] = useState<Siswa | null>(null);

    // Fetch data when the dialog opens
    useEffect(() => {
        if (id) {
            fetch(route('api.nilai.siswa', id))
                .then(response => response.json())
                .then((resp: APIResponse<Siswa>) => {
                    setSiswaData(resp.data);
                })
                .catch(error => console.error('Error fetching student data:', error));
        }
    }, [id]);

    // Dapatkan daftar semester unik dari data nilai siswa
    const availableSemesters = useMemo(() => {
        if (!siswaData?.nilai) return [];
        const semesters = Array.from(new Set(siswaData.nilai.map((nilai) => nilai.semester)));
        return semesters.sort();
    }, [siswaData?.nilai]);

    // Filter data nilai berdasarkan semester yang dipilih
    const filteredGrades = useMemo(() => {
        if (!siswaData?.nilai) return [];
        if (semester === 'Semua') return siswaData.nilai;
        return siswaData.nilai.filter((nilai) => nilai.semester === semester);
    }, [siswaData?.nilai, semester]);

    // Hitung rata-rata keseluruhan dari data yang sudah difilter
    const overallAverage = useMemo(() => {
        if (!filteredGrades || filteredGrades.length === 0) return 0;
        
        const total = filteredGrades.reduce((sum, item) => sum + item.nilai, 0);
        return parseFloat((total / filteredGrades.length).toFixed(2));
    }, [filteredGrades]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    <Search className="mr-2 h-4 w-4" /> Detail Siswa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-2xl">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Transkrip Nilai Siswa</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Ringkasan hasil belajar siswa selama mengikuti program pendidikan.
                    </DialogDescription>
                </DialogHeader>

                {!siswaData ? (
                    <div className="py-12 text-center">Memuat data siswa...</div>
                ) : (
                    <>
                        <div className="space-y-6 border-b py-4">
                            <div className="flex items-end justify-between">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-sm">Nama Siswa</div>
                                        <div className="font-semibold">{siswaData.name}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm">Angkatan</div>
                                        <div className="font-semibold">{siswaData.angkatan}</div>
                                    </div>
                                </div>
                                <div className="w-48">
                                    <Select value={semester} onValueChange={setSemester}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Semua">Semua</SelectItem>
                                            {availableSemesters.map((sem) => (
                                                <SelectItem key={sem} value={sem}>
                                                    {sem}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-left font-medium">Semester</th>
                                            <th className="px-4 py-3 text-right font-medium">Nilai</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGrades.length > 0 ? (
                                            filteredGrades.map((nilai, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-2">{nilai.pelajaran.nama_pelajaran}</td>
                                                    <td className="px-4 py-2">{nilai.semester}</td>
                                                    <td className="px-4 py-2 text-right font-semibold">{nilai.nilai}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="border-t">
                                                <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">
                                                    Tidak ada data nilai untuk semester ini.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredGrades.length > 0 && (
                                            <tr className="bg-muted border-t font-bold">
                                                <td colSpan={2} className="px-4 py-2 text-right">
                                                    Rata-Rata
                                                </td>
                                                <td className="px-4 py-2 text-right">{overallAverage}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <DialogFooter>
                            <div className="flex w-full items-center justify-end">
                                <Button asChild>
                                    <a href={route('nilai.transcript', siswaData.nis)} target="_blank" rel="noopener noreferrer">
                                        <Printer className="mr-2 h-4 w-4" />
                                        Cetak Transkrip Nilai
                                    </a>
                                </Button>
                            </div>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
