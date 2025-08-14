import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { fetchApi } from '@/lib/utils';
import { Siswa } from '@/types/admin/siswa';
import { APIResponse } from '@/types/response';
import { Guru } from '@/types/users';
import { Users2 } from 'lucide-react';
import { useState } from 'react';

export default function SiswaViewGuruAdmin({ id }: { id: number }) {
    const [siswa, setSiswa] = useState<Siswa[]>([]);
    const [dataGuru, setDataGuru] = useState<Guru | undefined>();

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
                    })
                }
            >
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Daftar Siswa yang Diasuh</DialogTitle>
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

                        <div className="w-48">
                            <Input
                                id="input-angkatan"
                                minLength={4}
                                maxLength={4}
                                onChange={(ev) => {
                                    if (dataGuru?.anak == undefined) return;
                                    if (ev.target.value.length != 4) {
                                        setSiswa(dataGuru.anak);
                                    } else {
                                        setSiswa(dataGuru.anak.filter((v) => v.angkatan === parseInt(ev.target.value) && v.angkatan));
                                    }
                                }}
                            />
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
                                {siswa.map((siswa, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-4">{siswa.nis}</td>
                                        <td className="px-4 py-4">{siswa.name}</td>
                                        <td className="px-4 py-4">{siswa.angkatan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
