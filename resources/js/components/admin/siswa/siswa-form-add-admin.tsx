import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { fetchApi } from '@/lib/utils';
import { SiswaRequestType } from '@/types/admin/siswa';
import { APIPaginateResponse } from '@/types/response';
import { WaliSiswa } from '@/types/users';
import { Guru } from '@/types/walisiswa/anak';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function SiswaFormAddAdmin() {
    const { data, setData, post } = useForm<SiswaRequestType>({
        name: '',
        nik: '', // string to handle large numbers safely
        alamat: '',
        tempat_lahir: '',
        tanggal_lahir: new Date().toISOString(), // ISO date string
        angkatan: new Date().getFullYear(),
        jenis_kelamin: 'pria',
        siswa_role: 'regular',
        guru_id: -1,
        ortu_id: -1,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.siswa.store'));
    };

    const [dataWali, setDataWali] = useState<WaliSiswa[]>([]);
    const [dataGuru, setDataGuru] = useState<Guru[]>([]);

    // Load data on component mount
    useEffect(() => {
        fetchApi<APIPaginateResponse<Guru>>('/api/guru').then((resp) => setDataGuru(resp.data));
        fetchApi<APIPaginateResponse<WaliSiswa>>('/api/walisiswa').then((resp) => setDataWali(resp.data));
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus /> Tambah Siswa
                </Button>
            </DialogTrigger>
            <DialogContent className="min-h-screen overflow-y-auto sm:max-w-[625px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Data Siswa Baru</DialogTitle>
                        <DialogDescription>
                            Silakan isi formulir di bawah ini untuk menambahkan siswa baru ke dalam sistem pondok pesantren. Pastikan seluruh data
                            diisi dengan benar dan lengkap untuk keperluan administrasi dan pendataan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 border-t py-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nik" className="font-medium">
                                    NIK
                                </label>
                                <Input
                                    id="nik"
                                    placeholder="Masukan NIK"
                                    onChange={(ev) => setData('nik', ev.target.value)}
                                    maxLength={16}
                                    minLength={16}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama" className="font-medium">
                                    Nama Lengkap
                                </label>
                                <Input id="nama" placeholder="Masukan nama lengkap" onChange={(ev) => setData('name', ev.target.value)} required />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="jenisKelamin" className="font-medium">
                                    Jenis Kelamin
                                </label>
                                <Select onValueChange={(ev) => setData('jenis_kelamin', ev as 'pria' | 'wanita')} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pria">Pria</SelectItem>
                                        <SelectItem value="wanita">Wanita</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tempatLahir" className="font-medium">
                                    Tempat Lahir
                                </label>
                                <Input
                                    id="tempatLahir"
                                    placeholder="Masukan Tempat Lahir"
                                    onChange={(ev) => setData('tempat_lahir', ev.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tanggalLahir" className="font-medium">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    id="tanggalLahir"
                                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={(ev) => setData('tanggal_lahir', ev.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="alamat" className="font-medium">
                                Alamat
                            </label>
                            <Textarea
                                id="alamat"
                                placeholder="Masukan alamat lengkap"
                                rows={3}
                                onChange={(ev) => setData('alamat', ev.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="angkatan" className="font-medium">
                                    Angkatan
                                </label>
                                <Input
                                    name="angkatan"
                                    id="angkatan"
                                    placeholder="contoh: 2025"
                                    type="number"
                                    onChange={(ev) => setData('angkatan', parseInt(ev.target.value) || 2025)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="peran" className="font-medium">
                                    Peran
                                </label>
                                <Select onValueChange={(ev) => setData('siswa_role', ev as 'regular' | 'pengurus')} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Regular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="pengurus">Pengurus</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="guru" className="font-medium">
                                    Guru Pembimbing
                                </label>
                                <SearchableSelect
                                    options={dataGuru}
                                    placeholder="Cari dan pilih guru..."
                                    value={data.guru_id}
                                    onChange={(value) => setData('guru_id', value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="wali" className="font-medium">
                                    Nama Orang Tua / Wali
                                </label>
                                <SearchableSelect
                                    options={dataWali}
                                    placeholder="Cari dan pilih wali..."
                                    value={data.ortu_id}
                                    onChange={(value) => setData('ortu_id', value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
