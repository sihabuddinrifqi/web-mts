import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GuruRequestType } from '@/types/admin/guru';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function GuruFormAddAdmin() {
    const { data, setData, post } = useForm<GuruRequestType>();
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.guru.store'));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus /> Tambah Guru
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Data Guru Baru</DialogTitle>
                        <DialogDescription>
                            Silakan isi formulir di bawah ini untuk menambahkan Guru baru ke dalam sistem pondok pesantren. Pastikan seluruh data
                            diisi dengan benar dan lengkap untuk keperluan administrasi dan pendataan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 border-t py-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="nama" className="font-medium">
                                    Nama Lengkap
                                </label>
                                <Input required id="nama" placeholder="Masukan nama lengkap" onChange={(ev) => setData('name', ev.target.value)} />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="no" className="font-medium">
                                    Nomor Telepon
                                </label>
                                <Input required id="no" placeholder="Masukan telepon" onChange={(ev) => setData('phone', ev.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="pendidikanTerakhir" className="font-medium">
                                    Pendidikan Terakhir
                                </label>
                                <Select onValueChange={(ev) => setData('pendidikan_terakhir', ev as 'SMA' | 'S1' | 'S2' | 'S3')} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih pendidikan terakhir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SMA">SMA</SelectItem>
                                        <SelectItem value="S1">S1</SelectItem>
                                        <SelectItem value="S2">S2</SelectItem>
                                        <SelectItem value="S3">S3</SelectItem>
                                    </SelectContent>
                                </Select>
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
