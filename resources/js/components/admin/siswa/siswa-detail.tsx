import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchApi } from '@/lib/utils';
import { APIResponse } from '@/types/response';
import { Siswa, WaliSiswa } from '@/types/users';
import { Guru } from '@/types/walisiswa/anak';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function SiswaDetail({ data }: { data: Siswa }) {
    const [dataWali, setDataWali] = useState<WaliSiswa>();
    const [dataGuru, setDataGuru] = useState<Guru>();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Search /> Detail Siswa
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={(_) => {
                    fetchApi<APIResponse<Guru>>(route('api.detail.guru', data.guru_id)).then((resp) => setDataGuru(resp.data));
                    fetchApi<APIResponse<WaliSiswa>>(route('api.detail.walisiswa', data.ortu_id)).then((resp) => setDataWali(resp.data));
                }}
            >
                <DialogHeader>
                    <DialogTitle>Detail Data Siswa Baru</DialogTitle>
                    <DialogDescription>Detail data siswa yang tercatat di sistem.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 border-t py-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nik" className="font-medium">
                                NIK
                            </label>
                            <Input id="nik" placeholder="Masukan NIK" value={data.nik} maxLength={16} minLength={16} readOnly />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama" className="font-medium">
                                Nama Lengkap
                            </label>
                            <Input id="nama" placeholder="Masukan nama lengkap" value={data.name} readOnly />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="jenisKelamin" className="font-medium">
                                Jenis Kelamin
                            </label>
                            <Input id="gander" placeholder="Jenis Kelamin" value={data.jenis_kelamin} readOnly />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="tempatLahir" className="font-medium">
                                Tempat Lahir
                            </label>
                            <Input id="lahir" placeholder="Tempat Lahir" value={data.tempat_lahir} readOnly />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="tanggalLahir" className="font-medium">
                                Tanggal Lahir
                            </label>
                            <Input id="date" placeholder="Tempat Lahir" value={data.tanggal_lahir.toString()} readOnly />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="angkatan" className="font-medium">
                                Angkatan
                            </label>
                            <Input name="angkatan" id="angkatan" placeholder="contoh: 2025" type="number" value={data.angkatan} readOnly />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="peran" className="font-medium">
                                Peran
                            </label>
                            <Input id="peran" placeholder="Peran" value={data.role} readOnly />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="guru" className="font-medium">
                                Guru Pembimbing
                            </label>
                            <Input id="date" placeholder="Guru Pembimbing" value={dataGuru?.name} readOnly />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="wali" className="font-medium">
                                Nama Orang Tua / Wali
                            </label>
                            <Input id="ortu" placeholder="Wali" value={dataWali?.name} readOnly />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="alamat" className="font-medium">
                            Alamat
                        </label>
                        <Textarea id="alamat" placeholder="Masukan alamat lengkap" rows={3} value={data.alamat} readOnly />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
