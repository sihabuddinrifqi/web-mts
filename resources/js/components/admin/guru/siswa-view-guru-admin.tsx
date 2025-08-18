import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/utils';
import { Siswa } from '@/types/admin/siswa';
import { APIResponse } from '@/types/response';
import { Guru } from '@/types/users';
import { Users2 } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function SiswaViewGuruAdmin({ id }: { id: number }) {
    const [siswa, setSiswa] = useState<Siswa[]>([]);
    const [dataGuru, setDataGuru] = useState<Guru | undefined>();
    const [filterAngkatan, setFilterAngkatan] = useState('Semua');

    // Filter data siswa berdasarkan angkatan yang dipilih
    const filteredSiswa = useMemo(() => {
        if (filterAngkatan === 'Semua') return siswa;
        return siswa.filter(s => s.angkatan?.toString() === filterAngkatan);
    }, [siswa, filterAngkatan]);

    // Dapatkan daftar angkatan unik dari data siswa
    const availableAngkatan = useMemo(() => {
        if (!siswa || siswa.length === 0) return [];
        const angkatanList = Array.from(new Set(
            siswa
                .map(s => s.angkatan)
                .filter(angkatan => angkatan !== null && angkatan !== undefined)
                .map(angkatan => angkatan.toString())
        ));
        return angkatanList.sort();
    }, [siswa]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size={'sm'}>
                    <Users2 /> Lihat Siswa
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={(_) =>
                    fetchApi<APIResponse<Guru>>(route('api.detail.guru', id)).then((resp) => {
                        setDataGuru(resp.data);
                        setSiswa(resp.data.anak || []);
                        setFilterAngkatan('Semua'); // Reset filter when data loads
                    })
                }
            >
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Daftar Siswa yang Diajar</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Menampilkan daftar siswa yang berada dalam bimbingan atau pengawasan guru tertentu.
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
                                Angkatan
                            </label>
                            <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Angkatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua">Semua</SelectItem>
                                    {availableAngkatan.map((angkatan) => (
                                        <SelectItem key={angkatan} value={angkatan}>
                                            {angkatan}
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
                                    <th className="px-4 py-3 text-left text-sm font-medium">NIS</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Nama siswa</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Angkatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSiswa.length > 0 ? (
                                    filteredSiswa.map((siswa, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-4">{siswa.nis}</td>
                                            <td className="px-4 py-4">{siswa.name}</td>
                                            <td className="px-4 py-4">{siswa.angkatan}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-t">
                                        <td colSpan={3} className="text-muted-foreground px-4 py-8 text-center">
                                            {siswa.length === 0 ? 'Tidak ada data siswa' : `Tidak ada siswa untuk angkatan ${filterAngkatan}`}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredSiswa.length > 0 && (
                        <div className="text-muted-foreground text-center text-sm">
                            Menampilkan {filteredSiswa.length} dari {siswa.length} siswa
                            {filterAngkatan !== 'Semua' && ` (Angkatan ${filterAngkatan})`}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}