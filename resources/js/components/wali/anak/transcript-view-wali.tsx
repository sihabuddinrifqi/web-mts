'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APIResponse } from '@/types/response';
import { Siswa } from '@/types/users';
import { AlertCircle, Printer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// --- Tipe Data Lokal ---
interface NilaiDetail {
    id?: number;
    jenis: 'UH' | 'PTS' | 'PAS';
    nilai: number;
}

interface Pelajaran {
    nama_pelajaran: string;
}

interface Nilai {
    id: number;
    pelajaran: Pelajaran;
    detail?: NilaiDetail[];
    semester: string;
}

interface SiswaWithNilai extends Siswa {
    nilai?: Nilai[];
}

// --- Fungsi Bantuan ---
const findGrade = (details: NilaiDetail[] | undefined, type: 'UH' | 'PTS' | 'PAS'): number => {
    if (!details) return 0;
    const found = details.find((d) => d.jenis === type);
    return found ? found.nilai : 0;
};

const calculateAverage = (uh: number, pts: number, pas: number): number => {
    if (uh === 0 && pts === 0 && pas === 0) return 0;
    const average = (uh + pts + pas) / 3;
    return parseFloat(average.toFixed(2));
};

export default function TranscriptViewWali({ id }: { id: number }) {
    const [semester, setSemester] = useState('Semua');
    const [siswaData, setSiswaData] = useState<SiswaWithNilai | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ambil data siswa saat dialog dibuka.
    useEffect(() => {
        if (isOpen && id && !siswaData && !isLoading) {
            setIsLoading(true);
            setError(null); // Reset error setiap kali membuka
            
            console.log(`Mencoba mengambil data untuk siswa ID: ${id}`);

            fetch(route('api.nilai.siswa', id))
                .then((response) => {
                    if (!response.ok) {
                        // Jika status response bukan 2xx (misal: 404, 500)
                        throw new Error(`Gagal mengambil data. Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((resp: APIResponse<SiswaWithNilai>) => {
                    console.log('--- DEBUG: Respon API Diterima ---');
                    console.log(resp); // Tampilkan seluruh respon API di console
                    
                    if (resp && resp.data) {
                        setSiswaData(resp.data);
                    } else {
                        // Jika respon sukses tapi tidak ada 'data'
                        throw new Error('Struktur data dari API tidak valid.');
                    }
                })
                .catch((err) => {
                    console.error('--- DEBUG: Terjadi Error Saat Fetch ---', err);
                    setError(err.message || 'Terjadi kesalahan saat mengambil data siswa.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, isOpen]);

    // Reset state saat dialog ditutup
    useEffect(() => {
        if (!isOpen) {
            setSiswaData(null);
            setError(null);
            setIsLoading(false);
            setSemester('Semua');
        }
    }, [isOpen]);

    const availableSemesters = useMemo(() => {
        if (!siswaData?.nilai) return [];
        const semesters = Array.from(new Set(siswaData.nilai.map((nilai) => nilai.semester)));
        return semesters.sort();
    }, [siswaData?.nilai]);

    const filteredGrades = useMemo(() => {
        if (!siswaData?.nilai) return [];
        if (semester === 'Semua') return siswaData.nilai;
        return siswaData.nilai.filter((nilai) => nilai.semester === semester);
    }, [siswaData?.nilai, semester]);

    const overallAverage = useMemo(() => {
        if (!filteredGrades || filteredGrades.length === 0) return 0;
        const totalOfAverages = filteredGrades.reduce((sum, item) => {
            const uh = findGrade(item.detail, 'UH');
            const pts = findGrade(item.detail, 'PTS');
            const pas = findGrade(item.detail, 'PAS');
            return sum + calculateAverage(uh, pts, pas);
        }, 0);
        const validGradesCount = filteredGrades.filter(item => calculateAverage(findGrade(item.detail, 'UH'), findGrade(item.detail, 'PTS'), findGrade(item.detail, 'PAS')) > 0).length;
        if (validGradesCount === 0) return 0;
        return parseFloat((totalOfAverages / validGradesCount).toFixed(2));
    }, [filteredGrades]);

    // Fungsi untuk render konten dialog
    const renderContent = () => {
        if (isLoading) {
            return <div className="py-12 text-center">Memuat data nilai siswa...</div>;
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-destructive">
                    <AlertCircle className="h-12 w-12" />
                    <h3 className="font-semibold">Gagal Memuat Data</h3>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (!siswaData) {
            return <div className="py-12 text-center">Tidak ada data siswa untuk ditampilkan.</div>;
        }

        return (
            <>
                <div className="space-y-6 py-4">
                    {/* Informasi Siswa dan Filter Semester */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Nama Siswa</div>
                                <div className="font-semibold">{siswaData.name}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Angkatan</div>
                                <div className="font-semibold">{siswaData.angkatan}</div>
                            </div>
                        </div>
                        <div className="w-full sm:w-48">
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua">Semua Semester</SelectItem>
                                    {availableSemesters.map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                            {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabel Nilai */}
                    <div className="overflow-hidden rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Mata Pelajaran</th>
                                    <th className="w-20 px-4 py-3 text-center font-medium">UH</th>
                                    <th className="w-20 px-4 py-3 text-center font-medium">PTS</th>
                                    <th className="w-20 px-4 py-3 text-center font-medium">PAS</th>
                                    <th className="w-24 px-4 py-3 text-center font-medium">Rata-Rata</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrades.length > 0 ? (
                                    filteredGrades.map((nilai, index) => {
                                        const uh = findGrade(nilai.detail, 'UH');
                                        const pts = findGrade(nilai.detail, 'PTS');
                                        const pas = findGrade(nilai.detail, 'PAS');
                                        const average = calculateAverage(uh, pts, pas);
                                        return (
                                            <tr key={index} className="border-t">
                                                <td className="px-4 py-2">{nilai.pelajaran.nama_pelajaran}</td>
                                                <td className="px-4 py-2 text-center">{uh || '-'}</td>
                                                <td className="px-4 py-2 text-center">{pts || '-'}</td>
                                                <td className="px-4 py-2 text-center">{pas || '-'}</td>
                                                <td className="px-4 py-2 text-center font-semibold">{average || '-'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="border-t">
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            Tidak ada data nilai untuk semester ini.
                                        </td>
                                    </tr>
                                )}
                                {filteredGrades.length > 0 && (
                                    <tr className="border-t bg-muted font-bold">
                                        <td colSpan={4} className="px-4 py-2.5 text-right">
                                            Rata-Rata Keseluruhan
                                        </td>
                                        <td className="px-4 py-2.5 text-center">{overallAverage}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex w-full items-center justify-end">
                        <Button asChild disabled={!siswaData.nis}>
                            <a href={siswaData.nis ? route('nilai.transcript', siswaData.nis) : '#'} target="_blank" rel="noopener noreferrer">
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak Transkrip
                            </a>
                        </Button>
                    </div>
                </DialogFooter>
            </>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    Transkip Nilai
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-4xl">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Transkrip Nilai Siswa</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Ringkasan hasil belajar siswa selama mengikuti program pendidikan.
                    </DialogDescription>
                </DialogHeader>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}
