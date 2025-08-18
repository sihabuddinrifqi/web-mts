'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Siswa } from '@/types/users'; 
import { APIResponse } from '@/types/response';

// FIX: Define types locally to resolve export/property errors.
// For a permanent solution, ensure these interfaces are correctly defined and exported from your main types files.
interface NilaiDetail {
    id?: number;
    jenis: 'UH' | 'PTS' | 'PAS';
    nilai: number;
}

interface Pelajaran {
    nama_pelajaran: string;
    semester: number | string;
}

interface Nilai {
    id: number;
    pelajaran: Pelajaran;
    detail?: NilaiDetail[];
}

// Helper function to find a specific grade from the detail array
const findGrade = (details: NilaiDetail[] | undefined, type: 'UH' | 'PTS' | 'PAS'): number => {
    if (!details) return 0;
    const found = details.find((d) => d.jenis === type);
    return found ? found.nilai : 0;
};

// Helper function to calculate the average of three grades
const calculateAverage = (uh: number, pts: number, pas: number): number => {
    const average = (uh + pts + pas) / 3;
    return parseFloat(average.toFixed(2));
};

export default function SiswaViewAdmin({ id }: { id: number }) {
    const [semester, setSemester] = useState('Ganjil');
    const [siswaData, setSiswaData] = useState<Siswa | null>(null);

    // Fetch data when the dialog opens
    useEffect(() => {
        if (id) {
            // Use the standard browser fetch API
            fetch(route('api.nilai.siswa', id))
                .then(response => response.json())
                .then((resp: APIResponse<Siswa>) => {
                    setSiswaData(resp.data);
                })
                .catch(error => console.error('Error fetching student data:', error));
        }
    }, [id]);

    // Filter grades based on the selected semester
    const filteredGrades = siswaData?.nilai?.filter(n => n.pelajaran.semester.toString() === semester) || [];

    // Calculate overall average from the filtered grades' details
    const overallAverage = () => {
        if (!filteredGrades || filteredGrades.length === 0) return 0;
        
        const totalOfAverages = filteredGrades.reduce((sum, item) => {
            const uh = findGrade(item.detail, 'UH');
            const pts = findGrade(item.detail, 'PTS');
            const pas = findGrade(item.detail, 'PAS');
            return sum + calculateAverage(uh, pts, pas);
        }, 0);

        return parseFloat((totalOfAverages / filteredGrades.length).toFixed(2));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    <Search className="mr-2 h-4 w-4" /> Detail Siswa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-4xl">
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
                                            <SelectItem value="Ganjil">Ganjil</SelectItem>
                                            <SelectItem value="Genap">Genap</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-center font-medium">UH</th>
                                            <th className="px-4 py-3 text-center font-medium">PTS</th>
                                            <th className="px-4 py-3 text-center font-medium">PAS</th>
                                            <th className="px-4 py-3 text-center font-medium">Rata-Rata</th>
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
                                                        <td className="px-4 py-2 text-center">{uh}</td>
                                                        <td className="px-4 py-2 text-center">{pts}</td>
                                                        <td className="px-4 py-2 text-center">{pas}</td>
                                                        <td className="px-4 py-2 text-center font-semibold">{average}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr className="border-t">
                                                <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                                                    Tidak ada data nilai untuk semester ini.
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-muted border-t font-bold">
                                            <td colSpan={4} className="px-4 py-2 text-right">
                                                Rata-Rata Keseluruhan
                                            </td>
                                            <td className="px-4 py-2 text-center">{overallAverage()}</td>
                                        </tr>
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
