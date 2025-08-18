import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchableMultiSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/utils';
import { Siswa } from '@/types/admin/siswa';
import { PelajaranRequest } from '@/types/requests/pelajaran.request';
import { APIPaginateResponse, APIResponse } from '@/types/response';
import { Guru } from '@/types/walisiswa/anak';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function PelajaranFormAddAdmin() {
    const [dataGuru, setDataGuru] = useState<Guru[]>([]);
    const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const { data, post, setData } = useForm<PelajaranRequest>({
        siswa_ids: [],
        pengampu_id: -1,
        semester: -1,
        nama_pelajaran: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.pelajaran.store'));
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus /> Tambah Mata Pelajaran
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Tambah Data Mata Pelajaran Baru</DialogTitle>
                    <DialogDescription>
                        Silakan isi formulir di bawah ini untuk menambahkan mata pelajaran baru ke dalam sistem pondok pesantren. Pastikan seluruh
                        data diisi dengan benar dan lengkap untuk keperluan administrasi dan pendataan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama-pelajaran" className="text-sm font-medium">
                                Nama Mata Pelajaran
                            </label>
                            <Input id="nama-pelajaran" onChange={(ev) => setData('nama_pelajaran', ev.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="pengampu" className="text-sm font-medium">
                                    Pengampu
                                </label>
                                <Select onValueChange={(ev) => setData('pengampu_id', parseInt(ev))}>
                                    <SelectTrigger
                                        onClick={(ev) =>
                                            fetchApi<APIPaginateResponse<Guru>>('/api/guru').then((resp) => setDataGuru(resp.data))
                                        }
                                    >
                                        <SelectValue placeholder="Pilih Pengampu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataGuru.map((v) => (
                                            <SelectItem key={`${v.name}-${v.id}`} value={`${v.id}`}>
                                                {v.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="semester" className="text-sm font-medium">
                                    Semester
                                </label>
                                <Input id="input-semester" type="number" onChange={(ev) => setData('semester', parseInt(ev.target.value))} />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Pilih Siswa</label>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="angkatan-siswa"
                                    placeholder="Ketik Angkatan (cth: 2022)"
                                    maxLength={4}
                                    minLength={4}
                                    type="number"
                                    onChange={(ev) => {
                                        if (ev.target.value.length != 4) return;
                                        fetchApi<APIResponse<Siswa[]>>(route('api.siswa.angkatan', ev.target.value)).then((resp) =>
                                            setDataSiswa(resp.data),
                                        );
                                    }}
                                />
                                <SearchableMultiSelect
                                    options={dataSiswa.map((v) => ({ id: v.id, name: v.name }))}
                                    placeholder="Pilih Siswa"
                                    value={data.siswa_ids}
                                    onChange={(v) => setData('siswa_ids', v)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" variant={'default'}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
