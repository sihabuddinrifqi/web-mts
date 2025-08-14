import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';
import { Siswa } from '@/types/users';
import { FileTextIcon, Printer } from 'lucide-react';
import { useState } from 'react';

export default function TranscriptViewAdmin({ id }: { id: number }) {
    const [semester, setSemester] = useState('Ganjil');
    const [siswa, setDataSiswa] = useState<Siswa | null>(null);
    const average = siswa?.nilai?.reduce((sum, item) => sum + item.nilai, 0) / (siswa?.nilai?.length || 1);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    <FileTextIcon /> Lihat
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={(_) => {
                    fetchApi<APIResponse<Siswa>>(route('api.nilai.siswa', id)).then((resp) => {
                        setDataSiswa(resp.data);
                    });
                }}
            >
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Transkip Nilai Siswa</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Ringkasan hasil belajar siswa selama mengikuti program pendidikan di Pondok Pesantren.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 border-b">
                    <div className="flex items-end justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-sm">Nama Siswa</div>
                                <div className="font-semibold">{siswa?.name}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Angkatan</div>
                                <div className="font-semibold">{siswa?.angkatan}</div>
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
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Mata Pelajaran</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswa?.nilai?.map((nilai, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-4">{nilai.pelajaran.nama_pelajaran}</td>
                                        <td className="px-4 py-4">{nilai.semester}</td>
                                        <td className="px-4 py-4">{nilai.nilai}</td>
                                    </tr>
                                ))}
                                <tr className="bg-muted border-t">
                                    <td colSpan={2} className="px-4 py-4 font-medium">
                                        Rata rata
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium">{average.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                        <Button variant="outline">Kembali</Button>
                        <Button variant="default">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak transkrip nilai
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
