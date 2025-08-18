import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';
import { Guru } from '@/types/walisiswa/anak';
import { BookOpen } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function LessonViewGuruAdmin({ id }: { id: number }) {
    const [semester, setSemester] = useState('Semua');
    const [dataGuru, setDataGuru] = useState<Guru | undefined>();

    // Get unique semesters from the data
    const availableSemesters = useMemo(() => {
        if (!dataGuru?.pelajaran) return [];
        const semesters = [...new Set(dataGuru.pelajaran.map((grade) => grade.semester))];
        return semesters.sort();
    }, [dataGuru?.pelajaran]);

    // Filter data based on selected semester
    const filteredPelajaran = useMemo(() => {
        if (!dataGuru?.pelajaran) return [];
        if (semester === 'Semua') return dataGuru.pelajaran;
        return dataGuru.pelajaran.filter((grade) => grade.semester.toString() === semester);
    }, [dataGuru?.pelajaran, semester]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    <BookOpen /> Lihat Pelajaran
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={(ev) => fetchApi<APIResponse<Guru>>(route('api.detail.guru', id)).then((resp) => setDataGuru(resp.data))}
            >
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Daftar Mata Pelajaran yang Diampu</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Informasi lengkap mengenai mata pelajaran yang diajarkan oleh seorang guru.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 border-b">
                    <div className="flex items-end justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-sm">Nama Guru</div>
                                <div className="font-semibold">{dataGuru?.name}</div>
                            </div>
                        </div>

                        <div className="w-48 space-y-1">
                            <label className="text-sm" htmlFor="">
                                Semester
                            </label>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua">Semua</SelectItem>
                                    {availableSemesters.map((sem) => (
                                        <SelectItem key={sem} value={sem.toString()}>
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
                                    <th className="px-4 py-3 text-left text-sm font-medium">Mata Pelajaran</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPelajaran.length > 0 ? (
                                    filteredPelajaran.map((grade, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-4">{grade.nama_pelajaran}</td>
                                            <td className="px-4 py-4">{grade.semester}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-muted-foreground px-4 py-8 text-center">
                                            {dataGuru ? 'Tidak ada mata pelajaran untuk semester yang dipilih' : 'Memuat data...'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
